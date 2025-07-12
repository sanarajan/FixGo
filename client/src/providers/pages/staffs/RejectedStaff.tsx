import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProviderLayout from "../../../components/providerLayout/ProviderLayout";
import { validateForm } from "./VallidateAddStaff";
import { ToastContainer, toast } from "react-toastify";
import axiosClient from "../../../api/axiosClient";
import LocationPicker from "../../../components/LocationPicker/LocationPicker";
import LocationAutocomplete from "../../../components/LocationPicker/LocationAutocomplete";
import StaffServices from "../../../components/popups/staffs/StaffServices";
import "react-toastify/dist/ReactToastify.css";

type Subcategory = {
  _id: string;
  name: string;
};

type GroupedProviderService = {
  serviceId: string;
  serviceName: string;
  subcategories: Subcategory[];
};

interface CustomersProps {
  userType: string;
}

const RejectedStaff: React.FC<CustomersProps> = ({ userType }) => {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const staffItem = routerLocation.state;
  const staffId = staffItem.staffId;

  const [formData, setFormData] = useState({
    staffid: "",
    fullname: "",
    email: "",
    phone: "",
    location: "",
    image: null as File | null,
    role: "provider",
    verified: false,
  });

  const [selectedServices, setSelectedServices] = useState<{
    [key: string]: string[];
  }>({});
  const [servicesData, setServicesData] = useState<GroupedProviderService[]>(
    []
  );
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [locationAddress, setLocationAddress] = useState<string | null>(null);
  const [isStaffVerified, setIsStaffVerified] = useState<boolean>(false);
  const [rejected, setRejected] = useState<boolean>(
    staffItem.rejected || false
  );
  const [reason, setReason] = useState<string | null>(null);
  const googlekey = import.meta.env.VITE_GOOGLEAPI_KEY;
  const API = import.meta.env.VITE_API_URL;
  const imagePath = "providerServices/";

  useEffect(() => {
    if (!staffItem?.staffId || !staffItem.rejected) {
      toast.error("Invalid staff data");
      navigate("/provider/staffs");
      return;
    }

    fetchStaffData(staffId);
    fetchServiceAndSubcategories();
  }, []);
  useEffect(() => {
    if (coordinates) {
      console.log(coordinates.lat + " is the latitude");
    }
  }, [coordinates]);

  const fetchStaffData = async (staffId: string) => {
    try {
      const response = await axiosClient.get(
        `/api/provider/fetchRejectedStaff/${staffId}`,
        {
          headers: { userRole: userType },
        }
      );
      if (response.status === 200 && response.data?.rejectionReason) {
        const staff = response.data;
        console.log(JSON.stringify(response.data, null, 2) + " response data");
        console.log(
          response.data.address?.latitude + " is the latitude from response"
        );
        if (staff.rejectionReason) {
          setRejected(true);
          setReason(staff.rejectionReason);
        }
        setFormData({
          staffid: staff._id,
          fullname: staff.fullname || "",
          email: staff.email || "",
          phone: staff.phone || "",
          location: staff.address?.location || "",
          image: staff.image || "noimage.png",
          role: staff.role || "provider",
          verified: staff.verified || false,
        });

        setCoordinates({
          lat: staff.address?.latitude,
          lng: staff.address?.longitude,
        });

        setIsStaffVerified(staff.verified || false);
        setLocationAddress(staff.address?.location || "");
      } else {
        toast.error("Staff is not rejected or not found.");
        navigate("/provider/staffs");
      }
    } catch (error) {
      console.error("Error fetching staff data", error);
      toast.error("Failed to fetch staff data");
    }
  };
  console.log(rejected + " is the rejected state");
  const fetchServiceAndSubcategories = async () => {
    try {
      const response = await axiosClient.get(
        "/api/provider/listingServiceForStaff",
        {
          headers: { userRole: userType },
        }
      );
      if (response.status === 200) {
        setServicesData(response.data.services);
      }
    } catch (error) {
      console.error("Service fetch failed", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.length) {
      const file = files[0];
      if (
        ![
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/gif",
          "image/webp",
        ].includes(file.type)
      ) {
        toast.error("Unsupported file type");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB");
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationSelect = (coords: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setCoordinates({ lat: coords.lat, lng: coords.lng });
    setLocationAddress(coords.address);
    setFormData((prev) => ({ ...prev, location: coords.address }));
  };

  const handleSubmit = async () => {
    const { isValid, errors } = validateForm(formData);
    if (!isValid) {
      setFormErrors(errors);
      toast.error("Please fix form errors");
      return;
    }

    if (!locationAddress || !coordinates) {
      toast.error("Location is required");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("fullname", formData.fullname);
    formPayload.append("email", formData.email);
    formPayload.append("phone", formData.phone);
    formPayload.append("username", "");
    formPayload.append("type", "staff");
    formPayload.append("rejected", "true");
    formPayload.append("location", locationAddress);
    formPayload.append("latitude", coordinates.lat.toString());
    formPayload.append("longitude", coordinates.lng.toString());

    if (formData.image) formPayload.append("image", formData.image);

    try {
      const response = await axiosClient.patch(
        `/api/provider/editStaff/${formData.staffid}`,
        formPayload,
        {
          headers: { userRole: userType },
        }
      );

      if (response.status === 200) {
        toast.success("Rejected staff updated successfully");
        navigate("/provider/staffs");
      } else {
        toast.error("Failed to update rejected staff");
      }
    } catch (error) {
      console.error("Update error", error);
      toast.error("Error updating staff");
    }
  };

  const imageURL =
    formData.image instanceof File
      ? URL.createObjectURL(formData.image)
      : formData.image !== "noimage.png"
      ? `${API}/uploads/${imagePath}${formData.image}`
      : "noimage.png";
  return (
    <ProviderLayout>
      <div className="p-6 rounded-xl shadow-xl bg-white space-y-8 max-w-4xl mx-auto">
        <ToastContainer position="top-center" autoClose={3000} />

        <h2 className="text-2xl font-bold text-[#5A52A4]">Edit Staff</h2>
        {rejected && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md">
            <h3 className="font-bold text-lg mb-1">Staff Rejected!</h3>
            <p className="text-sm">
              <span className="font-medium">Reason:</span> {reason}
            </p>
            <p className="text-sm">You can edit here for reverification</p>
          </div>
        )}
        {/* Basic Info */}
        <div className="p-5 rounded-md border border-gray-300 bg-[#F9F9FC] space-y-4">
          <h2 className="text-2xl font-bold text-[#5A52A4]">
            Basic Information
          </h2>
          <div className="grid grid-cols-6 md:grid-cols-3 gap-2">
            <div className="md:col-span-4 flex items-center gap-4">
              <input
                type="file"
                name="image"
                className="bg-[rgb(234,232,248)] p-2 rounded-md w-65"
                onChange={handleInputChange}
              />
              <img src={imageURL} className="h-[100px] w-[100px]" />
              {formErrors.image && (
                <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>
              )}
            </div>

            <div className="flex flex-col">
              <input
                name="fullname"
                placeholder="Full Name"
                className="bg-[#EAE8F8] p-3 rounded-md"
                value={formData.fullname}
                onChange={handleInputChange}
              />
              {formErrors.fullname && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.fullname}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <input
                name="email"
                placeholder="Email"
                className="bg-[#EAE8F8] p-3 rounded-md w-full"
                value={formData.email}
                onChange={handleInputChange}
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>

            <div className="flex flex-col">
              <input
                name="phone"
                placeholder="Phone Number"
                className="bg-[#EAE8F8] p-3 rounded-md"
                value={formData.phone}
                onChange={handleInputChange}
              />
              {formErrors.phone && (
                <span className="text-red-500 text-sm mt-1">
                  {formErrors.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="p-5 rounded-md border border-gray-300 bg-[#F9F9FC]">
          <h2 className="text-2xl font-bold text-[#5A52A4] mb-4">Address</h2>
          <div className="flex flex-col">
            <label className="font-medium text-sm mb-1">Location</label>
            <LocationAutocomplete
              locationAddress={locationAddress || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const input = e.target.value;
                setLocationAddress(input);
                setFormData((prev) => ({ ...prev, location: input }));
              }}
              onSelect={handleLocationSelect}
            />
            {formErrors.location && (
              <span className="text-red-500 text-sm mt-1">
                {formErrors.location}
              </span>
            )}
          </div>
          <LocationPicker
            coordinates={coordinates}
            onLocationSelect={handleLocationSelect}
          />
          {formErrors.location && (
            <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>
          )}
        </div>

        {/* Save Button */}
        <div className="pt-4 text-center">
          <button
            onClick={handleSubmit}
            className="bg-[#7879CA] text-white font-semibold px-8 py-2 rounded-full hover:bg-[#5f61b1]"
          >
            Save Staff
          </button>
        </div>
      </div>
    </ProviderLayout>
  );
};

export default RejectedStaff;

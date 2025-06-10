import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProviderLayout from "../../../components/providerLayout/ProviderLayout";
import { validateForm, isServiceSelectionValid } from "./VallidateAddStaff";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosClient from "../../../api/axiosClient";
import LocationPicker from "../../../components/LocationPicker/LocationPicker";
import { LoadScript } from "@react-google-maps/api";
import LocationAutocomplete from "../../../components/LocationPicker/LocationAutocomplete";
import { useLocation } from "react-router-dom";
import { hasDataChanged } from "./ValidationEditstaff";

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

const EditStaff: React.FC<CustomersProps> = ({ userType }) => {
  const [formData, setFormData] = useState({
    staffid: "",
    fullname: "",
    email: "",
    phone: "",
    location: "",
    image: null as File | null,
    role: "provider",
  });
  const location = useLocation();
  const staffItem = location.state;

  const [selectedServices, setSelectedServices] = useState<{
    [key: string]: string[];
  }>({});
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [expandedServices, setExpandedServices] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [servicesData, setServicesData] = useState<GroupedProviderService[]>(
    []
  );
  const [locationAddress, setLocationAddress] = useState<string | null>(null);

  useEffect(() => {
    fetchServiceAndSubcategories();
    const resolvedLocation =
      Array.isArray(staffItem.address) && staffItem.address.length
        ? staffItem.address[0].location
        : "";
    setLocationAddress(resolvedLocation);
    if (staffItem) {
      setFormData({
        staffid: staffItem._id,
        fullname: staffItem.fullname || "",
        email: staffItem.email || "",
        phone: staffItem.phone || "",
        location: staffItem.address.location || resolvedLocation || "",
        image: staffItem.image || "noimage.png",
        role: staffItem.role || "provider",
      });

      const initialSelectedServices: { [key: string]: string[] } = {};
      if (Array.isArray(staffItem.staffServices)) {
        staffItem.staffServices.forEach((item: any) => {
          const { serviceId, subcategoryId } = item;
          if (serviceId && subcategoryId) {
            if (!initialSelectedServices[serviceId]) {
              initialSelectedServices[serviceId] = [];
            }
            if (!initialSelectedServices[serviceId].includes(subcategoryId)) {
              initialSelectedServices[serviceId].push(subcategoryId);
            }
          }
        });
      }

      setCoordinates({
        lat: staffItem.address[0].latitude,
        lng: staffItem.address[0].longitude,
      });

      setSelectedServices(initialSelectedServices);
      setExpandedServices(Object.keys(initialSelectedServices));
    }
  }, []);

  const navigate = useNavigate();
 
  const fetchServiceAndSubcategories = async () => {
    try {
      const response = await axiosClient.get(
        "/api/provider/groupedProviderServices",
        {
          headers: {
            userRole: userType,
          },
        }
      );
      if (response.status === 200) {
        setServicesData(response.data.services);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setServicesData([]);
    }
  };
  // Fetch subcategories

  const toggleExpand = (serviceId: string) => {
    setExpandedServices((prev) =>
      prev.includes(serviceId) ? [] : [serviceId]
    );
  };

  const handleServiceToggle = (serviceId: string, isChecked: boolean) => {
    const service = servicesData.find((s) => s.serviceId === serviceId);
    if (!service) return;

    setSelectedServices((prev) => {
      const newSelected = { ...prev };
      if (isChecked) {
        const subIds = service.subcategories.map((sc) => sc._id);
        newSelected[serviceId] = subIds;
        setExpandedServices([serviceId]);
      } else {
        delete newSelected[serviceId];
        setExpandedServices((prevExpanded) =>
          prevExpanded.filter((id) => id !== serviceId)
        );
      }
      return newSelected;
    });
  };

  const handleSubcategoryToggle = (
    serviceId: string,
    subId: string,
    isChecked: boolean
  ) => {
    setSelectedServices((prev) => {
      const selected = prev[serviceId] || [];
      let updated = [...selected];

      if (isChecked) {
        if (!updated.includes(subId)) updated.push(subId);
      } else {
        updated = updated.filter((id) => id !== subId);
      }

      const newSelected = { ...prev };
      if (updated.length > 0) {
        newSelected[serviceId] = updated;
      } else {
        delete newSelected[serviceId];
      }

      return newSelected;
    });
  };

  const areAllServicesSelected = () => {
    return servicesData.every(
      (service) =>
        selectedServices[service.serviceId]?.length ===
        service.subcategories.length
    );
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      const all: { [key: string]: string[] } = {};
      servicesData.forEach((service) => {
        all[service.serviceId] = service.subcategories.map((sub) => sub._id);
      });
      setSelectedServices(all);
      setExpandedServices(servicesData.map((s) => s.serviceId));
    } else {
      setSelectedServices({});
      setExpandedServices([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files.length > 0) {
      const file = files[0];
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
        "image/webp",
      ];
      const maxSize = 2 * 1024 * 1024; // 2MB
      const errors: { [key: string]: string } = {};
      if (!allowedTypes.includes(file.type)) {
        errors.image = "Only JPG, PNG, GIF, or WEBP image files are allowed.";
        setFormErrors(errors);
        toast.error(errors.image);

        return;
      }

      if (file.size > maxSize) {
        errors.image = "Image size must be less than 2MB.";
        setFormErrors(errors);
        toast.error(errors.image);
        return;
      }

      // Valid image
      setFormData((prev) => ({ ...prev, image: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const { isValid, errors } = validateForm(formData);
    const serviceValid = isServiceSelectionValid(selectedServices);
    const finalLocation = locationAddress ?? formData.location;
    if (!isValid) {
      setFormErrors(errors);
      toast.error(errors.email);
      return;
    }
    if (!serviceValid) {
      setFormErrors(errors);
      toast.error("Please select services");
      return;
    }
    if (!finalLocation) {
      toast.error("Location is required");
      return;
    }

    const orgService = staffItem.staffServices || [];
    const changeService = hasDataChanged(orgService, selectedServices);

    const imageString = formData.image ? formData.image.name : null;

    const formPayload = new FormData();
    formPayload.append("fullname", formData.fullname);
    formPayload.append("email", formData.email);
    formPayload.append("username", "");

    formPayload.append("phone", formData.phone);
    formPayload.append("type", "staff");
    formPayload.append("location", finalLocation ?? "");
    formPayload.append("latitude", coordinates?.lat.toString() ?? "");
    formPayload.append("longitude", coordinates?.lng.toString() ?? "");

    if (formData.image) formPayload.append("image", formData.image);
    if (changeService) {
      formPayload.append("services", JSON.stringify(selectedServices));
      formPayload.append("oldServices", JSON.stringify(orgService));
    }
    try {
      const response = await axiosClient.patch(
        `/api/provider/editStaff/${staffItem._id}`,
        formPayload,
        {
          headers: {
            userRole: userType,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Staff updated successfully");
        navigate("/provider/staffs");
      } else {
        toast.error("Failed to update staff. Please try again.");
      }
    } catch (err) {
      console.error("Error updating staff:", err);
      toast.error("An error occurred while updating staff");
    }
  };

  const handleLocationSelect = (coords: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setLocationAddress(coords.address);
    setCoordinates({ lat: coords.lat, lng: coords.lng });
    setFormData((prev) => ({ ...prev, location: coords.address }));
  };
  const googlekey = import.meta.env.VITE_GOOGLEAPI_KEY;
  const API = import.meta.env.VITE_API_URL;

  const imagePath = "providerServices/";
  let imageURL = "";
  if (formData.image instanceof File) {
    imageURL = URL.createObjectURL(formData.image);
  } else if (
    typeof formData.image === "string" &&
    formData.image !== "noimage.png"
  ) {
    imageURL = `${API}/uploads/${imagePath}${formData.image}`;
  } else {
    imageURL = "noimage.png";
  }

  return (
    <ProviderLayout>
      <div className="p-6 rounded-xl shadow-xl bg-white space-y-8 max-w-4xl mx-auto">
        <ToastContainer position="top-center" autoClose={3000} />

        <h2 className="text-2xl font-bold text-[#5A52A4]">Edit Staff</h2>

        {/* === Section 1: Basic Information === */}
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

        {/* === Section 2: Manage Services === */}
        <div className="p-5 rounded-md border border-gray-300 bg-[#F9F9FC] space-y-4">
          <h2 className="text-2xl font-bold text-[#5A52A4]">
            Expertise Services
          </h2>
          <div>
            <label className="font-semibold mr-2">Select All Services</label>
            <input
              type="checkbox"
              checked={areAllServicesSelected()}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
          </div>

          {servicesData.map((service) => (
            <div
              key={service.serviceId}
              className="border border-[#ddd] rounded p-3 bg-white"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={
                    selectedServices[service.serviceId]?.length ===
                    service.subcategories.length
                  }
                  onChange={(e) =>
                    handleServiceToggle(service.serviceId, e.target.checked)
                  }
                />
                <div
                  className="cursor-pointer ml-3 font-semibold text-md text-[#5A52A4]"
                  onClick={() => toggleExpand(service.serviceId)}
                >
                  {service.serviceName}
                </div>
              </div>

              {expandedServices.includes(service.serviceId) && (
                <div className="ml-6 mt-2 space-y-2">
                  {service.subcategories.map((sub) => (
                    <label
                      key={sub._id}
                      className="flex items-center space-x-2 text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedServices[service.serviceId]?.includes(
                            sub._id
                          ) || false
                        }
                        onChange={(e) =>
                          handleSubcategoryToggle(
                            service.serviceId,
                            sub._id,
                            e.target.checked
                          )
                        }
                      />
                      <span>{sub.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* === Section 3: Address === */}
        <div className="p-5 rounded-md border border-gray-300 bg-[#F9F9FC]">
          <h2 className="text-2xl font-bold text-[#5A52A4] mb-4">Address</h2>
          {/* <LoadScript googleMapsApiKey={googlekey} libraries={["places"]}> */}
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
              {/* <button type="button" onClick={handleLocationClick}>
                Use My Current Location
              </button> */}
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
          {/* </LoadScript> */}

          {formErrors.location && (
            <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>
          )}
        </div>

        {/* === Save Button === */}
        <div className="pt-4 text-center">
          <button
            onClick={handleSubmit}
            className="bg-[#7879CA] text-white font-semibold px-8 py-2 rounded-full shadow hover:bg-[#6c6db3] transition-all"
          >
            Save
          </button>
        </div>
      </div>
    </ProviderLayout>
  );
};
export default EditStaff;

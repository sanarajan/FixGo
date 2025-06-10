import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import AdminLayout from "../../../components/AdminLayout/AdminLayout";
import LocationPicker from "../../../components/LocationPicker/LocationPicker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  imageValidation,
  validatePersonalFields,
} from "../../../utils/ValidationHelper";
import axiosClient from "../../../api/axiosClient";
import LocationAutocomplete from "../../../components/LocationPicker/LocationAutocomplete";
import axios, { AxiosError } from "axios";
import ProviderChangePassword from "../../../components/popups/changePassword/ProviderChangePassword";
import { useDispatch } from "react-redux";
import { updateUserImage, updateFullname } from "../../../redux/UserSlice";
interface profileProp {
  userType: string;
}

type SectionKey = "personal" | "email" | "phone" | "address";
const AdminProfile = ({ userType }: profileProp) => {
  const API = import.meta.env.VITE_API_URL;
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [locationAddress, setLocationAddress] = useState<string | null>(null);
  const [changeImage, setChangeImage] = useState({});
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(`${API}/asset/noimage.png`);
  const [errors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [editStates, setEditStates] = useState<Record<SectionKey, boolean>>({
    personal: false,
    email: false,
    phone: false,
    address: false,
  });
  const [formData, setFormData] = useState({
    email: "",
    userId: "",
    fullname: "",
    username: "",
    phone: "",
    location: "",
    image: null as File | string | null,
    role: "provider",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUserData();
  }, []);
  const fetchUserData = async () => {
    try {
      const response = await axiosClient.get(`/api/provider/providerProfile`, {
        headers: {
          userRole: userType,
        },
      });
      let data;
      if (response.status === 200) {
        data = await response.data.user;

        const imagePath = "providerServices/";
        let img;
        if (!data.image) {
          img = `${API}/asset/noimage.png`;
        } else {
          img = `${API}/uploads/${imagePath}${data.image}`;
        }
        setImageUrl(img);
        const resolvedLocation =
          Array.isArray(data.address) && data.address.length
            ? data.address[0].location
            : "";
        setLocationAddress(resolvedLocation);
        setCoordinates({
          lat: data.address[0]?.latitude,
          lng: data.address[0]?.longitude,
        });
        setFormData({
          userId: data._id,
          email: data.email || "",
          fullname: data.fullname || "",
          username: data.username || "",
          phone: data.phone || "",
          location: resolvedLocation || "",
          image: data.image,
          role: data.role || "provider",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const mapStyle = {
    width: "100%",
    height: "150px",
  };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const validationResult = imageValidation(file);

      if (validationResult !== true) {
        setFormErrors((prev) => ({
          ...prev,
          image: validationResult,
        }));
        return;
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageUrl(reader.result as string);
        };
        reader.readAsDataURL(file);

        setFormErrors((prev) => ({
          ...prev,
          image: "",
        }));
      }
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const toggleEditImage = () => {
    setIsEditingImage(!isEditingImage);
    setFormErrors({ image: "" });
  };

  const saveImage = async () => {
    let validationResult: true | string = true; // or null or undefined initially

    if (formData.image && typeof formData.image !== "string") {
      validationResult = imageValidation(formData.image);
    }
    if (validationResult !== true) {
      setFormErrors((prev) => ({
        ...prev,
        image: validationResult,
      }));
      return;
    }
    // You can send `imageUrl` to backend here
    try {
      setIsEditingImage(false);
      const formPayload = new FormData();

      if (formData.image) formPayload.append("image", formData.image);

      const response = await axiosClient.post(
        `/api/provider/saveProfileImage/`,
        formPayload,
        {
          headers: {
            userRole: userType,
          },
        }
      );
      if (response.data) {
        console.log(response.data.result);
        dispatch(updateUserImage(response.data.result));
        toast.success("Staff updated successfully");
      } else {
        toast.error("Failed to update staff. Please try again.");
      }
    } catch (err) {
      console.error("Error updating staff:", err);
      toast.error("An error occurred while updating staff");
    }
  };

  const [isEditingInfo, setIsEditingInfo] = useState(false);

  const toggleEditSection = (section: SectionKey) => {
    setEditStates((prev) => {
      const isCurrentlyOpen = prev[section];
      return {
        personal: false,
        email: false,
        phone: false,
        address: false,
        [section]: !isCurrentlyOpen, // Toggle current section
      };
    });
  };

  const handleSaveSection = async (section: SectionKey) => {
    let fieldsToValidate: ("fullname" | "username" | "phone" | "location")[] =
      [];
    const formPayload = new FormData();
    let apiEndpoint = "/api/provider/providerEditPersonal";

    switch (section) {
      case "personal":
        fieldsToValidate = ["fullname", "username"];
        formPayload.append("fullname", formData.fullname);
        formPayload.append("username", formData.username);
        break;
      case "phone":
        fieldsToValidate = ["phone"];
        formPayload.append("phone", formData.phone);
        break;
      case "address":
        fieldsToValidate = ["location"];
        formPayload.delete("image");
        const finalLocation = locationAddress ?? formData.location;
        console.log(formData.location + "  in cas");
        formPayload.append("location", finalLocation ?? "");
        formPayload.append("latitude", coordinates?.lat.toString() ?? "");
        formPayload.append("longitude", coordinates?.lng.toString() ?? "");
        apiEndpoint = "/api/provider/providerEditAddress"; // If different endpoint
        break;
      default:
        return;
    }

    const { isValid, errors } = validatePersonalFields(
      formData,
      fieldsToValidate
    );

    if (!isValid) {
      setFormErrors(errors);
      Object.values(errors).forEach((msg) => toast.error(msg));
      return;
    }

    try {
      const response = await axiosClient.patch(apiEndpoint, formPayload, {
        headers: { "Content-Type": "application/json", userRole: userType },
      });

      if (response.status === 200) {
        setFormErrors({});
        toast.success("Updated successfully");
        setEditStates((prev) => ({
          ...prev,
          [section]: false,
        }));
        if(response.data){
           dispatch(updateFullname(response.data?.fullname));
        }
      } else {
        toast.error("Failed to update. Please try again.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ error: string }>;
        const message =
          axiosErr.response?.data?.error ?? "An unexpected error occurred";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleLocationSelect = (coords: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setLocationAddress(coords.address);
    setCoordinates({ lat: coords.lat, lng: coords.lng });
    console.log(coords?.address + "  in funct");
    setFormData((prev) => ({ ...prev, location: coords.address }));
    if (coords.address) {
      setFormErrors((prev) => ({
        ...prev,
        location: "",
      }));
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  //image show
  let labelname = "Fullname";
  if (formData.role === "provider") {
    labelname = "Company Name";
  }

  const showPassordPopup = () => {
    setShowPasswordPopup(true);
  };
  const closePopup = () => {
    setShowPasswordPopup(false);
  };
  return (
    <AdminLayout>
      <div className="bg-[#f2f2f9] rounded-lg p-6">
        {showPasswordPopup && <ProviderChangePassword close={closePopup} />}
        <ToastContainer position="top-center" autoClose={3000} />

        {/* Profile Header Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative bg-[#9796DE] rounded-xl p-6 w-[280px] h-[200px] flex flex-col items-center justify-center shadow-md">
            <img
              src={imageUrl}
              alt="Profile"
              className="rounded-full w-24 h-24 object-cover border-4 border-white shadow-lg"
            />
            <button
              className="absolute top-2 right-2 text-white bg-opacity-20 p-1 rounded-full"
              onClick={toggleEditImage}
            >
              <FaEdit className="text-white" />
            </button>

            {isEditingImage && (
              <div className="mt-4 flex gap-3 items-center">
                <label className="bg-gradient-to-r from-gray-200 to-white px-4 py-1 rounded shadow text-sm font-medium cursor-pointer">
                  Upload Image
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={saveImage}
                  className="bg-[#5A52A4] text-white px-4 py-1 rounded shadow text-sm font-medium"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="text-1xl font-semibold text-[red]">
            {errors.image && (
              <p className="text-sm font-semibold text-[red]">{errors.image}</p>
            )}
          </div>
        </div>

        {/* Info Sections */}
        <div className="bg-[#9796DE] p-6 rounded-xl shadow-md space-y-6">
          {/* PERSONAL INFO HEADER + BUTTON */}
          <div className="flex justify-between items-center text-white">
            <h3 className="text-lg font-semibold">PERSONAL INFORMATION</h3>
            <div className="space-x-2">
              {isEditingInfo ? (
                <button
                  onClick={() => toggleEditSection("personal")}
                  className="text-sm text-white font-semibold underline"
                >
                  {editStates.personal ? (
                    "Cancel"
                  ) : (
                    <FaEdit className="text-white" />
                  )}
                </button>
              ) : (
                <button>
                  <FaEdit
                    className="text-white"
                    onClick={() => toggleEditSection("personal")}
                  />
                </button>
              )}
              <button
                onClick={showPassordPopup}
                className="bg-white text-[#5A52A4] px-4 py-1 rounded-full text-sm font-semibold shadow"
              >
                CHANGE PASSWORD
              </button>
              <button className="bg-white text-[#5A52A4] px-4 py-1 rounded-full text-sm font-semibold shadow">
                REVIEW
              </button>
            </div>
          </div>

          {/* PERSONAL INFORMATION SECTION */}
          <div className="bg-white p-4 rounded-lg flex items-center justify-between gap-4">
            {/* Inputs section - 70% */}
            <div className="bg-white p-4 rounded-lg flex-1">
              <div className="flex gap-4">
                {/* Fullname Field */}
                <div className="flex-1">
                  <label className="font-semibold mr-2">{labelname}</label>
                  <input
                    type="text"
                    placeholder="Fullname"
                    name="fullname"
                    className="p-2 bg-gray-100 rounded w-full"
                    value={formData.fullname || ""}
                    disabled={!editStates.personal}
                    onChange={handleInputChange}
                  />
                  {errors.fullname && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.fullname}
                    </div>
                  )}
                </div>

                {/* Username Field */}
                <div className="flex-1">
                  <label className="font-semibold mr-2">Username</label>
                  <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    className="p-2 bg-gray-100 rounded w-full"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={!editStates.personal}
                  />
                  {errors.username && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.username}
                    </div>
                  )}
                </div>

                {/* Save Button */}
                {editStates.personal && (
                  <div className="flex items-end">
                    <button
                      onClick={() => handleSaveSection("personal")}
                      className="bg-[#5A52A4] text-white px-4 py-1 rounded shadow text-sm"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* EMAIL SECTION */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-semibold">EMAIL ADDRESS</h3>
              {/* {isEditingInfo ? (
                <button
                  onClick={() => toggleEditSection("email")}
                  className="text-sm text-white font-semibold underline"
                >
                  {editStates.email ? (
                    "Cancel"
                  ) : (
                    <FaEdit className="text-white" />
                  )}
                </button>
              ) : (
                <button>
                  <FaEdit
                    className="text-white"
                    onClick={() => toggleEditSection("email")}
                  />
                </button>
              )} */}
            </div>

            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="p-2 bg-gray-100 rounded w-[50%]"
                  value={formData.email}
                  // onChange={(e) =>
                  //   setFormData((prev) => ({ ...prev, email: e.target.value }))
                  // }
                  disabled={!editStates.email}
                />
                {/* {editStates.email && (
                  <button
                    onClick={() => handleSaveSection("email")}
                    className="bg-[#5A52A4] text-white px-4 py-1 rounded shadow text-sm"
                  >
                    Save
                  </button>
                )} */}
              </div>
            </div>
          </div>

          {/* PHONE SECTION */}
          {/* PHONE SECTION */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-semibold">PHONE NUMBER</h3>
              {isEditingInfo ? (
                <button
                  onClick={() => toggleEditSection("phone")}
                  className="text-sm text-white font-semibold underline"
                >
                  {editStates.phone ? (
                    "Cancel"
                  ) : (
                    <FaEdit className="text-white" />
                  )}
                </button>
              ) : (
                <button>
                  <FaEdit
                    className="text-white"
                    onClick={() => toggleEditSection("phone")}
                  />
                </button>
              )}
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.phone}
                    name="phone"
                    placeholder="Phone Number"
                    className="p-2 bg-gray-100 rounded w-[50%]"
                    disabled={!editStates.phone}
                    onChange={handleInputChange}
                  />
                  {errors.phone && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.phone}
                    </div>
                  )}
                </div>
                {editStates.phone && (
                  <button
                    onClick={() => handleSaveSection("phone")}
                    className="bg-[#5A52A4] text-white px-4 py-1 rounded shadow text-sm"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ADDRESS SECTION */}
          {/* ADDRESS SECTION */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-semibold">ADDRESS</h3>
              {isEditingInfo ? (
                <button
                  onClick={() => toggleEditSection("address")}
                  className="text-sm text-white font-semibold underline"
                >
                  {editStates.address ? (
                    "Cancel"
                  ) : (
                    <FaEdit className="text-white" />
                  )}
                </button>
              ) : (
                <button>
                  <FaEdit
                    className="text-white"
                    onClick={() => toggleEditSection("address")}
                  />
                </button>
              )}
            </div>
            <div className="bg-white p-4 rounded-lg grid grid-cols-2 gap-4">
              {/* autocompl */}

              {/* autocompl */}

              <div>
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
                {errors.location && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.location}
                  </span>
                )}
                <LocationPicker
                  mapStyle={mapStyle}
                  coordinates={coordinates}
                  onLocationSelect={handleLocationSelect}
                />
              </div>
              <div className="mt-30 ms-5 gap-2 ">
                {editStates.address && (
                  <button
                    onClick={() => handleSaveSection("address")}
                    className="bg-[#5A52A4] text-white  p-2 px-7 rounded shadow text-sm"
                  >
                    Save
                  </button>
                )}
              </div>
              {/* <div className="grid gap-2">
                <input
                  type="text"
                  placeholder="House Name / Plot Name"
                  className="p-2 bg-gray-100 rounded w-full"
                />
                <input
                  type="text"
                  placeholder="Landmark"
                  className="p-2 bg-gray-100 rounded w-full"
                />
                <input
                  type="text"
                  placeholder="Locality"
                  className="p-2 bg-gray-100 rounded w-full"
                />
                {editStates.address && (
                  <button
                    onClick={() => handleSaveSection("address")}
                    className="bg-[#5A52A4] text-white px-4 py-1 rounded shadow text-sm"
                  >
                    Save
                  </button>
                )}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;

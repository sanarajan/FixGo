import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface Props {
  mode: "add" | "edit" | "view";
  data?: any;
  setShowPopup: () => void;
  refresh?: () => void;
  userType?: string;
  imagePath?:string
}

const AddEditService: React.FC<Props> = ({ mode, data, userType,imagePath, setShowPopup, refresh }) => {
  const [services, setServices] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [formData, setFormData] = useState({
    serviceId: "",
    subcategoryId: "",
    status: "Active",
    description: "",
    features: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
    if (mode !== "add" && data) {
      const serviceId = data?.serviceId?._id || "";
      setFormData({
        serviceId: serviceId,
        subcategoryId: data?.subcategoryId?._id || "",
        status: data?.status || "Active",
        description: data?.description || "",
      features: data?.features || "",
      });
      fetchSubcategories(serviceId);
    }
    if (mode === "edit" || mode === "view") {
      
      setPreviewUrl(data?.image ? data?.image : "noImage");
      
    }
  }, [data, mode]);
 
  const fetchServices = async () => {
    try {
      const res = await axiosClient.get("/api/provider/allServices", {
        headers: { userRole: userType },
      });
      setServices(res.data.allservices || []);
    } catch (err) {
      console.error("Error fetching services", err);
    }
  };

  const fetchSubcategories = async (serviceId: string) => {
    try {
      setSubcategories([]);
      const res = await axiosClient.get(`/api/provider/adminSubcategoryList/${serviceId}`, {
        headers: { userRole: userType },
      });
      setSubcategories(res.data.subcategrories || []);
    } catch (err) {
      console.error("Error fetching subcategories", err);
    }
  };

  const handleChange = (  e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "serviceId") {
      fetchSubcategories(value);
      setFormData((prev) => ({ ...prev, subcategoryId: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewUrl("")
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    toast.dismiss()
    if (!formData.serviceId) {
      toast.error("Please select a service.");
      return;
    }
  
    if (!formData.subcategoryId) {
      toast.error("Please select a subcategory.");
      return;
    }
   
    if (selectedImage) {
      const file = selectedImage;
      const maxFileSize = 2 * 1024 * 1024; // 2 MB
      if (!file.type.startsWith("image/")) {
        toast.error("Selected file is not a valid image.");
        return;
      } else if (file.size > maxFileSize) {
        toast.error("Image size should not exceed 2 MB.");
        return;
      }
    }
    /////
    const formPayload = new FormData();
    formPayload.append("serviceId", formData.serviceId);
    formPayload.append("subcategoryId", formData.subcategoryId);
    formPayload.append("status", formData.status);
    formPayload.append("description", formData.description);
    formPayload.append("features", formData.features);
    
    if (selectedImage) {
      formPayload.append("image", selectedImage);
    }

    try {

      if (mode === "add") {
       const resp = await axiosClient.post("/api/provider/providerAddService", 
        formPayload,
          {
            headers: { userRole: userType, "Content-Type": "multipart/form-data" },
          }
        );
        if(resp.status===201){
          toast.success("Service added successfully.");
        }
      } else if(mode === "edit") {
        const resp =  await axiosClient.put(`/api/provider/providerUpdateService/${data._id}`,
          formPayload,
          {
            headers: { userRole: userType, "Content-Type": "multipart/form-data" },
          }
        );
        if(resp.status===200){
          toast.success("Service updated successfully.");
        }
      }
      refresh?.();
      setTimeout(()=>{
        setShowPopup();
      },1000)
     
    }catch (error: any) {
          if (error.response?.data?.error) {
            toast.error(error.response.data.error);
          } else {
            toast.error("An unexpected error occurred.");
          }
        } finally {
          refresh?.(); 
    
          // setLoading(false);
           }
  };

  const closePopup = () => setShowPopup();
   let imageuRL =""
  if (mode === "edit" || mode === "view") {
      
    const API = import.meta.env.VITE_API_URL;
    if(previewUrl)
     imageuRL = API + "/uploads/" + imagePath ;
  }
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
    <ToastContainer
           position="top-center"
           autoClose={5000}
           hideProgressBar={false}
           closeOnClick
           pauseOnHover
         />
      <div className="bg-white rounded-xl shadow-xl w-[360px] max-h-[90vh] overflow-y-auto mt-4">

      <div className="bg-[#5A52A4] text-white py-3 px-4 rounded-t-xl flex justify-between items-center">
      <span className="font-semibold text-sm">
            {mode === "add" ? "Add Service" : mode === "edit" ? "Edit Service" : "View Service"}
          </span>
          <button onClick={closePopup} className="text-white text-lg font-bold hover:text-gray-300">✖️</button>
        </div>

        <div className="p-6 space-y-4 text-sm">
       <div className="text-center">
        {previewUrl && (
          <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden border border-gray-300">
            <img src={previewUrl.startsWith("blob:") ? previewUrl : imageuRL + previewUrl } alt="Preview" className="object-cover w-full h-full" />
          </div>
        )}
        {mode !== "view" && (
          <div>
            <label className="font-semibold block mb-1 text-left">Image Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm"
            />
          </div>
        )}
      </div>

          {/* Service Dropdown */}
          <div>
            <label className="font-semibold">Service</label>
            <select
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 bg-gray-100 rounded-md"
              disabled={mode === "view"}
            >
              <option value="">-- Select Service --</option>
              {services.map((s: any) => (
                <option key={s._id} value={s._id}>{s.serviceName}</option>
              ))}
            </select>
          </div>

          {/* Subcategory Dropdown */}
          <div>
            <label className="font-semibold">Subcategory</label>
            <select
              name="subcategoryId"
              value={formData.subcategoryId}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 bg-gray-100 rounded-md"
              disabled={mode === "view"}
            >
              <option value="">-- Select Subcategory --</option>
              {subcategories.map((sc: any) => (
                <option key={sc._id} value={sc._id}>{sc.subcategory}</option>
              ))}
            </select>
          </div>
          <div>
  <label className="font-semibold">Description</label>
  <textarea
    name="description"
    value={formData.description}
    onChange={handleChange}
    className="w-full mt-1 px-3 py-2 bg-gray-100 rounded-md"
    rows={3}
    disabled={mode === "view"}
  />
</div>

{/* Features */}
<div>
  <label className="font-semibold">Features</label>
  <textarea
    name="features"
    value={formData.features}
    onChange={handleChange}
    className="w-full mt-1 px-3 py-2 bg-gray-100 rounded-md"
    rows={3}
    disabled={mode === "view"}
  />
</div>
          {/* Status (only in edit mode) */}
          {mode === "edit" && (
            <div>
              <label className="font-semibold">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 bg-gray-100 rounded-md"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={closePopup}
              className="px-4 py-2 border rounded-md border-gray-400 text-gray-700"
            >
              Cancel
            </button>
            {mode !== "view" && (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-[#5A52A4] text-white rounded-md"
              >
                {mode === "add" ? "Add" : "Save"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditService;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProviderLayout from "../../../components/providerLayout/ProviderLayout";
import axiosClient from "../../../api/axiosClient";
import { validateOfferForm } from "./AddOfferValidate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface SubcategoryOption {
  _id: string;
  subcategory: string;
  providerServiceId: string;
}

interface ServiceOption {
  _id: string;
  serviceName: string;
  providerServiceId: string;
  subcategories: SubcategoryOption[];
}

const EditOffer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const offerData = location.state;

  const [services, setServices] = useState<ServiceOption[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<
    SubcategoryOption[]
  >([]);
  const [offerFor, setOfferFor] = useState(offerData?.offerFor || "");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    offerName: offerData?.offerName || "",
    serviceId: offerData?.serviceId?._id || offerData?.serviceId || "",
    subcategoryId:
      offerData?.subcategoryId?._id || offerData?.subcategoryId || "",
    providerServiceId: offerData?.providerServiceId || "",
    offerType: offerData?.offerType || "percentage",
    offerValue: offerData?.offerValue || "",
    startDate: offerData?.startDate?.slice(0, 10) || "",
    endDate: offerData?.endDate?.slice(0, 10) || "",
    description: offerData?.description || "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (offerFor === "subcategory" && formData.serviceId) {
      fetchSubcategories(formData.serviceId);
    }
  }, [offerFor, formData.serviceId]);

  const fetchServices = async () => {
    try {
      const res = await axiosClient.get(
        `/api/provider/servicesAndSubcategories`
      );
      if (res.status === 200) {
        setServices(res.data.services);
      }
    } catch (err) {
      console.error("Failed to load services", err);
    }
  };

  const fetchSubcategories = async (serviceId: string) => {
    try {
      const res = await axiosClient.get(
        `/api/provider/getSubcategoriesByServiceId/${serviceId}`
      );
      setSelectedSubcategories(res.data.subcategories || []);
    } catch (err) {
      console.error("Failed to load subcategories", err);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (errors[name]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[name];
      setErrors(updatedErrors);
    }

    if (name === "offerFor") {
      setOfferFor(value);
      setFormData((prev) => ({
        ...prev,
        serviceId: "",
        subcategoryId: "",
        providerServiceId: "",
      }));
      setSelectedSubcategories([]);
      return;
    }

    if (name === "serviceId") {
      const selectedService = services.find((s) => s._id === value);
      setFormData((prev) => ({
        ...prev,
        serviceId: value,
        providerServiceId: selectedService?.providerServiceId || "",
        subcategoryId: "",
      }));
      if (offerFor === "subcategory" && value) {
        fetchSubcategories(value);
      }
      return;
    }

    if (name === "subcategoryId") {
      const selected = selectedSubcategories.find((sc) => sc._id === value);
      setFormData((prev) => ({
        ...prev,
        subcategoryId: value,
        providerServiceId: selected?.providerServiceId || "",
      }));
      return;
    }

    if (name === "startDate") {
      setFormData((prev) => ({
        ...prev,
        startDate: value,
        endDate: "", // reset end date
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateOfferForm({
      ...formData,
      offerFor,
    });

    setErrors(validationErrors);

    if (!isValid) {
      const firstErrorKey = Object.keys(validationErrors)[0];
      const firstErrorMessage = validationErrors[firstErrorKey];
      toast.error(firstErrorMessage);
      const el = document.getElementsByName(firstErrorKey)[0];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
      return;
    }

    try {
      const payload: Partial<typeof formData> & { offerFor: string } = {
        ...formData,
        offerFor,
      };
      if (offerFor === "service") {
        delete payload.subcategoryId;
      }

      const res = await axiosClient.post("/api/provider/editOffer", {
        _id: offerData._id,
        ...payload,
      });

      if (res.status === 201) {
        toast.success("Offer updated successfully");
        setTimeout(() => navigate("/provider/offers"), 1000);
      } else {alert("hfj")
        toast.error("Failed to update offer");
      }
    } catch (error: any) {alert(" error")
      console.error("Update error:", error);
      toast.error(error?.response?.data?.error || "Error updating offer");
    }
  };

  return (
    <ProviderLayout>
      <div className="max-w-2xl mx-auto bg-white text-[#333] shadow-md rounded-md p-6">
        <ToastContainer position="top-center" autoClose={2000} />
        <h2 className="text-xl font-semibold mb-4 text-[#5A52A4]">
          Edit Offer
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            {/* Offer Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Offer Name
              </label>
              <input
                type="text"
                name="offerName"
                value={formData.offerName}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
              {errors.offerName && (
                <p className="text-red-500 text-xs">{errors.offerName}</p>
              )}
            </div>

            {/* Offer For */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Offer For
              </label>
              <select
                name="offerFor"
                value={offerFor}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="">-- Select --</option>
                <option value="service">Service</option>
                <option value="subcategory">Subcategory</option>
              </select>
              {errors.offerFor && (
                <p className="text-red-500 text-xs">{errors.offerFor}</p>
              )}
            </div>

            {/* Service */}
            {(offerFor === "service" || offerFor === "subcategory") && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Service
                </label>
                <select
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded"
                >
                  <option value="">-- Select Service --</option>
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.serviceName}
                    </option>
                  ))}
                </select>
                {errors.serviceId && (
                  <p className="text-red-500 text-xs">{errors.serviceId}</p>
                )}
              </div>
            )}

            {/* Subcategory */}
            {offerFor === "subcategory" && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Subcategory
                </label>
                <select
                  name="subcategoryId"
                  value={formData.subcategoryId}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded"
                >
                  <option value="">-- Select Subcategory --</option>
                  {selectedSubcategories.map((sc) => (
                    <option key={sc._id} value={sc._id}>
                      {sc.subcategory}
                    </option>
                  ))}
                </select>
                {errors.subcategoryId && (
                  <p className="text-red-500 text-xs">{errors.subcategoryId}</p>
                )}
              </div>
            )}

            {/* Offer Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Offer Type
              </label>
              <select
                name="offerType"
                value={formData.offerType}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="price">Fixed Price (₹)</option>
              </select>
            </div>

            {/* Offer Value */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Offer Value
              </label>
              <input
                type="number"
                name="offerValue"
                value={formData.offerValue}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
              {errors.offerValue && (
                <p className="text-red-500 text-xs">{errors.offerValue}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={getTodayDate()}
                  className="w-full border px-4 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || getTodayDate()}
                  className="w-full border px-4 py-2 rounded"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            {/* Submit */}
            <div className="text-right pt-4">
              <button
                type="submit"
                className="bg-[#5A52A4] text-white font-semibold px-6 py-2 rounded-md shadow hover:bg-[#4a4299]"
              >
                Update Offer
              </button>
            </div>
          </div>
        </form>
      </div>
    </ProviderLayout>
  );
};

export default EditOffer;

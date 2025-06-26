import React, { useState, useEffect } from "react";
import ProviderLayout from "../../../components/providerLayout/ProviderLayout";
import axiosClient from "../../../api/axiosClient";
import { validateOfferForm } from "./AddOfferValidate"; // adjust path if needed
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

interface CustomersProps {
  userType: string;
}
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

const AddOffer = ({ userType }: CustomersProps) => {
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<
    SubcategoryOption[]
  >([]);
  const [offerFor, setOfferFor] = useState(""); // 'service' or 'subcategory'

  const [formData, setFormData] = useState({
    offerName:"",
    serviceId: "",
    subcategoryId: "",
    providerServiceId: "",
    offerType: "percentage",
    offerValue: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchServices();
  }, []);
const navigate =useNavigate()
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const fetchServices = async () => {
    try {
      const res = await axiosClient.get(
        `/api/provider/servicesAndSubcategories`,
        {
          headers: { userRole: userType },
        }
      );
      if (res.status === 200) {
        console.log(JSON.stringify(res.data.services));
        setServices(res.data.services);
      }
    } catch (err) {
      console.error("Failed to load services", err);
    }
  };
  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
    if (name === "offerFor") {
      setOfferFor(value);
      setFormData((prev) => ({
        ...prev,
        serviceId: "",
        subcategoryId: "",
        providerServiceId: "", // clear this too
      }));
      setSelectedSubcategories([]);
      return;
    }

    // Handle serviceId selection
    if (name === "serviceId") {
      const selectedService = services.find((s) => s._id === value);

      setFormData((prev) => ({
        ...prev,
        serviceId: value,
        providerServiceId: selectedService?.providerServiceId || "",
        subcategoryId: "", // reset subcat
      }));
      setSelectedSubcategories([]);

      if (offerFor === "subcategory" && value) {
        try {
          const res = await axiosClient.get(
            `/api/provider/getSubcategoriesByServiceId/${value}`
          );
          setSelectedSubcategories(res.data.subcategories || []);
        } catch (err) {
          console.error("Failed to load subcategories", err);
        }
      }
      return;
    }

    // Handle subcategory selection (for subcategory offer)
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
        endDate: "", // Clear end date when start date changes
      }));
      return;
    }

    if (name === "endDate") {
      setFormData((prev) => ({
        ...prev,
        endDate: value,
      }));
      return;
    }

    // Generic case for other fields
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

    setErrors(validationErrors); // Show field-level errors

    if (!isValid) {
      const firstErrorKey = Object.keys(validationErrors)[0];
      const firstErrorMessage = validationErrors[firstErrorKey];

      toast.error(firstErrorMessage); // Only show the first error as toast

      // Optional: scroll and focus to the field
      const el = document.getElementsByName(firstErrorKey)[0];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }

      return;
    }

    setErrors({}); // Clear previous errors

    try {
      const payload: Partial<typeof formData> & { offerFor: string } = {
        ...formData,
        offerFor,
      };
      if (offerFor === "service") {
        delete payload.subcategoryId;
      }
      const res = await axiosClient.post("/api/provider/addOffer", payload);
      if (res.status === 201) {
         toast.success("Offer created successfully");

          setTimeout(() => {
         navigate("/provider/offers")
      }, 1000);
      
      } else {
        toast.error("Failed to create offer");
      }
    } catch (error: any) {
      console.error("Error submitting offer:", error);

      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong while submitting the offer";

      toast.error(message);
    }
  };

  return (
    <ProviderLayout>
      <div className="max-w-2xl mx-auto bg-gradient-to-r from-[#ecebff] via-[#f4f3ff] to-[#ffffff] text-[#333] shadow-md rounded-md p-6">
        <ToastContainer position="top-center" autoClose={2000} />

        <h2 className="text-xl font-semibold mb-4 text-[#5A52A4]">
          Create New Offer
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            {/* Offer For Selector */}
            {/* Offer For Selector */}
              <div>
              <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">
                Name
              </label>
              <input
                type="text"
                name="offerName"
                value={formData.offerName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-[#ccc] focus:border-[#5A52A4] focus:ring-2 focus:ring-purple-500"
                placeholder="offer Name"
              />
              {errors.offerName && (
                <p className="text-red-500 text-xs mt-1">{errors.offerName}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">
                Offer For
              </label>
              <select
                name="offerFor"
                value={offerFor}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-[#ccc] focus:border-[#5A52A4] focus:ring-2 focus:ring-purple-500"
              >
                <option value="">-- Select --</option>
                <option value="service">Service</option>
                <option value="subcategory">Subcategory</option>
              </select>
              {errors.offerFor && (
                <p className="text-red-500 text-xs mt-1">{errors.offerFor}</p>
              )}
            </div>

            {/* Show Service Select in both cases */}
            {(offerFor === "service" || offerFor === "subcategory") && (
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">
                  Service
                </label>
                <select
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-[#ccc] focus:border-[#5A52A4] focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">-- Select Service --</option>
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.serviceName}
                    </option>
                  ))}
                </select>
                {errors.serviceId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.serviceId}
                  </p>
                )}
              </div>
            )}

            {/* Show Subcategory Select only for subcategory offers */}
            {offerFor === "subcategory" && (
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">
                  Subcategory
                </label>
                <select
                  name="subcategoryId"
                  value={formData.subcategoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="">-- Select Subcategory --</option>
                  {selectedSubcategories.map((sc) => (
                    <option key={sc._id} value={sc._id}>
                      {sc.subcategory}
                    </option>
                  ))}
                </select>
                {errors.subcategoryId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subcategoryId}
                  </p>
                )}
              </div>
            )}

            {/* Offer Type */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">
                Offer Type
              </label>
              <select
                name="offerType"
                value={formData.offerType}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-[#ccc] focus:border-[#5A52A4] focus:ring-2 focus:ring-purple-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="price">Fixed Price (₹)</option>
              </select>
              {errors.offerType && (
                <p className="text-red-500 text-xs mt-1">{errors.offerType}</p>
              )}
            </div>

            {/* Offer Value */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">
                Offer Value
              </label>
              <input
                type="number"
                min={0}
                name="offerValue"
                value={formData.offerValue}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-[#ccc] focus:border-[#5A52A4] focus:ring-2 focus:ring-purple-500"
                placeholder={
                  formData.offerType === "percentage" ? "e.g. 10%" : "e.g. ₹150"
                }
              />
              {errors.offerValue && (
                <p className="text-red-500 text-xs mt-1">{errors.offerValue}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={getTodayDate()} // ⬅️ Only allow today and forward
                  className="w-full px-4 py-2 rounded-md border border-[#ccc] focus:border-[#5A52A4] focus:ring-2 focus:ring-purple-500"
                />
                {errors.startDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.startDate}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || getTodayDate()} // ⬅️ Must be after or same as startDate
                  className="w-full px-4 py-2 rounded-md border border-[#ccc] focus:border-[#5A52A4] focus:ring-2 focus:ring-purple-500"
                />
                {errors.endDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-md border border-[#ccc] focus:border-[#5A52A4] focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Submit */}
            <div className="pt-4 text-right">
              <button
                type="submit"
                className="bg-[#5A52A4] text-white font-semibold px-6 py-2 rounded-md shadow hover:bg-[#4a4299] transition duration-200"
              >
                Create Offer
              </button>
            </div>
          </div>
        </form>
      </div>
    </ProviderLayout>
  );
};

export default AddOffer;

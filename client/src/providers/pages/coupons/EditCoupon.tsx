import React, { useState, useEffect } from "react";
import axiosClient from "../../../api/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ProviderLayout from "../../../components/providerLayout/ProviderLayout";
import { validateCouponForm, getTodayDate } from "./AddCouponVlidation";
import { CouponFormData } from "../../../interface/CouponInterface";

const MAX_IMAGE_SIZE_MB = 2;

const EditCoupon = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const couponData = location.state as CouponFormData | undefined;
  const id= couponData?._id
console.log(JSON.stringify(couponData,null,2)+" id")
  const [formData, setFormData] = useState<CouponFormData>({
    id:"",
    couponName: "",
    startDate: "",
    endDate: "",
    description: "",
    minPurchase: 0,
    discountType: "percentage",
    discountPercentage: 0,
    discountValue: 0,
    status: "Active",
    userUsageLimit: 1,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageValidationError, setImageValidationError] = useState<string>("");

  useEffect(() => {
    const initializeForm = (
      coupon: CouponFormData & { couponImage?: string }
    ) => {
      setFormData({
       id:coupon._id,
        couponName: coupon.couponName,
        startDate: coupon.startDate?.split("T")[0] || "",
        endDate: coupon.endDate?.split("T")[0] || "",
        description: coupon.description,
        minPurchase: coupon.minPurchase,
        discountType: coupon.discountType,
        discountPercentage: coupon.discountPercentage,
        discountValue: coupon.discountValue,
        status: coupon.status,
        userUsageLimit: coupon.userUsageLimit,
      });

      if (coupon.couponImage) {
        const API = import.meta.env.VITE_API_URL;
        const fullImagePath = `${coupon.couponImage}`;
        setExistingImage(coupon.couponImage);
        setPreviewUrl(fullImagePath);
      }
    };

    if (couponData) {
      initializeForm(couponData);
    } else if (id) {
      axiosClient
        .get(`/api/provider/coupon/${id}`)
        .then((res) => initializeForm(res.data))
        .catch(() => toast.error("Failed to load coupon"));
    }
  }, [couponData, id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const numericFields = [
      "minPurchase",
      "discountPercentage",
      "discountValue",
      "userUsageLimit",
    ];

    if (numericFields.includes(name)) {
      const regex = /^[0-9\b]*$/;
      if (!regex.test(value)) return;
    }

    setFormData((prev) => {
      const updated: CouponFormData = {
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      };

      if (numericFields.includes(name)) {
        (updated as any)[name] = value === "" ? "" : Number(value);
      }

      if (name === "startDate" && prev.endDate && value > prev.endDate) {
        updated.endDate = "";
      }

      return updated;
    });

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (file) {
      if (!validTypes.includes(file.type)) {
        const msg = "Only JPG, JPEG, or PNG allowed";
        setImageValidationError(msg);
        setErrors((prev) => ({ ...prev, couponImage: msg }));
        setImageFile(null);
        setPreviewUrl(null);
        return;
      }

      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        const msg = `Image must be under ${MAX_IMAGE_SIZE_MB}MB`;
        setImageValidationError(msg);
        setErrors((prev) => ({ ...prev, couponImage: msg }));
        setImageFile(null);
        setPreviewUrl(null);
        return;
      }

      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImageValidationError("");
      setErrors((prev) => ({ ...prev, couponImage: "" }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateCouponForm(
      formData,
      imageFile,
      imageValidationError,
       true
    );

    if (!isValid) {
      setErrors(validationErrors);
      toast.error("Please fix the form errors");
      return;
    }

    const payload = new FormData();
    payload.append("couponName", formData.couponName);
    payload.append("description", formData.description);
    payload.append("startDate", formData.startDate);
    payload.append("endDate", formData.endDate);
    payload.append("discountType", formData.discountType);
    payload.append("minPurchase", String(formData.minPurchase));
    payload.append("discountPercentage", String(formData.discountPercentage));
    payload.append("discountValue", String(formData.discountValue));
    payload.append("status", String(formData.status));
    payload.append("userUsageLimit", String(formData.userUsageLimit));
   if (imageFile) {
  payload.append("couponImage", imageFile);
} else if (existingImage) {
  payload.append("couponImage", existingImage); // ✅ this is a string, not a File
}

    try {
      const res = await axiosClient.patch(`/api/provider/editCoupon/${formData.id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        toast.success("Coupon updated successfully");

        setTimeout(() => {
          navigate("/provider/coupons");
        }, 1000);
      } else {
        toast.error("Failed to update coupon");
      }
    } catch (error: any) {
      toast.error("Unexpected error occurred", error.message);
    }
  };
const API = import.meta.env.VITE_API_URL;

  const imagePath = `${API}/uploads/providerServices/`;
 
  return (
    <ProviderLayout>
      <div className="max-w-2xl mx-auto bg-gradient-to-r from-[#fdfcff] via-[#f0efff] to-[#ffffff] text-[#333] p-6 rounded-2xl shadow-lg">
        <ToastContainer />
        <h2 className="text-2xl font-bold mb-6 text-[#5A52A4] text-center">
          Edit Coupon
        </h2>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-4"
        >
          {/* Coupon Image */}
          <div>
            <label className="block font-medium mb-1">Coupon Image *</label>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleFileChange}
              className="w-full border px-4 py-2 rounded"
            />
            {previewUrl && (
              <img
                src={previewUrl.startsWith("blob:") ? previewUrl : `${imagePath}${previewUrl}`}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
            {errors.couponImage && (
              <p className="text-red-500 text-sm mt-1">{errors.couponImage}</p>
            )}
          </div>

          {/* Coupon Name */}
          <div>
            <label className="block font-medium mb-1">Coupon Name *</label>
            <input
              type="text"
              name="couponName"
              value={formData.couponName}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
            {errors.couponName && (
              <p className="text-red-500 text-sm mt-1">{errors.couponName}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              rows={3}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                min={getTodayDate()}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                min={formData.startDate || getTodayDate()}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Min Purchase */}
          <div>
            <label className="block font-medium mb-1">Minimum Purchase *</label>
            <input
              type="number"
              name="minPurchase"
              value={formData.minPurchase}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
            {errors.minPurchase && (
              <p className="text-red-500 text-sm mt-1">{errors.minPurchase}</p>
            )}
          </div>

          {/* Discount Type */}
          <div>
            <label className="block font-medium mb-1">Discount Type</label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            >
              <option value="Percentage">Percentage (%)</option>
              <option value="price">Fixed Amount (₹)</option>
            </select>
          </div>

          {/* Discount Fields */}
          {formData.discountType === "percentage" ? (
            <div>
              <label className="block font-medium mb-1">
                Discount Percentage
              </label>
              <input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
              {errors.discountPercentage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.discountPercentage}
                </p>
              )}
            </div>
          ) : (
            <div>
              <label className="block font-medium mb-1">Discount Value</label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
              {errors.discountValue && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.discountValue}
                </p>
              )}
            </div>
          )}

          {/* Usage Limit */}
          <div>
            <label className="block font-medium mb-1">User Usage Limit</label>
            <input
              type="number"
              name="userUsageLimit"
              value={formData.userUsageLimit}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-[#5A52A4] text-white px-8 py-2 rounded hover:bg-[#4a4299]"
            >
              Update Coupon
            </button>
          </div>
        </form>
      </div>
    </ProviderLayout>
  );
};

export default EditCoupon;

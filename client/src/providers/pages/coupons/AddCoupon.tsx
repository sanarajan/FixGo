import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProviderLayout from "../../../components/providerLayout/ProviderLayout";
import { validateCouponForm, getTodayDate } from "./AddCouponVlidation";
import { CouponFormData } from "../../../interface/CouponInterface";

const MAX_IMAGE_SIZE_MB = 2;

const AddCoupon = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [imageValidationError, setImageValidationError] = useState<string>("");

  const [formData, setFormData] = useState<CouponFormData>({
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
  const navigate = useNavigate();
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Prevent non-numeric input for certain fields
    const numericFields = [
      "minPurchase",
      "discountPercentage",
      "discountValue",
      "userUsageLimit",
    ];
    if (numericFields.includes(name)) {
      const regex = /^[0-9\b]*$/; // only digits
      if (!regex.test(value)) return; // ignore if input is invalid
    }

    setFormData((prev) => {
      let updated = {
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      };

      // Convert numbers
      if (numericFields.includes(name)) {
        updated = {
          ...updated,
          [name]: value === "" ? "" : Number(value),
        };
      }

      // Clear end date if new start date is after it
      if (name === "startDate" && prev.endDate && value > prev.endDate) {
        updated.endDate = "";
      }

      return updated;
    });

    // Live validations
    let errorMsg = "";
    if (name === "minPurchase") {
      const val = Number(value);
      if (!isNaN(val) && val < 500)
        errorMsg = "Minimum purchase must be at least ₹500";
    }

    if (
      name === "discountPercentage" &&
      formData.discountType === "percentage"
    ) {
      if (Number(value) > 25) errorMsg = "Discount % must be 25 or less";
    }

    if (name === "discountValue" && formData.discountType === "price") {
      const minPurchase = Number(formData.minPurchase);
      if (!isNaN(minPurchase) && Number(value) >= minPurchase) {
        errorMsg = "Discount must be less than minimum purchase";
      }
    }

    if (name === "userUsageLimit") {
      if (Number(value) <= 0) errorMsg = "Usage limit must be greater than 0";
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (file) {
      if (!validTypes.includes(file.type)) {
        const errMsg = "Only JPG, JPEG or PNG allowed";
        setErrors((prev) => ({ ...prev, couponImage: errMsg }));
        setImageValidationError(errMsg); // 👈 Track error type
        setImageFile(null); // Clear invalid image
        setPreviewUrl(null);
        return;
      }

      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        const errMsg = `Image must be under ${MAX_IMAGE_SIZE_MB}MB`;
        setErrors((prev) => ({ ...prev, couponImage: errMsg }));
        setImageValidationError(errMsg); // 👈 Track error type
        setImageFile(null); // Clear large image
        setPreviewUrl(null);
        return;
      }

      // Valid image
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, couponImage: "" }));
      setImageValidationError(""); // ✅ Clear custom error
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateCouponForm(
      formData,
      imageFile,
      imageValidationError,
      false
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
    payload.append(
      "minPurchase",
      formData.minPurchase === "" ? "0" : formData.minPurchase.toString()
    );
    payload.append(
      "discountPercentage",
      formData.discountPercentage === ""
        ? "0"
        : formData.discountPercentage.toString()
    );
    payload.append(
      "discountValue",
      formData.discountValue === "" ? "0" : formData.discountValue.toString()
    );

    payload.append("status", formData.status.toString());
    payload.append("userUsageLimit", formData.userUsageLimit.toString());
    if (imageFile) payload.append("couponImage", imageFile);

    try {
      const res = await axiosClient.post("/api/provider/addCoupon", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200 || res.status === 201) {
        setFormData({
          couponName: "",
          startDate: "",
          endDate: "",
          description: "",
          minPurchase: "",
          discountType: "percentage",
          discountPercentage: "",
          discountValue: "",
          status: "Active",
          userUsageLimit: 1,
        });
        setImageFile(null);
        setPreviewUrl(null);
        setErrors({});
        if (res.status === 201) {
          toast.success("Coupon created successfully");

          setTimeout(() => {
            navigate("/provider/coupons");
          }, 1000);
        } else {
          toast.error("Failed to create coupon");
        }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to add coupon");
    }
  };

  return (
    <ProviderLayout>
      <div className="max-w-2xl mx-auto bg-gradient-to-r from-[#ecebff] via-[#f4f3ff] to-[#ffffff] text-[#333] p-6 rounded-2xl shadow-lg">
        <ToastContainer />
        <h2 className="text-2xl font-bold mb-6 text-[#5A52A4] text-center">
          Add Coupon
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          {/* Image Upload */}
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
                src={previewUrl}
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

          {/* Start and End Dates */}
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

          {/* Minimum Purchase */}
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
              <option value="percentage">Percentage (%)</option>
              <option value="price">Fixed Amount (₹)</option>
            </select>
          </div>

          {/* Discount */}
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
              Add Coupon
            </button>
          </div>
        </form>
      </div>
    </ProviderLayout>
  );
};

export default AddCoupon;

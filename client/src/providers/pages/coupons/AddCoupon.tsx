import React, { useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProviderLayout from "../../../components/providerLayout/ProviderLayout";


const AddCoupon = () => {
  const [formData, setFormData] = useState({
    couponName: "",
    couponImage: "", // image URL for simplicity
    startDate: "",
    endDate: "",
    description: "",
    minPurchase: 0,
    discountType: "Percentage",
    discountPercentage: 0,
    discountValue: 0,
    status: true,
    userUsageLimit: 1,
  });

 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const target = e.target as HTMLInputElement;
  const { name, value, type } = target;

  if (type === "checkbox") {
    setFormData((prev) => ({
      ...prev,
      [name]: target.checked,
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      couponImage: [formData.couponImage], // send as array
    };

    // Conditional cleanup
    if (payload.discountType === "Percentage") {
      payload.discountValue = 0;
    } else {
      payload.discountPercentage = 0;
    }

    try {
      const res = await axiosClient.post("/api/provider/addCoupon", payload);
      if (res.status === 201 || res.status === 200) {
        toast.success("Coupon added successfully!");
        setFormData({
          couponName: "",
          couponImage: "",
          startDate: "",
          endDate: "",
          description: "",
          minPurchase: 0,
          discountType: "Percentage",
          discountPercentage: 0,
          discountValue: 0,
          status: true,
          userUsageLimit: 1,
        });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to add coupon");
    }
  };

  return (
    <ProviderLayout>
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4 text-[#5A52A4]">Add Coupon</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Coupon Name */}
        <input
          type="text"
          name="couponName"
          placeholder="Coupon Name"
          value={formData.couponName}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        {/* Coupon Image URL */}
        <input
          type="text"
          name="couponImage"
          placeholder="Image URL"
          value={formData.couponImage}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          rows={3}
        />

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        {/* Min Purchase */}
        <input
          type="number"
          name="minPurchase"
          placeholder="Minimum Purchase"
          value={formData.minPurchase}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        {/* Discount Type */}
        <select
          name="discountType"
          value={formData.discountType}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="Percentage">Percentage (%)</option>
          <option value="Fixed">Fixed Amount (₹)</option>
        </select>

        {/* Discount Value */}
        {formData.discountType === "Percentage" ? (
          <input
            type="number"
            name="discountPercentage"
            placeholder="Discount Percentage"
            value={formData.discountPercentage}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
        ) : (
          <input
            type="number"
            name="discountValue"
            placeholder="Discount Value"
            value={formData.discountValue}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
        )}

        {/* User Usage Limit */}
        <input
          type="number"
          name="userUsageLimit"
          placeholder="User Usage Limit"
          value={formData.userUsageLimit}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        {/* Status Checkbox */}
      
        {/* Submit Button */}
        <button
          type="submit"
          className="bg-[#5A52A4] text-white px-6 py-2 rounded hover:bg-[#4a4299]"
        >
          Add Coupon
        </button>
      </form>
    </div>
    </ProviderLayout>
  );
};

export default AddCoupon;

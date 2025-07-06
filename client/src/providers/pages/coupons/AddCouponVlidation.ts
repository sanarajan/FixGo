import {validatePositiveNumber} from "../../../utils/ValidationHelper";
import { CouponFormData } from "../../../interface/CouponInterface";

export const MAX_IMAGE_SIZE_MB = 2;

export const validateImageFile = (imageFile: File | null): string => {
  const validTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!imageFile) {alert("jhgj")
    return "Coupon image is required";
  }

  try {
    if (!validTypes.includes(imageFile.type)) {
      return "Only JPG, JPEG, or PNG image formats are allowed";
    }

    if (imageFile.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      return `Image must be under ${MAX_IMAGE_SIZE_MB}MB`;
    }
  } catch (err) {
    return "Invalid file selected. Please choose a valid image.";
  }

  return "";
};


export const validateCouponForm = (
  formData: CouponFormData,
  imageFile: File | null,
  imageValidationError: string,
   hasExistingImage: boolean
): { isValid: boolean; errors: { [key: string]: string } } => {
  const errors: { [key: string]: string } = {};

  if (!formData.couponName.trim()) errors.couponName = "Coupon name is required";
  if (!formData.startDate) errors.startDate = "Start date is required";
  if (!formData.endDate) errors.endDate = "End date is required";

  //  Minimum Purchase validation
  const minPurchaseError = validatePositiveNumber(formData.minPurchase, "Minimum purchase");
  if (minPurchaseError) {
    errors.minPurchase = minPurchaseError;
  } else if (typeof formData.minPurchase === "number" && formData.minPurchase < 500) {
     errors.minPurchase = "Minimum purchase must be at least ₹500";
  }

  //  User usage limit validation
  const userLimitError = validatePositiveNumber(formData.userUsageLimit, "User usage limit", false);
  if (userLimitError) errors.userUsageLimit = userLimitError;

  //  Percentage validation
  if (formData.discountType === "percentage") {
    const percentageError = validatePositiveNumber(formData.discountPercentage, "Discount percentage", false);
    if (percentageError) {
      errors.discountPercentage = percentageError;
    } else if (typeof formData.discountPercentage === "number" &&formData.discountPercentage > 25) {
      errors.discountPercentage = "Discount % must be 25 or less";
    }
  }

  //  Fixed discount value validation
  if (formData.discountType === "price") {
    const discount = Number(formData.discountValue);
    if (isNaN(discount)) {
      errors.discountValue = "Discount value is required";
    } else if (discount < 0) {
      errors.discountValue = "Discount cannot be negative";
    } else if (  typeof discount === "number" &&
  typeof formData.minPurchase === "number" &&
  discount >= formData.minPurchase) {
      errors.discountValue = "Discount must be less than minimum purchase";
    }
  }

  //  Image validation
  if (!imageFile && !hasExistingImage) {
    errors.couponImage = "Coupon image is required";
  } else if (imageFile) {
    const imageError = validateImageFile(imageFile);
    if (imageError) errors.couponImage = imageError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};


export const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // format: yyyy-mm-dd
};


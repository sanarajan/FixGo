export interface CouponFormData {
  id?: string; // Local ID for updates
  _id?: string; // MongoDB _id
  couponImage?: string;
  couponName: string;
  startDate: string;
  endDate: string;
  description: string;
  minPurchase: number | "";
  discountType: "percentage" | "price";
  discountPercentage: number | "";
  discountValue: number | "";
  status: "Active" | "Inactive";
  userUsageLimit: number;
}

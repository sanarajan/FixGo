import React from "react";

export interface Coupon {
  _id: string;
  couponName: string;
  description: string;
  discountType: "percentage" | "price" |"";
  discountPercentage?: number;
  discountValue?: number;
}

interface CouponPopupProps {
  coupons: Coupon[];
  onClose: () => void;
  onApply: (coupon: Coupon) => void;
}

const CouponPopup: React.FC<CouponPopupProps> = ({
  coupons,
  onClose,
  onApply,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Available Coupons</h2>

        {coupons.length === 0 ? (
          <p className="text-gray-500">No coupons available.</p>
        ) : (
          <div className="space-y-4">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="border border-gray-300 p-4 rounded-md shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-semibold">{coupon.couponName}</div>
                    <div className="text-sm text-gray-600">{coupon.description}</div>
                    <div className="text-sm mt-1 text-green-700">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountPercentage}% off`
                        : `₹${coupon.discountValue} off`}
                    </div>
                  </div>
                  <button
                    onClick={() => onApply(coupon)}
                    className="ml-4 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-red-600 hover:underline font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponPopup;

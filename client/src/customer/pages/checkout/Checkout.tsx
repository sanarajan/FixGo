import React, { useEffect, useState } from "react";
import CustomerLayout from "../../../components/customerLayout/CustomerLayout";
import { useLocation } from "react-router-dom";
import customerAxiosClient from "../../../api/customerAxiosClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LocationAutocomplete from "../../../components/LocationPicker/LocationAutocomplete";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/Store";
import CouponPopup from "../../../components/popups/coupon/CouponPopup";
import {CouponFormData} from "../../../interface/CouponInterface";
import "./Checkout.css";
const Checkout: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const location = useLocation();
  const [address, setAddress] = useState<string | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showCouponPopup, setShowCouponPopup] = useState(false);

  // const [servicePrice, setServicePrice] = useState<number>(1500);
  // const [offerPrice, setOfferPrice] = useState<number>(1000);
  // const [serviceId, setServiceId] = useState<string | null>(
  //   location.state?.serviceId || null
  // );
  // const [subcateId, setSubcateId] = useState<string | null>(
  //   location.state?.subcateId || null
  // );
  // const [idProvider, setIdProvider] = useState<string | null>(
  //   location.state?.idProvider || null
  // );

  const {
    serviceId,
    subcateId,
    idProvider,
    providerServiceId,
    serviceName,
    subcategoryName,
    serviceImage,
    providerImage,
    originalPrice,
    discountedPrice,
    offerName,
    offerType,
    offerValue,
    savings,
  } = location.state;
  const servicePrice = originalPrice;
  // const offerPrice = discountedPrice;
  // const tenPercentOfOffer = offerPrice * 0.1;
  const BASE_PRICE = discountedPrice;

  // const { serviceName, subcategoryName, serviceImage } = location.state || {};
  const [locationAddress, setLocationAddress] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  //coupon data states
  const [offerPrice, setOfferPrice] = useState<number>(discountedPrice);
  const [selectedCoupon, setSelectedCoupon] = useState<any | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(offerValue);
  const [finalPayableAmount, setFinalPayableAmount] =
    useState<number>(offerPrice);
  const [amountSaved, setAmountSaved] = useState<number>(savings);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponCount, setCouponCount] = useState<number>();
  const [advancePaid, setAdvancePaid] = useState<number>(offerPrice * 0.1);
  const [discountType, setDiscountType] = useState<string>(offerType);
  const [discountname, setDiscountName] = useState<string>(offerName);
  const [discountSource, setDiscountSource] = useState<string>(
    offerName ? "offer" : ""
  );
  const [discount, setDiscount] = useState<number>(
    originalPrice - discountedPrice
  );
  const [appliedCoupon, setAppliedCoupon] = useState<CouponFormData | null>(null);
  //  const [offer,setOffer] = useState<number>(offerValue);
  //  const discount = originalPrice - offerPrice;
  useEffect(() => {
    if (!coordinates && !locationAddress) {
      fetchAddress();
    }
  }, [coordinates, locationAddress]);
  useEffect(() => {
    if (!discountType && !offerValue && idProvider) {
      fetchCouponsForProvider(idProvider);
    }
  }, [discountType, offerValue, idProvider]);
  const fetchCouponsForProvider = async (providerId: string) => {
    try {
      const response = await customerAxiosClient.get(
        `/api/showCoupons/${providerId}`
      );
      const providerCoupons = response.data || [];
      setAvailableCoupons(providerCoupons.coupons);
      setCouponCount(providerCoupons.couponCount);
    } catch (err) {
      console.error("Failed to fetch provider coupons", err);
    }
  };
  const resetCouponState = () => {
    setSelectedCoupon(null);

    setOfferPrice(BASE_PRICE);
    setDiscount(originalPrice - BASE_PRICE); // provider offer only
    setCouponDiscount(0);

    setFinalPayableAmount(BASE_PRICE);
    setAdvancePaid(BASE_PRICE * 0.1);

    setAmountSaved(savings); // back to provider savings
    setDiscountType(offerType);
    setDiscountName(offerName);
    setDiscountSource(offerName ? "offer" : "");
  };
  

const handleRemoveCoupon = () => {
  setAppliedCoupon(null);
  setDiscount(0);
  resetCouponState(); // reset totals
};

  const handleApplyCoupon = (coupon: any) => {
    resetCouponState(); 

    let disc =
      coupon.discountType === "percentage"
        ? (BASE_PRICE * coupon.discountPercentage) / 100
        : coupon.discountValue;

    disc = Math.min(disc, BASE_PRICE); 
    setDiscount(disc);

    const newPrice = BASE_PRICE - disc;
    const newAdvance = newPrice * 0.1;
    if (coupon.discountType === "percentage") {
      setCouponDiscount(coupon.discountPercentage);
    } else {
      setCouponDiscount(coupon.discountValue);
    }
    setSelectedCoupon(coupon);

    setOfferPrice(newPrice);
    setFinalPayableAmount(newPrice);
    setAdvancePaid(newAdvance);

    setAmountSaved(savings + disc);
    setDiscountType(coupon.discountType);
    setDiscountName(coupon.couponName);
    setDiscountSource("coupon");

    setShowCouponPopup(false);
    setAppliedCoupon(coupon)
  };

  const fetchAddress = async () => {
    try {
      const response = await customerAxiosClient.get(`/api/getCustomerAddress`);
      if (response.status === 200) {
        const data = await response.data;
        if (data && data.location) {
          const dataCordinate = { lat: data.latitude, lng: data.longitude };
          setCoordinates(dataCordinate);
          setLocationAddress(data.location);
          setAddress(data.location);
          console.log(data.coordinates + " success coord ");
        } else {
          console.error("No address found for the user.");
        }
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };
  const handleAddressSave = async (value: string) => {
    try {
      const response = await customerAxiosClient.patch(
        `/api/saveCustomerAddress`,
        {
          coordinates: coordinates,
          //   providerId: idProvider,
          location: locationAddress,
        }
      );
      let data;
      if (response.status === 200) {
        data = await response.data;
        if (response.status === 200 && response.data === true) {
          toast.success("Address saved succesfully");
          setShowAddressModal(false);
        } else {
          console.error("Address not saved:", response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const handleSlotSave = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setShowSlotModal(false);
  };
  const handleLocationSelect = (coords: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setLocationAddress(coords.address);
    setCoordinates({ lat: coords.lat, lng: coords.lng });
    setAddress(coords.address);
  };

  const isSlotEnabled = !!address;
  const isProceedEnabled = !!address && !!selectedDate && !!selectedTime;

  const handleProceedToPay = async () => {
    console.log(
      "customerId:",
      user?._id,
      " providerId:",
      idProvider,
      "  serviceId:",
      serviceId,
      "subcategoryId",
      subcateId
    );
    try {
      const savingOrder = {
        customerId: user?._id,
        providerId: idProvider,
        serviceId: serviceId,
        subcategoryId: subcateId,
        providerServiceId: providerServiceId,
        // paymentStatus: "advance paid",
        // bookingStatus: "Pending",
        amount: {
          total: servicePrice,
          advancePaid: advancePaid,
          invoiceAmount: offerPrice,
          discount: discount,
          remaining: offerPrice - advancePaid,
          offerType: discountType,
          offerValue: couponDiscount,
          discountName: discountname,
          discountSource: discountSource,
          refferralCode: "", // optional
        },

        slot: {
          date: selectedDate,
          time: selectedTime,
        },
        bookingAddress: address,
        cancellation: {
          allowedTill: new Date(), // set your logic here
          refunded: false,
          refundAmount: 0,
          refundTo: "customer",
          split: {
            admin: 0,
            provider: 0,
          },
        },
        statusHistory: [
          {
            status: "Pending",
            at: new Date(),
            reason: "",
          },
        ],
        location: locationAddress,
        geoLocation: {
          type: "Point",
          coordinates: [coordinates?.lng, coordinates?.lat],
        },
        longitude: coordinates?.lng,
        latitude: coordinates?.lat,
        status: "Active",
        current: true,
        createdBy: user?._id,
        updatedBy: user?._id,
      };

      const ordrData = {
        amount: advancePaid,
        serviceId: serviceId,
      };
      console.log(JSON.stringify(savingOrder, null, 2) + "datas");
      const response = await customerAxiosClient.post(
        "/api/create_checkout_session",
        { ordrData, savingOrder }
      );

      const data = await response.data;
      console.log(data);
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to create checkout session");
      }
    } catch (error: any) {
      console.log("Full error object:", error);
      console.log("response.data:", error.message);

      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to create order. Please try again.");
      }
    }
  };

  const API = import.meta.env.VITE_API_URL;

  const imagePath = "providerServices/";
  let imageURL = "";

  imageURL = `${API}/uploads/${imagePath}`;

  let noimg = "noimage.png";
  const remainingAmount = finalPayableAmount - advancePaid;

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-gray-100 p-6 pb-24 relative">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
          {/* Left Section */}
          <div className="md:w-2/3 flex flex-col gap-4">
            {/* Booking Details */}
            <div className="bg-white rounded-lg shadow p-5">
              <h4 className="text-lg font-semibold mb-2">
                Send booking details to
              </h4>
              <p className="text-gray-700">+91 8075366768</p>
            </div>
            {/* Address */}
            <div className="bg-white rounded-lg shadow p-5">
              <h4 className="text-lg font-semibold mb-2">Address</h4>
              {address ? (
                <div className="flex justify-between items-center">
                  <p className="text-gray-700">{address}</p>
                  <button
                    className="bg-[#7879CA] text-white py-2 px-4 rounded"
                    onClick={() => setShowAddressModal(true)}
                  >
                    Edit address
                  </button>
                </div>
              ) : (
                <button
                  className="w-full bg-[#7879CA] text-white py-2 rounded mt-2"
                  onClick={() => setShowAddressModal(true)}
                >
                  Select an address
                </button>
              )}
            </div>

            {/* Slot */}
            <div
              className={`bg-white rounded-lg shadow p-5 ${
                isSlotEnabled ? "" : "opacity-50 cursor-not-allowed"
              }`}
            >
              <h4 className="text-lg font-semibold mb-2">Slot</h4>
              {selectedDate && selectedTime ? (
                <div className="flex justify-between items-center">
                  <p className="text-gray-700">
                    {selectedDate} at {selectedTime}
                  </p>
                  <button
                    className="bg-[#7879CA] text-white py-2 px-4 rounded"
                    onClick={() => setShowSlotModal(true)}
                  >
                    Edit slot
                  </button>
                </div>
              ) : (
                <button
                  className={`w-full ${
                    isSlotEnabled
                      ? "bg-[#7879CA] text-white"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  } py-2 rounded mt-2`}
                  onClick={() => isSlotEnabled && setShowSlotModal(true)}
                  disabled={!isSlotEnabled}
                >
                  Select slot
                </button>
              )}
            </div>
            {/* Payment Method */}
            <div
              className={`bg-white rounded-lg shadow p-5 ${
                isProceedEnabled ? "" : "opacity-50 cursor-not-allowed"
              }`}
            >
              <h4 className="text-lg font-semibold mb-2">Payment Method</h4>
              <button
                className={`w-full ${
                  isProceedEnabled
                    ? "bg-[#7879CA] text-white"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                } py-2 rounded mt-2`}
                disabled={!isProceedEnabled}
                onClick={handleProceedToPay}
              >
                Proceed to pay
              </button>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-white rounded-lg shadow p-5">
              <h4 className="text-lg font-semibold mb-2">
                Cancellation policy
              </h4>
              <p className="text-sm text-gray-600">
                Free cancellations till 5 mins after placing the booking or if a
                professional is not assigned. A fee will be charged otherwise.{" "}
                <a href="#" className="text-blue-600 underline">
                  Read full policy
                </a>
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="md:w-1/3 flex flex-col gap-4">
            {/* Service Summary */}
            <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
              {/* Image */}
              <img
                src={serviceImage ? imageURL + "/" + serviceImage : noimg} // replace with your actual image path
                alt="Foam-jet service"
                className="w-16 h-16 object-cover rounded"
              />
              {/* Text and price */}
              <div className="flex-1">
                <h4 className="text-lg font-semibold">{serviceName}</h4>
                <p className="text-sm text-gray-500 mb-2">
                  Subcategory: {subcategoryName}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold">₹{offerPrice}</p>
                  <p className="text-gray-400 line-through">₹{servicePrice}</p>
                </div>
              </div>
            </div>

            {/* Add-ons */}

            {/* Coupons */}
           {/* Coupons Section */}
<div className="bg-white rounded-lg shadow p-5">
  <div className="flex justify-between items-center">
    <h4 className="text-lg font-semibold">Coupons</h4>
    <button
      onClick={() => setShowCouponPopup(true)}
      className="text-purple-600 font-semibold underline"
    >
      {appliedCoupon ? "Change Coupon" : `View ${couponCount} Coupon${couponCount&&couponCount > 1 ? "s" : ""}`}
    </button>
  </div>

  {appliedCoupon && (
    <div className="bg-green-100 border border-green-300 rounded p-3 flex justify-between items-center mt-2">
      <span className="text-sm font-medium text-green-800">
        Applied Coupon: {appliedCoupon.couponName}
      </span>
      <button
        className="text-red-600 hover:underline text-sm"
        onClick={handleRemoveCoupon}
      >
        Remove
      </button>
    </div>
  )}
</div>

          


            {/* Payment Summary */}
            {/* Final Price Summary */}
            <div className="bg-white rounded-lg shadow p-5">
              <h4 className="text-lg font-semibold mb-2">Payment Summary</h4>
              <div className="flex justify-between">
                <span>Original Price</span>
                <span>₹{servicePrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Offer Discount</span>
                <span className="text-green-600">-₹{discount}</span>
              </div>
              {selectedCoupon && (
                <div className="flex justify-between">
                  <span>Coupon Discount ({selectedCoupon.couponName})</span>
                  <span className="text-green-600">
                    {" "}
                    -{discountType === "percentage" ? "%" : "₹"}
                    {couponDiscount}
                  </span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total Payable</span>
                <span>₹{finalPayableAmount}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Advance to Pay</span>
                <span>₹{advancePaid}</span>
              </div>

              <div className="flex justify-between font-semibold">
                <span>Remaining to Pay</span>
                <span>₹{remainingAmount}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Amount to Pay </span>
                <span>₹{advancePaid}</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                {discountType} You saved ₹{amountSaved} on this booking!
              </p>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-12 right-12 bg-white border-t border-gray-200 flex justify-between items-center px-6 py-4 shadow z-50">
          <div></div> {/* Empty left side */}
          <p className="text-lg font-bold">Amount to pay: ₹{advancePaid}</p>
        </div>

        {/* Address Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-96">
              <h4 className="text-lg font-semibold mb-4">Enter Address</h4>
              {/* <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                placeholder="Enter your address"
                onChange={(e) => setAddress(e.target.value)}
              /> */}
              <LocationAutocomplete
                locationAddress={locationAddress || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const input = e.target.value;
                  setLocationAddress(input);

                  setAddress(e.target.value);
                }}
                onSelect={handleLocationSelect}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 border rounded"
                  onClick={() => setShowAddressModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded"
                  onClick={() => handleAddressSave(address || "")}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Slot Modal */}
        {showSlotModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-96">
              <h4 className="text-lg font-semibold mb-4">Select Slot</h4>
              <label className="block mb-2">Select Date:</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <label className="block mb-2">Select Time:</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                onChange={(e) => setSelectedTime(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  Select a time
                </option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="4:00 PM">4:00 PM</option>
                <option value="6:00 PM">6:00 PM</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 border rounded"
                  onClick={() => setShowSlotModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded"
                  onClick={() =>
                    handleSlotSave(selectedDate || "", selectedTime || "")
                  }
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {showCouponPopup && (
          <CouponPopup
            coupons={availableCoupons}
            onClose={() => setShowCouponPopup(false)}
            onApply={handleApplyCoupon}
          />
        )}
      </div>
    </CustomerLayout>
  );
};

export default Checkout;

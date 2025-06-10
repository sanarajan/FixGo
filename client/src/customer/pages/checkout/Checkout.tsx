import React, { useEffect, useState } from "react";
import CustomerLayout from "../../../components/customerLayout/CustomerLayout";
import { useLocation } from "react-router-dom";
import customerAxiosClient from "../../../api/customerAxiosClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LocationAutocomplete from "../../../components/LocationPicker/LocationAutocomplete";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/Store";
const Checkout: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const location = useLocation();
  const providerServiceId = location.state?.providerServiceId || "";
  const [address, setAddress] = useState<string | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [servicePrice, setServicePrice] = useState<number>(1500);
  const [offerPrice, setOfferPrice] = useState<number>(1000);
  const [serviceId, setServiceId] = useState<string | null>(location.state?.serviceId || null);
  const [subcateId, setSubcateId] = useState<string | null>(location.state?.subcateId || null);
  const [idProvider, setIdProvider] = useState<string | null>(location.state?.idProvider || null);
  const {
    serviceName,
    subcategoryName,
    serviceImage,
    
  } = location.state || {};
  console.log(location.state?.subcateId + " subcate");
  const [locationAddress, setLocationAddress] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const tenPercentOfOffer = offerPrice * 0.1;
  useEffect(() => {
    if (!coordinates && !locationAddress) {
      fetchAddress();
    }
  }, [coordinates, locationAddress]);

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
    console.log( "customerId:", user?._id,
     " providerId:", idProvider,
    "  serviceId:", serviceId,
      "subcategoryId" ,subcateId)
    try {
       const savingOrder = {
      workerId: "ggh767658", // you can assign worker later if needed
      customerId: user?._id,
      providerId: idProvider,
      serviceId: serviceId,
      subcategoryId: subcateId,
      // paymentStatus: "advance paid",
      // bookingStatus: "Pending",
      amount: {
        total: servicePrice,
        advancePaid: tenPercentOfOffer,
        invoiceAmount: offerPrice,
        discount: servicePrice - offerPrice,
        remaining: servicePrice - tenPercentOfOffer,
        offertYype: "Flat", // if applicable
        offertValue: servicePrice - offerPrice,
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
        amount: tenPercentOfOffer,
        serviceId: serviceId,
      };
      console.log(JSON.stringify(savingOrder,null,2) + "datas")
      const response = await customerAxiosClient.post(
        "/api/create_checkout_session",
        {ordrData,savingOrder}
      );

      const data = await response.data;
      console.log(data);
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Error creating order.");
    }
  };

  const API = import.meta.env.VITE_API_URL;

  const imagePath = "providerServices/";
  let imageURL = "";

  imageURL = `${API}/uploads/${imagePath}`;

  let noimg = "noimage.png";
  return (
    <CustomerLayout>
      <div className="min-h-screen bg-gray-100 p-6 pb-24 relative">
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
            <div className="bg-white rounded-lg shadow p-5 flex justify-between items-center">
              <h4 className="text-lg font-semibold">Coupons and offers</h4>
              <button className="text-purple-600 font-semibold">
                2 offers
              </button>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-lg shadow p-5">
              <h4 className="text-lg font-semibold mb-4">Payment summary</h4>
              <div className="flex justify-between mb-2">
                <p>Item total</p>
                <p className="text-gray-600">₹100</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-blue-600 underline">Advance Payment</p>
                <p className="text-gray-600">₹{tenPercentOfOffer}</p>
              </div>
              <div className="flex justify-between mb-2 font-semibold">
                <p>Total amount</p>
                <p>₹{offerPrice}</p>
              </div>
              <div className="flex justify-between mb-2 font-semibold">
                <p>Amount to pay</p>
                <p>₹{tenPercentOfOffer}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-12 right-12 bg-white border-t border-gray-200 flex justify-between items-center px-6 py-4 shadow z-50">
          <div></div> {/* Empty left side */}
          <p className="text-lg font-bold">
            Amount to pay: ₹{tenPercentOfOffer}
          </p>
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
      </div>
    </CustomerLayout>
  );
};

export default Checkout;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import CustomerLayout from "../../../components/customerLayout/CustomerLayout";
import { useLocation } from "react-router-dom";
import customerAxiosClient from "../../../api/customerAxiosClient";
import { FaMapMarkerAlt } from "react-icons/fa";

interface Service {
  name: string;
  id: string;
  providerId: string;
  providerServiceId: string;
  providerServiceImg?: string;
  subcategoryId: string;
  image?: string;
  subcategoryName?: string;
  description?: string;
  features?: string;
  fullname?: string;
  totalAmount?: number;
  discountedAmount?: number;
  offerType?: "percentage" | "price"|"";
  offerValue?: number;
  offerName?: string;
}

const BookingDetails: React.FC = () => {
  const location = useLocation();
  const selectedData = location.state.card;
  const providerName = location.state.fullname;
  const idProvider = location.state.card.providerId;
  const serviceId = location.state.serviceId;
  const subcateId = location.state.card.subcategoryId;
  let providerImage = location.state.providerImage;
  const serviceImage = location.state.serviceImage;
  let serviceName = location.state.card.name;
  let subcategoryName = location.state.card.subcategoryName;
  const providerServiceId = location.state.providerServiceId;
  //offerdatas
  const originalPrice = location.state.originalPrice;
  const discountedPrice = location.state.discountedPrice;
  const offerName = location.state.offerName;
  const offerType = location.state.offerType;
  const offerValue = location.state.offerValue;
  const savings =
    originalPrice && discountedPrice && originalPrice > discountedPrice
      ? originalPrice - discountedPrice
      : 0;
  const [provideId, setProviderId] = React.useState<string | null>(
    selectedData.providerId
  );
  const [subservices, setSubservices] = useState<Service[]>(selectedData || []);
  const navigate = useNavigate();
  useEffect(() => {
    if (provideId) fetchProviderService(provideId);
  }, [provideId]);
  const fetchProviderService = async (providerId: string | null) => {
    try {
      const response = await customerAxiosClient.post(
        `/api/providerSubServices`,
        {
          serviceid: null,
          coordinates: null,
          mainServiceId: null,
          providerId: providerId,
        }
      );
      let data;
      if (response.status === 200) {
        data = await response.data;

        if (response.status === 200 && Array.isArray(response.data.services)) {
          setSubservices(
            response.data.services.map((item: any) => ({
              name: item.serviceName,
              providerId: item._id.providerId,
              providerServiceId: item._id.providerServiceId,
              subcategoryId: item._id.subcategoryId,
              fullname: item.fullname,
              image: item.image,
              id: item._id,
              subcategoryName: item.subcategoryName,
              providerServiceImg: item.providerservImg,
              description: item.description,
              features: item.features,
            }))
          );
        } else {
          console.error("Fetched data is not an array:", response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const API = import.meta.env.VITE_API_URL;
 let noimg = `${API}/asset/noimage.png`;

  const imagePath = "providerServices/";
  let imageURL = "";
if(providerImage){
  imageURL = `${API}/uploads/${imagePath}${providerImage}`;
}else{
  imageURL = noimg;
}
let servImg = noimg
if(serviceImage){
  servImg = `${API}/uploads/${imagePath}${serviceImage}`;
}

 
console.log(serviceImage+" image")
  // 🔧 Add this import
  return (
    <CustomerLayout>
      {/* Gradient Banner */}
      <div className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-6 rounded-xl mb-6 shadow flex items-center justify-center gap-4 relative px-4">
        <img
          src={imageURL}
          alt="Provider"
          className="w-16 h-16 rounded-full object-cover border-2 border-white"
        />
        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold">{providerName}</h2>
          <p className="text-sm">
            Trusted, affordable services at your convenience.
          </p>
        </div>
      </div>
<div className="bg-[#F5F6FA] min-h-screen p-6">
  <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
    {/* Left: Image */}
    <div className="w-full lg:w-5/12">
<div className="w-full h-[400px] rounded-xl shadow overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
  <img
    src={
     servImg
    }
    alt={selectedData.name}
    className="max-h-full max-w-full object-contain"
  />
</div>

    </div>

    {/* Right: Details & Summary */}
    <div className="w-full lg:w-7/12 flex flex-col gap-6">
      {/* Service Details Box */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {selectedData.name}
        </h2>
        <h4 className="text-md text-gray-600 mt-2">
          Category:{" "}
          <span className="text-gray-800 font-medium">
            {subcategoryName}
          </span>
        </h4>
        {selectedData.description && (
          <p className="text-gray-700 mt-2">{selectedData.description}</p>
        )}
        {selectedData.features && (
          <p className="text-gray-600 mt-2">
            <strong>Feature:</strong> {selectedData.features}
          </p>
        )}
        <div className="text-sm text-gray-500 flex items-center gap-2 mt-2">
          <FaMapMarkerAlt className="text-red-500" />
          Service provided by:{" "}
          <span className="text-gray-800 font-medium">{providerName}</span>
        </div>

        {/* Price Box */}
        {/* <div className="mt-4 border-t pt-4">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">
            Price Details
          </h3>
          {discountedPrice && discountedPrice !== originalPrice ? (
            <>
              <div className="text-purple-900 text-2xl font-bold">
                ₹{discountedPrice}
                <del className="text-gray-400 ml-2 text-base font-normal">
                  ₹{originalPrice}
                </del>
              </div>
              {offerValue && offerType && (
                <div className="mt-1 text-green-700 text-sm font-medium">
                  {offerType === "percentage"
                    ? `${offerValue}% Off`
                    : `₹${offerValue} Off`}{" "}
                  {offerName ? `- ${offerName}` : ""}
                </div>
              )}
              <div className="text-sm text-gray-600 mt-1">
                You save{" "}
                <span className="font-semibold text-green-700">
                  ₹{savings}
                </span>
              </div>
            </>
          ) : (
            <div className="text-purple-900 text-2xl font-bold">
              ₹{originalPrice}
            </div>
          )}
        </div> */}
      </div>

      {/* Booking Summary & Button */}
      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-indigo-800 mb-2">
          Booking Summary
        </h2>
        {/* <div className="text-gray-700 mb-2">
          <strong>Service:</strong> {selectedData.name}
        </div>
        <div className="text-gray-700 mb-2">
          <strong>Category:</strong> {subcategoryName}
        </div> */}
        {/* <div className="text-gray-700 mb-2">
          <strong>Provider:</strong> {providerName}
        </div> */}

        <div className="mt-3 text-lg font-bold text-indigo-900">
          {discountedPrice && discountedPrice !== originalPrice ? (
            <>
              ₹{discountedPrice}
              <del className="text-gray-400 ml-2 text-sm">₹{originalPrice}</del>
            </>
          ) : (
            <>₹{originalPrice}</>
          )}
        </div>

        {offerValue && offerType && (
          <div className="text-green-600 text-sm font-medium mt-1">
            {offerType === "percentage"
              ? `${offerValue}% Off`
              : `₹${offerValue} Off`}{" "}
            {offerName ? `- ${offerName}` : ""}
          </div>
        )}

        {savings > 0 && (
          <div className="text-sm text-gray-600 mt-1">
            You save{" "}
            <span className="font-semibold text-green-700">₹{savings}</span>
          </div>
        )}

        <button
          onClick={() => {
            navigate("/Checkout", {
              state: {
                idProvider,
                serviceId,
                subcateId,
                serviceName,
                subcategoryName,
                provideId,
                providerName,
                serviceImage,
                providerImage,
                providerServiceId,
                originalPrice,
                discountedPrice,
                offerName,
                offerType,
                offerValue,
                savings,
              },
            });
          }}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg shadow"
        >
          Book Service
        </button>
      </div>
    </div>
  </div>
</div>

    </CustomerLayout>
  );
};

export default BookingDetails;

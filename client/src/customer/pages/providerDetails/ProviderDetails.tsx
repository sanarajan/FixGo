import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import CustomerLayout from "../../../components/customerLayout/CustomerLayout";
import { useLocation } from "react-router-dom";
import customerAxiosClient from "../../../api/customerAxiosClient";

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
}

const ProviderDetails: React.FC = () => {
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

  const imagePath = "providerServices/";
  let imageURL = "";

  imageURL = `${API}/uploads/${imagePath}`;

  let noimg = "noimage.png";
  providerImage = imageURL + providerImage;
  return (
    <CustomerLayout>
      {/* Full-width Banner below header */}
      <div className="w-full bg-[#dfe0ff] py-6 rounded-xl mb-6 shadow flex items-center justify-center gap-4 relative px-4">
        {/* Left Side: Rounded Image */}
        <img
          src={providerImage || ""} // make sure this path is correct
          alt="Provider"
          className="w-16 h-16 rounded-full object-cover"
        />

        {/* Center Content */}
        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold text-[#333]">{providerName}</h2>
          <p className="text-[#555] mt-1">
            Fast, affordable, and professional. Choose from a range of services
            tailored to your needs.
          </p>
        </div>
      </div>

      <div className="bg-[#F6F7FB] min-h-screen p-6">
        {/* Header */}
        <div className="flex justify-between mb-4">
          <div className="text-lg text-[#7879CA] font-semibold">
            Services Categories
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 border border-[#7879CA] rounded text-[#7879CA] hover:bg-[#ececff]">
              Feeds
            </button>
            <button className="px-4 py-2 bg-[#7879CA] text-white rounded hover:bg-[#5c5dc7]">
              Services
            </button>
          </div>
        </div>

        {/* Main content row */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Service cards (70%) */}
          <div className="w-full lg:w-8/12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {subservices &&
              subservices?.length > 0 &&
              subservices?.map((service, idx) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden p-4 flex flex-col justify-between"
                >
                  <img
                    src={
                      service.providerServiceImg
                        ? imageURL + "/" + service.providerServiceImg
                        : noimg
                    }
                    alt={service.name}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />

                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {service.name}
                    </h3>

                    <div className="text-[#7879CA] font-bold">{100} Rs</div>
                  </div>
                  <div className="text-sm text-green-600 font-medium mt-1">
                    <h5 className="text-lg font-semibold text-gray-500">
                      {service.subcategoryName}
                    </h5>
                  </div>
                  <div className="text-sm text-green-600 font-medium mt-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {service.description}
                    </h3>
                  </div>
                  {/* {service.discount && ( */}
                  <div className="text-sm text-green-600 font-medium mt-1">
                    30% OFF
                  </div>
                  {/* )} */}

                  {/* <div className="flex justify-between items-center mt-4">
                    <button className="px-4 py-2 bg-[#7879CA] text-white rounded hover:bg-[#5c5dc7]">
                      Book Now
                    </button>
                    <FaShoppingCart className="text-[#7879CA] text-xl cursor-pointer" />
                  </div> */}
                </div>
              ))}
          </div>

          {/* Right: Billing and rating section (30%) */}
          <div className="w-full lg:w-4/12 space-y-6">
            {/* Booking Summary */}
            <div className="bg-[#e7e8fd] p-6 rounded-xl shadow-md">
              <h2 className="text-gray-700 font-semibold mb-2">
                Provider : <span>{providerName}</span>
              </h2>

              <h2 className="text-gray-700 font-semibold mb-2">
                Service Name:
              </h2>
              <div className="flex justify-between items-center mb-4">
                <span>{serviceName}</span>
                {/* <span className="text-sm font-medium">
                  150 ₹ <del className="text-gray-400 ml-2">180 ₹</del>
                </span> */}
              </div>
              <h2 className="text-gray-700 font-semibold mb-2">Category :</h2>
              <div className="flex justify-between items-center mb-4">
                <span>{subcategoryName}</span>
                <span className="text-sm font-medium">
                  100 ₹ <del className="text-gray-400 ml-2">150 ₹</del>
                </span>
              </div>
            
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
                      providerServiceId
                    },
                  });
                }}
                className="w-full bg-[#7879CA] text-white py-2 rounded-xl shadow hover:bg-[#6364b4]"
              >
                Book Service
              </button>
            </div>

            {/* Premium Package */}
            <div className="bg-white p-5 rounded-xl shadow-md">
              <h3 className="font-semibold mb-2 text-gray-800">
                Benefits Of The Premium Package:
              </h3>
              <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
                <li>Quality Service</li>
                <li>Service Guarantee</li>
                <li>Schedule Maintain</li>
              </ul>
            </div>

            {/* Rating & Reviews */}
            <div className="bg-white p-5 rounded-xl shadow-md">
              <h3 className="font-semibold mb-4 text-gray-800">
                Ratings and review
              </h3>
              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold text-[#444]">4.2</div>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <div className="w-24 bg-green-500 h-2 rounded"></div>
                    <span className="ml-2 text-sm">5★</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 bg-green-400 h-2 rounded"></div>
                    <span className="ml-2 text-sm">4★</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 bg-yellow-400 h-2 rounded"></div>
                    <span className="ml-2 text-sm">3★</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 bg-orange-400 h-2 rounded"></div>
                    <span className="ml-2 text-sm">2★</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 bg-red-400 h-2 rounded"></div>
                    <span className="ml-2 text-sm">1★</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                5,433 Ratings & 330 Reviews
              </p>
            </div>
            {/* Related Services */}
            <div className="bg-white p-5 rounded-xl shadow-md">
              <h3 className="font-semibold mb-4 text-gray-800 text-center">
                Related Services
              </h3>

              {/* Related Service Card 1 */}
              <div className="bg-[#f9f9ff] rounded-xl overflow-hidden mb-4 shadow-sm">
                <div className="relative">
                  <img
                    src="/images/gas.jpg"
                    alt="Gas Plumbing Services"
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-[#7879CA] text-white px-2 py-1 text-sm rounded">
                    ₹150
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-gray-700 mb-1">
                    Gas Plumbing Services
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Gas Pipeline Installation</li>
                    <li>Gas Leak Detection & Repair</li>
                    <li>Kitchen Gas Line Maintenance</li>
                  </ul>
                </div>
              </div>

              {/* Related Service Card 2 */}
              <div className="bg-[#f9f9ff] rounded-xl overflow-hidden shadow-sm">
                <div className="relative">
                  <img
                    src="/images/water.jpg"
                    alt="Water System Services"
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-[#7879CA] text-white px-2 py-1 text-sm rounded">
                    ₹150
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-gray-700 mb-1">
                    Water System Services
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Gas Pipeline Installation</li>
                    <li>Gas Leak Detection & Repair</li>
                    <li>Kitchen Gas Line Maintenance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default ProviderDetails;

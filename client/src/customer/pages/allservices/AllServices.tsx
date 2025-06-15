import React from "react";
import CustomerLayout from "../../../components/customerLayout/CustomerLayout";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/Store";
import { FaTools } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ServiceCarousel from "../../../components/keenSlider/ServiceCarousel";

const AllServices: React.FC = () => {
  const { service } = useSelector((state: RootState) => state.service);
  const navigate = useNavigate();

  const goSubcategory = (serviceId: string) => {
    navigate("/subServices", { state: { serviceId } });
  };
let imageURL = "";
  const API = import.meta.env.VITE_API_URL;

  let img = "saloons2.png";
  imageURL = `${API}/asset/${img}`;
  return (
    <CustomerLayout>
     <div className="min-h-screen bg-white p-6 md:p-10">
  {/* Split screen layout */}
  <div className="flex flex-col lg:flex-row gap-8">
    {/* Left side - Service Grid */}
    <div className="w-full lg:w-2/5">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Choose a Service
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-5">
        {service.map((service, idx) => (
          <div
            onClick={() => goSubcategory(service?.id)}
            key={idx}
            className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 hover:-translate-y-1 cursor-pointer flex flex-col items-center"
          >
            <FaTools className="w-10 h-10 text-indigo-600 mb-3" />
            <span className="text-sm font-medium text-center text-gray-700">
              {service.name}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Right side - Big Image + Popular Carousel */}
    <div className="w-full lg:w-3/5 flex flex-col items-center justify-start">
      <img
        src={imageURL}
        alt="Service Illustration"
        className="w-full h-auto max-h-[500px] object-contain rounded-xl shadow-lg mb-6"
      />

      <div className="w-full px-1 md:px-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Popular Services
        </h2>
        <ServiceCarousel />
      </div>
    </div>
  </div>
</div>

    </CustomerLayout>
  );
};

export default AllServices;

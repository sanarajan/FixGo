// pages/AllServices.tsx
import React from "react";
import CustomerLayout from "../../../components/customerLayout/CustomerLayout";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/Store";
import { FaTools } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AllServices: React.FC = () => {
  const { service } = useSelector((state: RootState) => state.service);
  const navigate = useNavigate();
  const goSubcategory = (serviceId: string) => {
    navigate("/subServices", { state: {serviceId }});
  };
  return (
    <CustomerLayout>
      <div className="p-4 md:p-10 bg-white min-h-screen">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-700">
          Our Services
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {service.map((service, idx) => (
            <div
              onClick={() => {
                goSubcategory(service?.id);
              }}
             
              key={idx}
              className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-md shadow hover:shadow-md transition"
            >
              <FaTools className="w-10 h-10 mb-2" />
              <span className="text-sm font-medium text-center">
                {service.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
};

export default AllServices;

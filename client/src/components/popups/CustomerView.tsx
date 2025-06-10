import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosClient from "../../api/axiosClient";
import LocationPicker from "../../components/LocationPicker/LocationPicker";

type Subcategory = {
  _id: string;
  name: string;
};

type GroupedProviderService = {
  serviceId: string;
  serviceName: string;
  subcategories: Subcategory[];
};

interface Props {
  mode: "add" | "edit" | "view";
  data?: any;
  setShowPopup: () => void;
  refresh?: () => void;
  userType?: string;
  imagePath?:string
}

const CustomerView: React.FC<Props> = ({ mode, data, userType,imagePath, setShowPopup, refresh }) => {
 const [formData, setFormData] = useState({
     fullname: "",
     email: "",
     phone: "",
    //  location: "",
     image: null as File | null,
     role: "provider",
   });
   const staffItem = data;
 
   const [coordinates, setCoordinates] = useState<{
     lat: number;
     lng: number;
   } | null>(null);
 
   const [locationAddress, setLocationAddress] = useState<string | null>(null);
 
   useEffect(() => {
    //  const resolvedLocation =
    //    Array.isArray(staffItem.address) && staffItem.address.length
    //      ? staffItem.address[0].location
    //      : "";
    //  setLocationAddress(resolvedLocation);
     if (staffItem) {
       setFormData({
         fullname: staffItem.fullname || "",
         email: staffItem.email || "",
         phone: staffItem.phone || "",
        //  location: staffItem.address.location || resolvedLocation || "",
         image: staffItem.image || "noimage.png", // You may optionally show image preview from staffItem.image URL
         role: staffItem.role || "provider",
       });
 
      
 
    //    setCoordinates({
    //      lat: staffItem.address[0].latitude,
    //      lng: staffItem.address[0].longitude,
    //    });
     }
   }, []);
 
   const navigate = useNavigate();
  
   
  
 
   
 
   const googlekey = import.meta.env.VITE_GOOGLEAPI_KEY;
   const API = import.meta.env.VITE_API_URL;
 
    imagePath = "providerServices/";
   let imageURL = "";
   if (formData.image instanceof File) {
     imageURL = URL.createObjectURL(formData.image);
   } else if (
     typeof formData.image === "string" &&
     formData.image !== "noimage.png"
   ) {
     imageURL = `${API}/uploads/${imagePath}${formData.image}`;
   } else {
     imageURL = "noimage.png";
   }
  const closePopup = () => setShowPopup();
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
    <ToastContainer
           position="top-center"
           autoClose={5000}
           hideProgressBar={false}
           closeOnClick
           pauseOnHover
         />
      <div className="bg-white rounded-xl shadow-xl w-[800px] max-h-[90vh] overflow-y-auto mt-4">

      <div className="bg-[#5A52A4] text-white py-3 px-4 rounded-t-xl flex justify-between items-center">
      <span className="font-semibold text-sm">
            {mode === "add" ? "Add Service" : mode === "edit" ? "Edit Service" : "View Service"}
          </span>
          <button onClick={closePopup} className="text-white text-lg font-bold hover:text-gray-300">✖️</button>
        </div>

        <div className="p-6 space-y-4 text-sm">
       <div className="text-center">
        <div className="p-5 rounded-md border border-gray-300 bg-[#F9F9FC] space-y-4">
                <h2 className="text-2xl font-bold text-[#5A52A4]">
                  Basic Information
                </h2>
                <div className="grid grid-cols-6 md:grid-cols-3 gap-2">
                  <div className="md:col-span-4 flex items-center gap-4">
                  
                    <img src={imageURL} className="h-[100px] w-[100px]" />
      
                   
                  </div>
                  
                  <div className="flex flex-col">
                     <label className="font-bold" style={{"marginLeft":"-5rem"}}>Name:</label>
                   <p className="me-18">{formData.fullname}</p>
                   
                  </div>
                  <div className="flex flex-col">
                         <label className="font-bold" style={{"marginLeft":"-5rem"}}>Email:</label>
                  <p className="me-18"> {formData.email}</p> 
                  </div>
                  <div className="flex flex-col">
                         <label className="font-bold" style={{"marginLeft":"-5rem"}}>Phone:</label>
                     <p className="me-18"> {formData.phone}</p>
                  
                  </div>
                </div>
              </div>
      
              {/* === Section 2: Manage Services === */}
              <div className="p-5 rounded-md border border-gray-300 bg-[#F9F9FC] space-y-4">
                <h2 className="text-2xl font-bold text-[#5A52A4]">
                 Bookings
                </h2>
                <div>
                  <label className="font-semibold mr-2">No Booking</label>
                
                </div>
      
              
              </div>
      
              {/* === Section 3: Address === */}
              <div className="p-5 rounded-md border border-gray-300 bg-[#F9F9FC]">
                <h2 className="text-2xl font-bold text-[#5A52A4] mb-4">Address</h2>
                  <div className="flex flex-col">
                    <label className="font-medium text-sm mb-1"></label>
                  
                  <input   className="bg-[rgb(234,232,248)] p-2 rounded-md w-[100%]" type="text" value={locationAddress?locationAddress:""} />
                  
                  </div>
                  <LocationPicker
                    coordinates={coordinates}
                    onLocationSelect={()=>{}}
                  />
              
      
              </div>
      
              {/* === Save Button === */}
              <div className="pt-4 text-center">
               <button
                    onClick={closePopup}
                    className="px-4  py-2 border rounded-md border-gray-400 text-gray-700"
                  >
                    Close
                  </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerView;

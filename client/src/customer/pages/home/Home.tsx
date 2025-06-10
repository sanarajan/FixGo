import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import ServiceCarousel from "../../../components/keenSlider/ServiceCarousel";
import customerAxiosClient from "../../../api/customerAxiosClient";
import CustomerLayout from "../../../components/customerLayout/CustomerLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/Store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LocationAutocomplete from "../../../components/LocationPicker/LocationAutocomplete";

import {
  resetService,
  setService,
  setSubcategory,
} from "../../../redux/ServiceSlice";
interface Service {
  name: string;
  id: string;
  subcategories: string[];
}
interface SubcategoryInt {
  name: string;
  id: string;
  serviceId: string[];
}
const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { service, subcategory } = useSelector(
    (state: RootState) => state.service
  );
  const [locationAddress, setLocationAddress] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    location: "",
  });
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [errors, setFormErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Service[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryInt[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [allServices, setAllServices] = useState<Service[]>(service);
  const [showServices, setShowServices] = useState<boolean>(false);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);
   const [serviceId, setServiceId] = useState<string>("");
    const geckUser=  localStorage.getItem("customer_accessToken");
  useEffect(() => { 

    if (service.length === 0||!geckUser) fetchServices();

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [geckUser,service]);
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }
    const filtered = service.filter((servic) =>
      servic.name.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered);
  }, [query, subcategories]);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      suggestionBoxRef.current &&
      !suggestionBoxRef.current.contains(event.target as Node)
    ) {
      setSuggestions([]);
      setSubcategories([]);
      setShowServices(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await customerAxiosClient.get(`/api/adminServices`);
      let data;
      if (response.status === 200) {
        data = await response.data;
      

        if (
          response.status === 200 &&
          Array.isArray(response.data.serviceslist)
        ) {
          setAllServices(
            response.data.serviceslist.map((item: any) => ({
              name: item.serviceName,
              id: item._id,
              subcategories: [],
            }))
          );
          setShowServices(
            response.data.serviceslist.map((item: any) => ({
              name: item.serviceName,
              id: item._id,
              subcategories: [],
            }))
          );
          dispatch(
            setService(
              response.data.serviceslist.map((item: any) => ({
                name: item.serviceName,
                id: item._id,
                subcategories: [],
              }))
            )
          );
        } else {
          console.error("Fetched data is not an array:", response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
    setShowServices(true);
    if (inputValue.trim() === "") {
      setSubcategories([]);
      setSelectedSubcategory("");
      //  dispatch(setService([]));
      dispatch(setSubcategory([]));
      setSuggestions([]);
      return;
    }
    const filtered = service.filter((servic) =>
      servic.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleSelectSuggestion = async (service: Service) => {
    let id = service.id;
    setShowServices(false);
    setServiceId(service.id)
    setQuery(service.name);
    setSuggestions([]);
    try {
      const response = await customerAxiosClient.get(
        `/api/adminSubcategories/${id}`
      );
      let data;
      if (response.status === 200) {
        data = await response.data;

        if (
          response.status === 200 &&
          Array.isArray(response.data.serviceslist) &&
          response.data.serviceslist.length > 0
        ) {
          const formatted = response.data.serviceslist.map((item: any) => ({
            name: item.subcategory,
            id: item._id,
            serviceId: item.serviceId,
          }));

          setSubcategories(formatted);
        } else {
          setSelectedSubcategory("");
          toast.error("No services exist");
          // navigate("/allservices");

          console.error("Fetched data is not an array:", response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleInputClick = () => {
    setShowServices(true);

    if (query.trim() === "") {
      setSuggestions(allServices);
    }
  };

  const handleSubcategoryChangeClick = (id: string, subname: string) => {

    navigate("/subServices", {
      state: { id, coordinates, locationAddress, subname,serviceId },
    });
  };

  const clickMore = () => {
    navigate("/allservices");
  };
  const handleLocationSelect = (coords: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setLocationAddress(coords.address);
    setCoordinates({ lat: coords.lat, lng: coords.lng });
    setFormData((prev) => ({ ...prev, location: coords.address }));
    if (coords.address) {
      setFormErrors((prev) => ({
        ...prev,
        location: "",
      }));
    }
  };

  const API = import.meta.env.VITE_API_URL;

  let imageURL = "";

  let img = "saloons2.png";
  imageURL = `${API}/asset/${img}`;
  //   const imageURL = `${API}/asset/saloon.webp`;
  return (
    <CustomerLayout>
      <div className="min-h-screen bg-white font-sans">
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="px-4 md:px-8 py-10">
          <div className="flex flex-col md:flex-row gap-8 mb-3">
            {/* Left */}
            <div className="w-full md:w-1/2">
              <div className="text-3xl md:text-4xl font-semibold mb-1">
                Home services at your doorstep
              </div>
              <div className="px-4 md:px-8 py-10">
                <div className="flex flex-col md:flex-row gap-8 mb-2">
                  <LocationAutocomplete
                    locationAddress={locationAddress || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const input = e.target.value;
                      setLocationAddress(input);
                      setFormData((prev) => ({ ...prev, location: input }));
                    }}
                    onSelect={handleLocationSelect}
                  />
                  <div
                    className="relative w-full md:w-60"
                    ref={suggestionBoxRef}
                  >
                    <input
                      type="text"
                      placeholder="Electricians"
                      value={query}
                      onChange={handleInputChange}
                      onClick={handleInputClick}
                      className="px-4 py-2 border border-gray-300 rounded-md w-full"
                    />
                    {showServices && suggestions.length > 0 && (
                      <ul className="absolute z-10 bg-white border mt-1 rounded-md w-full shadow-md max-h-40 overflow-y-auto">
                        {suggestions.map((item, idx) => (
                          <li
                            key={idx}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelectSuggestion(item)}
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    )}
                    {subcategories.length > 0 && (
                      <ul className="absolute z-10 bg-white border mt-1 rounded-md w-full shadow-md max-h-40 overflow-y-auto">
                        {subcategories.map((subcat, idx) => (
                          <li
                            key={idx}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSelectedSubcategory(subcat.name);
                              setSubcategories([]);
                              setSuggestions([]);
                              handleSubcategoryChangeClick(
                                subcat.id,
                                subcat.name
                              );
                            }}
                          >
                            {subcat.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-xl p-6 md:p-8">
                <div className="text-lg md:text-xl font-medium mb-4">
                  What are you looking for?
                </div>
                <div className="relative">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                    {service.slice(0, 4).map((servic, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-lg shadow-md p-4 flex items-center gap-2"
                      >
                        <span>🔧</span>
                        <span>{servic.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={clickMore}
                      className="text-sm px-3 py-1 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
                    >
                      More →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <img
                src={imageURL}
                alt="Service visual"
                className="rounded-xl shadow-lg object-cover w-full h-64 md:h-[400px]"
              />
            </div>
          </div>

          {/* Carousel Section */}
          <div className="px-2 md:px-4">
            <ServiceCarousel />
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default Home;

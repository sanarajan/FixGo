// src/pages/ProviderSubcategoryPage.tsx

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import FilterSidebar from "./FilterSidebar";
import CustomerLayout from "../../../components/customerLayout/CustomerLayout";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/Store";
import customerAxiosClient from "../../../api/customerAxiosClient";
import LocationAutocomplete from "../../../components/LocationPicker/LocationAutocomplete";

import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  resetService,
  setService,
  setSubcategory,
} from "../../../redux/ServiceSlice";
interface ServiceCard {
  id: number;
  name: string;
  price: number;
  rating: number;
  provider: string;
  image: string;
}
interface Service {
  name: string;
  id: string;
  providerId:string;
  providerServiceId: string;
  providerservImg?: string;
 subcategoryId: string;
serviceId: string;
  image?: string;
  subcategoryName?: string;
  description?: string;
  features?: string;
  fullname?: string;
}
interface SubcategoryInt {
  name: string;
  id: string;
  serviceId: string[];
}
type Subcategory = {
  _id: string;
  subcategory: string;
};

const ProviderSubcategoryPage: React.FC = () => {
  const dispatch = useDispatch();
  const { service, subcategory } = useSelector(
    (state: RootState) => state.service
  );
  //comming from previous page
  const location = useLocation();
  const serviceid = location.state.id;
  const providerLOcation = location.state.locationAddress;
  const subname = location.state.subname;
  const coord = location.state.coordinates;
  const mainServiceId = location.state.serviceId;
  const [mainServiceIdState, setMainServiceIdState] = useState<string>(
    mainServiceId || ""
  );
  const [subcatname, setSubcatname] = useState<string>(subname || "");
  //end comming from previous page
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Service[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryInt[]>([]);
  // const [allServices, setAllServices] = useState<Service[]>(service);
  const [showServices, setShowServices] = useState<boolean>(false);
  const [subservices, setSubservices] = useState<Service[]>();
  const suggestionBoxRef = useRef<HTMLDivElement>(null);
  const [locationAddress, setLocationAddress] = useState<string | null>(
    providerLOcation || null
  );
  const [formData, setFormData] = useState({});
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(coord || null);
  const [errors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [subserviceId, setSubserviceId] = useState<string | null>(() =>
    String(serviceid || "")
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<
    Subcategory[]
  >([]);
   const navigate=useNavigate();

  useEffect(() => {
    if (serviceid || mainServiceIdState)
      fetchProviderService(subserviceId || "");
    fetchCategoriesOfService(mainServiceIdState);

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [serviceid, locationAddress]);
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }
    const filtered = service.filter((servic) =>
      servic.name.toLowerCase().includes(query.toLowerCase())
    );
    // setSuggestions(filtered);
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
  const fetchCategoriesOfService = async (serviceId: string) => {
    try {
      const response = await customerAxiosClient.get(
        `/api/categoriesOfServices/${serviceId}`
        // { serviceId: serviceId }
      );
      let data;
      if (response.status === 200) {
        data = await response.data;

        if (
          response.status === 200 &&
          Array.isArray(response.data.categories)
        ) {
          setSelectedSubcategories(response.data.categories);
          // setSubservices(
          //   response.data.services.map((item: any) => ({
          //     name: item.serviceName,
          //     fullname: item.fullname,
          //     image: item.image,
          //     id: item._id,
          //     subcategoryName: item.subcategoryName,

          //     description: item.description,
          //     features: item.features,
          //   }))
          // );

          // console.log(selectedSubcategories+" selected categories")
        } else {
          console.error("Fetched data is not an array:", response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const fetchProviderService = async (subserviceId: string | null) => {
    try {
      console.log(
        subserviceId + " first",
        coordinates + " sec",
        mainServiceIdState + " third",
        "this is passing data"
      );
      const response = await customerAxiosClient.post(
        `/api/providerSubServices`,
        {
          serviceid: subserviceId ? subserviceId : null,
          coordinates: coordinates ? coordinates : null,
          mainServiceId: mainServiceIdState ? mainServiceIdState : null,
          providerId:null
        }
      );
      let data;
      if (response.status === 200) {
        data = await response.data;

        if (response.status === 200 && Array.isArray(response.data.services)) {
          setSubservices(
            response.data.services.map((item: any) => ({
              name: item.serviceName,
              providerId:item._id.providerId,
              providerServiceId:item._id.providerServiceId,
              subcategoryId: item._id.subcategoryId,
              serviceId: item._id.serviceId,
              fullname: item.fullname,
              image: item.image,
              id: item._id,
              subcategoryName: item.subcategoryName,
              description: item.description,
              features: item.features,
              providerservImg:item.providerservImg
            }))
          );
          setShowServices(
            response.data.services.map((item: any) => ({
              name: item.serviceName,
              fullname: item.fullname,
               providerId:item._id.providerId,
              providerServiceId:item._id.providerServiceId,
              subcategoryId: item._id.subcategoryId,
              serviceId: item._id.serviceId,
              image: item.image,
              id: item._id,
              description: item.description,
              features: item.features,
              subcategoryName: item.subcategoryName,
               providerservImg:item.providerservImg
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
    setShowServices(true);
    if (inputValue.trim() === "") {
      setSubcategories([]);
      //  dispatch(setService([]));
      dispatch(setSubcategory([]));
      setSuggestions([]);
      return;
    }
    const filtered = service.filter((servic) =>
      servic.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    // setSuggestions(filtered);
  };

  const handleSelectSuggestion = async (service: Service) => {
    let id = service.id;
    setShowServices(false);
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
          Array.isArray(response.data.serviceslist)
        ) {
          const formatted = response.data.serviceslist.map((item: any) => ({
            name: item.subcategory,
            id: item._id,
            serviceId: item.serviceId,
          }));

          setSubcategories(formatted);
        } else {
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
      //  setSuggestions(allServices);
    }
  };
  const toggleFilter = (): void => {
    setShowFilter(!showFilter);
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
    fetchProviderService(subserviceId);
  };
  const handleSubserviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSubserviceId(value);

    // 👉 Call any other functions or actions you need here
    console.log("Subservice selected:", value);

    // For example:
    fetchProviderService(value);
  };

  const API = import.meta.env.VITE_API_URL;

  const imagePath = "providerServices/";
  let imageURL = "";

  imageURL = `${API}/uploads/${imagePath}`;

  let noimg = "noimage.png";

  return (
    <CustomerLayout>
      <div className="flex relative min-h-screen bg-gray-100 p-4">
        {/* Sidebar Filter */}
        {showFilter && <FilterSidebar />}

        {/* Main Content */}
        <div className={`flex-1 transition-all ${showFilter ? "ml-2" : ""}`}>
          {/* Top Search Bar */}
          <div className="flex justify-between items-center bg-white p-4 rounded shadow mb-4">
            <div className="flex items-center gap-2 w-full ">
              <span className="text-purple-600 hidden">📍 Calicut</span>
              <LocationAutocomplete
                locationAddress={locationAddress || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const input = e.target.value;
                  setLocationAddress(input);
                  setFormData((prev) => ({ ...prev, location: input }));
                }}
                onSelect={handleLocationSelect}
              />
              <div className="relative w-full md:w-60" ref={suggestionBoxRef}>
                {/* <input
                  type="text"
                  placeholder="Electricians"
                  value={query}
                  onChange={handleInputChange}
                  onClick={handleInputClick}
                  className="px-4 py-2 border border-gray-300 rounded-md w-full"
                /> */}
                {/* {showServices && suggestions.length > 0 && (
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
                )} */}
                <select
                  value={subserviceId || ""}
                  onChange={handleSubserviceChange}
                  className="px-4 py-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="">subcategory</option>
                  {selectedSubcategories &&
                    selectedSubcategories.length > 0 &&
                    selectedSubcategories.map((sub, subIdx) => (
                      <option key={subIdx} value={sub._id}>
                        {sub.subcategory}
                      </option>
                    ))}
                </select>
                {/* {subcategories.length > 0 && (
                  <ul className="absolute z-10 bg-white border mt-1 rounded-md w-full shadow-md max-h-40 overflow-y-auto">
                    {subcategories.map((subcat, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSubcategories([]);
                          setSuggestions([]);
                        }}
                      >
                        {subcat.name}
                      </li>
                    ))}
                  </ul>
                )} */}
              </div>
            </div>
            <button
              onClick={toggleFilter}
              className="ml-4 p-2 rounded-full bg-purple-600 text-white"
              title="Toggle Filters"
            >
              🧰
            </button>
          </div>

          <div className="w-full mb-4">
            <div className="text-center mt-2  text-sm  text-gray-700">
              {subservices && subservices[0]?.name}
            </div>
          </div>
          {/* Service Cards */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {subservices &&
                subservices?.length > 0 &&
                subservices?.map((card, idx) => (
                  <div
                    onClick={() => {
                
                 navigate("/ProviderDetails", { state: {card,providerServiceId:card.providerServiceId,providerImage:card.image,fullname:card.fullname,serviceImage:card.providerservImg,serviceId:mainServiceIdState,subcateId:card.subcategoryId }});
                
                }}
                    key={idx}
                    className="bg-white rounded shadow p-4 cursor-pointer"
                  >
                    <img
                      src={card.image ? imageURL + "/" + card.image : noimg}
                      alt={card.image}
                      className="w-full h-40 object-cover rounded"
                    />
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-yellow-500 font-medium">★ {4}</span>
                      <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-sm">
                        ₹{100}
                      </span>
                    </div>
                    <h3 className="mt-2 font-semibold text-lg truncate text-gray-500">
                      <span className="mt-2 font-semibold text-lg truncate text-purple-500">
                        Service:
                      </span>{" "}
                      {card.name}
                    </h3>

                    <h3 className="mt-2 font-semibold text-lg truncate text-gray-500">
                      <span className="text-purple-500">Category:</span>{" "}
                      {card.subcategoryName || ""}
                      {/* {(card.subcategories ?? [])
      .map((sub: any) => sub.name ?? sub)
      .join(", ")} */}
                      {/* {card.subcategoryName} */}
                    </h3>

                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <h4 className="mt-2 font-semibold text-lg truncate">
                        <span className="mt-2 font-semibold text-lg truncate text-purple-500">
                          {" "}
                          Provider Name:
                        </span>{" "}
                        {card.fullname}
                      </h4>
                    </div>

                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      {card.description && (
                        <p className="text-gray-600 text-sm mt-1">
                          {card.description}
                        </p>
                      )}

                      {/* ✅ Show features as plain string */}
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      {card.features && (
                        <div className="text-sm text-gray-500 mt-1">
                          {card.features}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-5">
                      <button
                        // onClick={() => handleBookNow(service)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition"
                      >
                        Book Now
                      </button>

                      <button
                        // onClick={() => handleAddToCart(service)}
                        className="text-blue-600 hover:text-blue-800 text-xl"
                        title="Add to Cart"
                      >
                        🛒
                      </button>
                    </div>
                  </div>
                ))}
              {subservices?.length === 0 && (
                <p className="text-center text-gray-500 mt-10">
                  No services found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default ProviderSubcategoryPage;

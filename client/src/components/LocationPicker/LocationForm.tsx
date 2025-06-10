// src/pages/LocationForm.tsx (or put inside App.tsx for test)
import { useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import LocationAutocomplete from "../../components/LocationPicker/LocationAutocomplete";


const LocationForm = () => {
  const [location, setLocation] = useState("");
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);

  const handleLocationSelect = (coords: { lat: number; lng: number; address: string }) => {
    setLocation(coords.address);
    setLatLng({ lat: coords.lat, lng: coords.lng });
  };
  const googlekey = import.meta.env.VITE_GOOGLEAPI_KEY;

  return (
    <LoadScript googleMapsApiKey={googlekey} libraries={["places"]}>
      <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
        <h2 className="text-xl mb-4">Choose Your Location</h2>
        <LocationAutocomplete onSelect={handleLocationSelect} />
        {location && (
          <div className="mt-4">
            <p><strong>Address:</strong> {location}</p>
            <p><strong>Latitude:</strong> {latLng?.lat}</p>
            <p><strong>Longitude:</strong> {latLng?.lng}</p>
          </div>
        )}
      </div>
    </LoadScript>
  );
};

export default LocationForm;

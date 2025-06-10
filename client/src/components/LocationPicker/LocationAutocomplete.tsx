import { useEffect, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

interface Props {
  onSelect: (coords: { lat: number; lng: number; address: string }) => void;
  locationAddress?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const libraries: ("places")[] = ["places"];
const googlekey = import.meta.env.VITE_GOOGLEAPI_KEY;

const LocationAutocomplete: React.FC<Props> = ({ onSelect, locationAddress, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googlekey,
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !inputRef.current || !window.google?.maps?.places) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address || "";
      onSelect({ lat, lng, address });
    });
  }, [isLoaded]);

  useEffect(() => {
    if (inputRef.current && locationAddress) {
      inputRef.current.value = locationAddress;
    }
  }, [locationAddress]);

  if (!isLoaded) return <input disabled placeholder="Loading maps..." className="bg-gray-200 p-2 rounded w-full" />;

  return (
    <input
      id="autocomplete"
      name="autocomplete"
      ref={inputRef}
      type="text"
      placeholder="Enter location"
       className="px-4 py-2 border border-gray-300 rounded-md w-full"
      onChange={onChange}
         value={locationAddress}

    />
  );
};

export default LocationAutocomplete;

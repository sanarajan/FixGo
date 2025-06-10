import { useEffect, useRef } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Libraries,
} from "@react-google-maps/api";
import { useState } from "react";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const center = {
  lat:  10.8505,
  lng: 76.2711,
};
interface LocationPickerProps {
  onLocationSelect: (coords: {
    lat: number;
    lng: number;
    address: string;
    
  }) => void;
  coordinates?: { lat: number; lng: number } | null;
  mapStyle?:{height:string,width:string}
}
const libraries: Libraries = ["places"];

function LocationPicker({
  onLocationSelect,
  coordinates,
  mapStyle
}: LocationPickerProps) {
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    center
  );
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (coordinates) {
      setMarker(coordinates); // 👈 Show marker from autocomplete
    }
  }, [coordinates]);
  const googlekey = import.meta.env.VITE_GOOGLEAPI_KEY;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googlekey,
    libraries,
  });
  useEffect(() => {
    if (coordinates) {
      setMarker(coordinates);
      if (mapRef.current) {
        mapRef.current.setCenter(coordinates);
        mapRef.current.setZoom(15); // Adjust zoom level as needed
      }
    }
  }, [coordinates]);
  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarker({ lat, lng });
      //  onLocationSelect({ lat, lng });
      const address = await fetchAddress();
      onLocationSelect({ lat, lng, address });
    }
  };
  //   const fetchAddress = async (lat: number, lng: number): Promise<string> => {
  //     const response = await fetch(
  //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googlekey}`
  //     );
  //     const data = await response.json();
  // console.log("Data JSON:", JSON.stringify(data, null, 2));
  //     if (data.results[0]) {
  //       return data.results[0].formatted_address;
  //     }
  //     return "";
  //   };

  const fetchAddress = async (): Promise<string> => {
    // 1. Get lat/lng from Geolocation API
    const geoResponse = await fetch(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=${googlekey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          considerIp: true,
        }),
      }
    );

    const geoData = await geoResponse.json();
    const { lat, lng } = geoData.location;

    // 2. Use lat/lng to get address from Geocoding API
    const geoCodeResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googlekey}`
    );

    const geocodeData = await geoCodeResponse.json();

    if (geocodeData.results && geocodeData.results[0]) {
      return geocodeData.results[0].formatted_address;
    }

    return "Address not found";
  };
  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={mapStyle?mapStyle:containerStyle}
      center={marker || center}
      zoom={10}
      onLoad={(map) => {
        mapRef.current = map;
      }}
      onClick={handleMapClick}
    >
      {marker && <Marker position={marker} />}
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
}
export default LocationPicker;

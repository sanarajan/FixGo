// hooks/useBrowserLocation.ts
import { useEffect, useState } from "react";

const useBrowserLocation = () => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCoordinates(coords);
      },
      (error) => {
        console.error("Geolocation error", error);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (coordinates) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coordinates.lat}&lon=${coordinates.lng}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?.display_name) {
            setAddress(data.display_name);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Reverse geocoding failed", err);
          setLoading(false);
        });
    }
  }, [coordinates]);

  return { defaultCords:coordinates, defaultAddress:address, loading };
};

export default useBrowserLocation;

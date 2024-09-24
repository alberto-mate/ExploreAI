import { useState, useEffect } from "react";

export default function useReverseGeocode(
  latitude: number | undefined,
  longitude: number | undefined,
) {
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    if (latitude && longitude) {
      const fetchLocationName = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
          );
          const data = await response.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "";
          const country = data.address.country || "";

          setLocationName(`${city}, ${country}`.trim());
        } catch (error) {
          console.error("Error fetching location name:", error);
          setLocationName("Location not found");
        }
      };

      fetchLocationName();
    }
  }, [latitude, longitude]);

  return locationName;
}

import * as Location from "expo-location";
import { useEffect } from "react";

import { useLocationStore } from "@/store/locationStore";
import { useLandmarkProximityStore } from "@/store/landmarkProximityStore";

export default function useLocation() {
  const { setUserLocation } = useLocationStore();
  const { updateProximity } = useLandmarkProximityStore();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      setUserLocation({
        latitude,
        longitude,
        address: `${address[0].city}, ${address[0].country}`,
      });

      updateProximity(latitude, longitude);
    })();
  }, []);
}

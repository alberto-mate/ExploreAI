import * as Location from "expo-location";
import { useEffect } from "react";

import { useLocationStore } from "@/store/locationStore";

export default function useLocation() {
  const { setUserLocation } = useLocationStore();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });

      setUserLocation({
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
        address: `${address[0].city}, ${address[0].country}`,
      });
    })();
  }, []);
}

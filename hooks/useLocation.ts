import { useEffect } from "react";
import * as Location from "expo-location"; // Assuming you're using Expo

import { useLocationStore } from "@/store/locationStore";
import { useLandmarkProximityStore } from "@/store/landmarkProximityStore";

export default function useLocation() {
  const { setUserLocation } = useLocationStore();
  const { updateProximity } = useLandmarkProximityStore();

  useEffect(() => {
    let watcher: Location.LocationSubscription | null = null;

    const startWatchingLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }

        watcher = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000, // Update every 1 seconds
            distanceInterval: 5, // Update every 10 meters
          },
          async (location) => {
            const { latitude, longitude } = location.coords;

            try {
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
            } catch (error) {
              console.error("Reverse geocoding failed", error);
            }
          },
        );
      } catch (error) {
        console.error("Location tracking failed", error);
      }
    };

    startWatchingLocation();

    return () => {
      if (watcher) {
        watcher.remove(); // Clean up the watcher when the component unmounts
      }
    };
  }, [setUserLocation, updateProximity]); // Ensure functions are stable and memoized
}

import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';

export default function useLocation(cooldownPeriod = 60000) { // 60000 ms = 1 minute
  const [location, setLocation] = useState<Location.LocationObject['coords'] | null>(null);
  const lastUpdateTime = useRef(0);

  useEffect(() => {
    let isMounted = true;

    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      const updateLocation = async () => {
        const currentTime = Date.now();
        if (currentTime - lastUpdateTime.current >= cooldownPeriod) {
          let newLocation = await Location.getCurrentPositionAsync({});
          if (isMounted) {
            setLocation(newLocation.coords);
            lastUpdateTime.current = currentTime;
          }
        }
      };

      // Initial location update
      updateLocation();

      // Set up a listener for location changes
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: cooldownPeriod,
          distanceInterval: 10, // Update if device moves by 10 meters
        },
        (newLocation) => {
          updateLocation();
        }
      );

      return () => {
        isMounted = false;
        if (locationSubscription) {
          locationSubscription.remove();
        }
      };
    };

    getLocation();
  }, [cooldownPeriod]);

  return location;
}
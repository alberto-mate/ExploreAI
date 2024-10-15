import { MapPin } from "lucide-react-native";
import React from "react";
import MapView, { Marker, Circle, PROVIDER_DEFAULT } from "react-native-maps";

import { useLocationStore } from "@/store/locationStore";
import { LandmarkProps } from "@/types";
import { radiusUnlocked } from "@/constants";

export default function Map({ landmarks }: { landmarks: LandmarkProps[] }) {
  const { userLatitude, userLongitude, userAddress } = useLocationStore();

  return (
    <>
      <MapView
        className="w-full h-full"
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsPointsOfInterest={false}
        provider={PROVIDER_DEFAULT}
        initialRegion={
          userLatitude && userLongitude
            ? {
                latitude: userLatitude,
                longitude: userLongitude,
                latitudeDelta: 0.1922,
                longitudeDelta: 0.0421,
              }
            : undefined
        }
      >
        {landmarks.map((landmark) => (
          <React.Fragment key={landmark.id}>
            <Marker
              coordinate={{
                latitude: landmark.latitude,
                longitude: landmark.longitude,
              }}
              title={landmark.name}
            >
              <MapPin color={landmark.isUnlocked ? "#22c55e" : "#6b7280"} />
            </Marker>
            <Circle
              center={{
                latitude: landmark.latitude,
                longitude: landmark.longitude,
              }}
              radius={radiusUnlocked}
              strokeColor="rgba(255, 255, 0, 0.5)" // Yellow with 50% opacity
              fillColor="rgba(255, 255, 0, 0.1)" // Yellow with 20% opacity
              strokeWidth={4}
            />
          </React.Fragment>
        ))}
      </MapView>
    </>
  );
}

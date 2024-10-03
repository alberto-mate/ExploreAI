import { MapPin } from "lucide-react-native";
import React from "react";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

import { useLocationStore } from "@/store/locationStore";
import { LandmarkProps } from "@/types";

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
          <Marker
            key={landmark.id}
            coordinate={{
              latitude: landmark.latitude,
              longitude: landmark.longitude,
            }}
            title={landmark.name}
          >
            <MapPin color={landmark.isUnlocked ? "#22c55e" : "#6b7280"} />
          </Marker>
        ))}
        {userLatitude && userLongitude && userAddress && (
          <Marker
            coordinate={{ latitude: userLatitude, longitude: userLongitude }}
            title={userAddress}
          >
            <MapPin color="#3b82f6" />
          </Marker>
        )}
      </MapView>
    </>
  );
}

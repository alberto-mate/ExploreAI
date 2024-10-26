import { MapPin } from "lucide-react-native";
import React from "react";
import MapView, { Marker, Circle, PROVIDER_DEFAULT } from "react-native-maps";

import { useLocationStore } from "@/store/locationStore";
import { LandmarkProps } from "@/types";
import { radiusUnlocked } from "@/constants";
import { useLandmarkProximityStore } from "@/store/landmarkProximityStore";

export default function Map({ landmarks }: { landmarks: LandmarkProps[] }) {
  const { userLatitude, userLongitude, userAddress } = useLocationStore();
  const { getUserIsInside } = useLandmarkProximityStore();

  return (
    <>
      <MapView
        className="w-full h-full"
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsPointsOfInterest={false}
        provider={PROVIDER_DEFAULT}
        mapType="mutedStandard"
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
              <MapPin
                color={
                  landmark.isUnlocked
                    ? "#22c55e"
                    : getUserIsInside(landmark.id)
                      ? "#7c3aed"
                      : "#9ca3af"
                }
                size={30}
              />
            </Marker>
            <Circle
              center={{
                latitude: landmark.latitude,
                longitude: landmark.longitude,
              }}
              radius={radiusUnlocked}
              strokeColor={
                getUserIsInside(landmark.id)
                  ? "rgba(124, 58, 237, 0.5)"
                  : "rgba(255, 255, 0, 0.5)"
              } // Purple with 50% opacity
              fillColor={
                getUserIsInside(landmark.id)
                  ? "rgba(124, 58, 237, 0.1)"
                  : "rgba(255, 255, 0, 0.1)"
              } // Purple with 10% opacity
              strokeWidth={4}
            />
          </React.Fragment>
        ))}
      </MapView>
    </>
  );
}

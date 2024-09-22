import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { landmarks } from '../constants/landmarks';
import useLocation from '../hooks/useLocation';
import { MapPin } from 'lucide-react-native';

export default function Map() {
  const userLocation = useLocation();

  return (
    <View className="h-[40vh]">
      <MapView
        className="w-full h-full"
        initialRegion={{
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        // customMapStyle={/* Add your custom map style here */}
      >
        {landmarks.map((landmark) => (
          <Marker
            key={landmark.id}
            coordinate={landmark.position}
            title={landmark.name}
          >
            <MapPin color={landmark.unlocked ? "#22c55e" : "#6b7280"} />
          </Marker>
        ))}
        {userLocation && (
          <Marker coordinate={userLocation}>
            <MapPin color="#ef4444" />
          </Marker>
        )}
      </MapView>
      <View className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-md">
        <Text className="text-white">
          <MapPin className="inline-block mr-2" />
          Current Location: Paris, France
        </Text>
      </View>
    </View>
  );
}
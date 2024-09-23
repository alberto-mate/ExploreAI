import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { landmarks } from '../constants/landmarks';
import useLocation from '../hooks/useLocation';
import useReverseGeocode from '../hooks/useReverseGeocode';
import { MapPin } from 'lucide-react-native';

export default function Map() {
  const userLocation = useLocation();
  const locationName = useReverseGeocode(userLocation?.latitude, userLocation?.longitude);

  return (
    <View className="h-[40vh]">
      <MapView
        className="w-full h-full"
        initialRegion={ userLocation ? {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        } : undefined }

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
      <View className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md p-2 rounded-md"> 
        <Text className='text-white align-center'>
          {userLocation?.latitude.toFixed(15)}, {userLocation?.longitude.toFixed(15)}
        </Text>
        <Text className="text-white align-center">
          <MapPin color="#fff" className="inline-block mr-1" size={12} />
          Current Location: {locationName || 'Loading...'}
        </Text>
      </View>
    </View>
  );
}
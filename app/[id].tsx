import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { landmarks } from '../constants/landmarks';
import { Book, Lightbulb, History } from 'lucide-react-native';
import { calculateDistance } from '../utils/mapUtils';
import useLocation from '../hooks/useLocation';

export default function LandmarkDetailScreen() {
  const { id } = useLocalSearchParams();
  const [activeInfo, setActiveInfo] = useState<string | null>(null);
  const userLocation = useLocation();

  const landmark = landmarks.find((l) => l.id.toString() === id);

  if (!landmark) return null;

  const distance = userLocation
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        landmark.position.latitude,
        landmark.position.longitude
      )
    : 'Unknown';

  const getInfoText = (infoType: string) => {
    // Replace with actual content
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <Stack.Screen options={{ title: landmark.name, headerShown: true }} />
      <Image source={{ uri: landmark.image }} className="w-full h-40 object-cover" />
      <View className="p-6">
        <Text className="text-2xl font-bold text-white mb-2">{landmark.name}</Text>
        <Text className="text-gray-300 mb-2">Address: {landmark.address}</Text>
        <Text className="text-gray-300 mb-4">Distance: {distance} km from your location</Text>

        <View className="flex-row space-x-2 mb-4">
          {['History', 'Fun Facts', 'Cultural Insights'].map((info) => (
            <Pressable
              key={info}
              className={`bg-blue-600 p-2 rounded-md ${
                activeInfo === info ? 'bg-blue-700' : ''
              }`}
              onPress={() => setActiveInfo(activeInfo === info ? null : info)}
            >
              <Text className="text-white capitalize">{info}</Text>
            </Pressable>
          ))}
        </View>

        {activeInfo && (
          <View className="bg-gray-800 p-4 rounded-md mb-4">
            <Text className="text-white mb-2">{getInfoText(activeInfo)}</Text>
            <Pressable className="bg-blue-500 p-2 rounded-md flex-row items-center">
              <Text className="text-white">Listen</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
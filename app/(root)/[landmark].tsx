import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";

import { useLocationStore } from "@/store/locationStore";
import { LandmarkProps } from "@/types";
import { fetchAPI } from "@/utils/fetch";
import { calculateDistance } from "@/utils/mapUtils";

export default function LandmarkScreen() {
  const { landmark: landmarkId } = useLocalSearchParams();
  const [activeInfo, setActiveInfo] = useState<string | null>(null);
  const { userLatitude, userLongitude } = useLocationStore();
  const router = useRouter();
  const { user } = useUser();
  const clerkId = user?.id;

  const {
    data: landmark,
    isLoading,
    error,
  } = useQuery<LandmarkProps>(
    ["landmarks", landmarkId, clerkId],
    () =>
      fetchAPI(
        `/(api)/landmark?landmarkId=${landmarkId}&clerkId=${clerkId}`,
      ).then((response) => response.data),
    {
      enabled: !!clerkId,
    },
  );

  const LoadingContent = () => (
    <View className="flex-1 justify-center items-center bg-gray-900">
      <ActivityIndicator size="large" color="white" />
    </View>
  );

  const ErrorContent = () => (
    <View className="flex-1 justify-center items-center bg-gray-900">
      <Text className="text-white">Error fetching landmark</Text>
    </View>
  );

  const distance =
    userLatitude && userLongitude && landmark
      ? calculateDistance(
          userLatitude,
          userLongitude,
          landmark.latitude,
          landmark.longitude,
        )
      : "Unknown";

  const getInfoText = (infoType: string) => {
    switch (infoType) {
      case "History":
        return "This landmark has a rich history that dates back to the 19th century.";
      case "Fun Facts":
        return "The landmark is known for its unique architecture and design.";
      case "Cultural Insights":
        return "The landmark is a symbol of French culture and heritage.";
      default:
        return "";
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: landmark?.name || "Loading...",
          headerShown: true,
          headerStyle: { backgroundColor: "#1F2937" },
          headerTintColor: "#fff",
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <ArrowLeft color="#fff" size={24} />
            </Pressable>
          ),
        }}
      />

      {isLoading ? (
        <LoadingContent />
      ) : error || !landmark ? (
        <ErrorContent />
      ) : (
        <ScrollView className="flex-1 bg-gray-900">
          <Image
            source={{ uri: landmark.image }}
            className="w-full h-40 object-cover"
          />
          <View className="p-6">
            <Text className="text-2xl font-bold text-white mb-2">
              {landmark.name}
            </Text>
            <Text className="text-gray-300 mb-2">
              Address: {landmark.address}
            </Text>
            <Text className="text-gray-300 mb-4">
              Distance: {distance} km from your location
            </Text>

            <View className="flex-row space-x-2 mb-4">
              {["History", "Fun Facts", "Cultural Insights"].map((info) => (
                <Pressable
                  key={info}
                  className={`bg-blue-500 p-2 rounded-md ${
                    activeInfo === info ? "bg-blue-700" : ""
                  }`}
                  onPress={() =>
                    setActiveInfo(activeInfo === info ? null : info)
                  }
                >
                  <Text className="text-white capitalize">{info}</Text>
                </Pressable>
              ))}
            </View>

            {activeInfo && (
              <View className="bg-gray-800 p-4 rounded-md mb-4">
                <Text className="text-white mb-2">
                  {getInfoText(activeInfo)}
                </Text>
                <Pressable className="bg-blue-500 p-2 rounded-md flex-row items-center">
                  <Text className="text-white">Listen</Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </>
  );
}

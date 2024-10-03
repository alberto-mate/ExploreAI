import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import React from "react";
import {
  View,
  Image,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { CityProps, LandmarkProps } from "@/types";
import { fetchAPI } from "@/utils/fetch";

export default function CollectionGrid({ city }: { city: CityProps }) {
  const { user } = useUser();

  const clerkId = user?.id; // Get the clerkId (user ID)

  // Query the API to get the landmarks for the city and the current user
  const {
    data: landmarksCity,
    isLoading,
    error,
  } = useQuery<LandmarkProps[]>(
    ["landmarks", city.id, clerkId],
    () =>
      fetchAPI(
        `/(api)/landmarksCity?cityId=${city.id}&clerkId=${clerkId}`,
      ).then((response) => response.data),
    {
      enabled: !!clerkId, // Only run the query if clerkId is available
    },
  );

  if (error || !landmarksCity) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error loading landmarks</Text>
      </View>
    );
  }

  const unlockedLandmarksCity = landmarksCity.filter((l) => l.isUnlocked);
  const lockedLandmarksCity = landmarksCity.filter((l) => !l.isUnlocked);

  const renderItem = ({ item: landmark }: { item: LandmarkProps }) => (
    <View style={{ width: "48%" }}>
      <Link href={`/${landmark.id}`} asChild>
        <Pressable className="bg-white/10 rounded-lg p-2 backdrop-blur-md">
          <Image
            source={{ uri: landmark.image }}
            className="w-full h-24 rounded-md mb-2"
            resizeMode="cover"
          />
          <Text className="text-sm font-medium text-white text-center">
            {landmark.name}
          </Text>
        </Pressable>
      </Link>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <ScrollView className="h-full">
      <View className="mb-4">
        <Text className="text-xl font-semibold mb-4 text-gray-300">
          Unlocked Landmarks
        </Text>
        <FlatList
          data={unlockedLandmarksCity}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          ItemSeparatorComponent={() => <View className="h-4" />}
          scrollEnabled={false}
        />
      </View>
      <View>
        <Text className="text-xl font-semibold mb-4 text-gray-300">
          Locked Landmarks
        </Text>
        <FlatList
          data={lockedLandmarksCity}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          ItemSeparatorComponent={() => <View className="h-4" />}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}

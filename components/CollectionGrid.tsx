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
import { LinearGradient } from "expo-linear-gradient";
import { MapPin } from "lucide-react-native";

export default function CollectionGrid({ city }: { city: CityProps }) {
  const { user } = useUser();

  const clerkId = user?.id; // Get the clerkId (user ID)

  // Query the API to get the landmarks for the city and the current user
  const {
    data: landmarksCity,
    isLoading,
    error,
  } = useQuery<LandmarkProps[]>(
    ["landmarksCity", city.id, clerkId],
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
    <View className="w-[150px] mr-1">
      <Link href={`/${landmark.id}`} asChild>
        <Pressable className="rounded-2xl overflow-hidden shadow-lg active:opacity-80">
          <View className="relative h-48">
            <Image
              source={{ uri: landmark.image }}
              className="w-full h-[67%]"
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(3, 3, 31,1)", "rgba(0,0,20,1)"]}
              locations={[0.3, 0.65, 1]}
              className="absolute w-full h-[100%] bottom-0 overflow-hidden rounded-b-md"
            />
            <View className="absolute bottom-0 left-0 right-0 p-3">
              <Text className="text-white text-base font-bold mb-1 ">
                {landmark.name}
              </Text>
              <View className="flex-row items-center">
                <MapPin size={10} color="white" />
                <Text className="text-white text-xs ml-1">
                  {landmark.address.split(",")[0]}
                </Text>
              </View>
            </View>
          </View>
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
    <ScrollView className="h-full mb-32">
      <View className="mb-4">
        <Text className="text-xl font-semibold mb-4 text-gray-300">
          Unlocked Landmarks
        </Text>
        <FlatList
          data={unlockedLandmarksCity}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal={true} // Enable horizontal scrolling
          showsHorizontalScrollIndicator={false} // Optional: Hide the scroll indicator
        />
      </View>
      <View></View>
      <Text className="text-xl font-semibold mb-4 text-gray-300">
        Locked Landmarks
      </Text>
      <FlatList
        data={lockedLandmarksCity}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true} // Enable horizontal scrolling
        showsHorizontalScrollIndicator={false} // Optional: Hide the scroll indicator
      />
    </ScrollView>
  );
}

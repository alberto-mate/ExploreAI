import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";

import CollectionGrid from "@/components/CollectionGrid";
import ProgressBar from "@/components/ProgressBar";
import { CityProgress, CityProps } from "@/types";
import { fetchAPI } from "@/utils/fetch";

export default function CollectionScreen() {
  const { collection: cityId } = useLocalSearchParams();
  const { user } = useUser();
  const clerkId = user?.id; // Get the clerkId (user ID)
  const router = useRouter();

  const {
    data: cities,
    isLoading,
    error,
  } = useQuery<CityProps[]>(["cities"], () =>
    fetchAPI("/(api)/cities")
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching cities:", error);
        return { data: [] };
      }),
  );

  const { data: cityProgress, isLoading: isLoadingProgress } = useQuery<
    CityProgress[]
  >(
    ["cityProgress", clerkId],
    () =>
      fetchAPI(`/(api)/cityProgress?&clerkId=${clerkId}`).then(
        (response) => response.data,
      ),
    {
      enabled: !!clerkId,
      staleTime: 60000,
    },
  );

  const StackCollectionScreen = ({ title }: { title?: string }) => {
    return (
      <Stack.Screen
        options={{
          title: title || "Collection",
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
    );
  };

  if (isLoading || isLoadingProgress)
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <StackCollectionScreen title="Loading..." />
        <ActivityIndicator size="small" color="#fff" />
      </View>
    );

  if (error || !cities) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <StackCollectionScreen title="Error" />
        <Text className="text-red-500">Error: {String(error)}</Text>
      </View>
    );
  }

  const city = cities.find((c) => c.id.toString() === cityId);

  if (!city) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <Text className="text-white">City not found</Text>
      </View>
    );
  }

  const currentCityProgress = cityProgress?.[city.id];

  return (
    <View className="flex-1 bg-gray-900">
      <StackCollectionScreen title={city.name} />

      <View className="p-6">
        <Text className="text-xl font-semibold mb-4 text-gray-300">
          Your Collection
        </Text>
        {currentCityProgress && (
          <>
            <ProgressBar progress={currentCityProgress.progress} />
            <Text className="text-center text-lg font-medium mb-6 text-white">
              {`${currentCityProgress.progress.toFixed(0)}% Completed of a total ${currentCityProgress.totalLandmarks} Landmarks`}
            </Text>
          </>
        )}

        <CollectionGrid city={city} />
      </View>
    </View>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";

import CollectionGrid from "@/components/CollectionGrid";
import ProgressBar from "@/components/ProgressBar";
import { CityProps } from "@/types";
import { fetchAPI } from "@/utils/fetch";

export default function CollectionScreen() {
  const { collection: cityId } = useLocalSearchParams();
  const router = useRouter();

  const {
    data: cities,
    isLoading,
    error,
  } = useQuery<CityProps[]>(["cities"], () =>
    fetchAPI("/(api)/cities").then((response) => response.data),
  );

  if (isLoading)
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="small" color="#fff" />
      </View>
    );

  if (error || !cities) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <Text className="text-red-500">Error: {String(error)}</Text>
      </View>
    );
  }

  const city = cities.find((c) => c.id.toString() === cityId);

  return (
    <View className="flex-1 bg-gray-900">
      <Stack.Screen
        options={{
          title: city?.name || "Collection",
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
      <View className="p-6">
        <Text className="text-xl font-semibold mb-4 text-gray-300">
          Your Collection
        </Text>
        <ProgressBar progress={33} />
        <Text className="text-center text-lg font-medium mb-6 text-white">
          33% Complete - {city?.name || "Collection"} Collection
        </Text>
        <CollectionGrid />
      </View>
    </View>
  );
}

import React from "react";
import { View, Text, Pressable } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import ProgressBar from "@/components/ProgressBar";
import CollectionGrid from "@/components/CollectionGrid";
import { cities } from "@/constants/cities";
import { ArrowLeft } from "lucide-react-native";

export default function CollectionScreen() {
  const { collection: cityId } = useLocalSearchParams();
  const router = useRouter();

  const city = cities.find((c) => c.id.toString() === cityId);

  if (!city) return null;

  return (
    <View className="flex-1 bg-gray-900">
      <Stack.Screen
        options={{
          title: city.name,
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
          33% Complete - {city.name} Collection
        </Text>
        <CollectionGrid />
      </View>
    </View>
  );
}

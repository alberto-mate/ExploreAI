import { useRouter } from "expo-router";
import { Award, Lock } from "lucide-react-native";
import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";

import { LandmarkProps } from "../types";
import { useLandmarkProximityStore } from "@/store/landmarkProximityStore";

export default function LandmarkList({
  landmarks,
}: {
  landmarks: LandmarkProps[];
}) {
  const router = useRouter();

  const { getUserIsInside } = useLandmarkProximityStore();

  const renderItem = ({ item: landmark }: { item: LandmarkProps }) => {
    const isUserInside = getUserIsInside(landmark.id);

    const backgroundColor = isUserInside
      ? "bg-purple-500/20"
      : landmark.isUnlocked
        ? "bg-green-500/20"
        : "bg-gray-500/20";

    return (
      <Pressable
        className={`p-4 rounded-md ${backgroundColor}`}
        onPress={() => router.push(`/${landmark.id}`)}
      >
        <View className="flex-row justify-between items-center">
          <Text className="font-medium text-white">{landmark.name}</Text>
          {landmark.isUnlocked ? (
            <Award color="#22c55e" size={20} />
          ) : (
            <Lock color="#9ca3af" size={20} />
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View className="p-6 flex-1">
      <View className="w-full h-24 bg-gray-800 rounded-md mb-6"></View>

      <Text className="text-xl font-semibold mb-4 text-gray-300">
        Nearby Landmarks
      </Text>
      {landmarks.length === 0 ? (
        <Text className="text-gray-500 text-lg">No landmarks found</Text>
      ) : (
        <FlatList
          data={landmarks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View className="h-3" />}
        />
      )}
    </View>
  );
}

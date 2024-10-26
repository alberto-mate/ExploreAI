import { useRouter } from "expo-router";
import { Award, Lock, MapPin } from "lucide-react-native";
import React from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ScrollView,
  Image,
} from "react-native";

import { LandmarkProps } from "../types";
import { useLandmarkProximityStore } from "@/store/landmarkProximityStore";
import { LinearGradient } from "expo-linear-gradient";

export default function LandmarkList({
  landmarks,
}: {
  landmarks: LandmarkProps[];
}) {
  const router = useRouter();

  const { getUserIsInside, getListLandmarksInsideLocked } =
    useLandmarkProximityStore();

  const landmarksInsideLocked = getListLandmarksInsideLocked();

  const renderItem = ({ item: landmark }: { item: LandmarkProps }) => {
    const isUserInside = getUserIsInside(landmark.id);

    const backgroundColor = isUserInside
      ? "bg-violet-600/20"
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

  const renderInsideLocked = ({ item: landmark }: { item: LandmarkProps }) => {
    return (
      <Pressable
        className="rounded-md overflow-hidden shadow-lg active:opacity-80"
        onPress={() => router.push(`/${landmark.id}`)}
      >
        <View className="relative h-36">
          <Image
            source={{ uri: landmark.image }}
            className="w-full h-[100%]"
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "#7c3aed"]}
            locations={[0, 0.8]}
            className="absolute w-full h-[100%] bottom-0 overflow-hidden rounded-b-md"
          />
          <View className="absolute bottom-0 left-0 right-0 p-3">
            <Text className="text-white text-base mb-1 ">
              Unlock it now! 🎉
            </Text>

            <Text className="text-white text-xl font-bold mb-1 ">
              {landmark.name}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <ScrollView className="p-6 flex-1">
      {landmarksInsideLocked.length > 0 && (
        <View className="mb-4">
          <Text className="text-xl font-semibold mb-4 text-gray-300">
            Landmarks Inside Locked
          </Text>
          <FlatList
            data={landmarksInsideLocked}
            renderItem={renderInsideLocked}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <View className="h-3" />}
            scrollEnabled={false}
          />
        </View>
      )}

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
          scrollEnabled={false}
        />
      )}
      <View className="h-20" />
    </ScrollView>
  );
}

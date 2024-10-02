import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";

import { CityProps } from "../types";

export default function CityCard({
  city,
  isCurrentCity,
}: {
  city: CityProps | undefined;
  isCurrentCity?: boolean;
}) {
  if (!city) return null;

  return (
    <Link asChild href={`/cities/${city.id}`}>
      <Pressable
        className={`bg-gray-900 rounded-md ${isCurrentCity ? "h-56" : "h-24"}`}
      >
        <ImageBackground
          source={{ uri: city.image }}
          className="w-full h-full justify-end"
          resizeMode="cover"
          imageStyle={{ borderRadius: 6 }}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            className="absolute w-full h-[50%] bottom-0 overflow-hidden rounded-b-md"
          />
          <View className="p-4">
            {isCurrentCity && (
              <Text className="text-white text-md">Current city</Text>
            )}
            <Text className="text-white text-2xl font-bold leading-7">
              {city.name}
            </Text>
          </View>
        </ImageBackground>
      </Pressable>
    </Link>
  );
}

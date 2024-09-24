import React from "react";
import { View, Text } from "react-native";
import { Stack } from "expo-router";
import ProgressBar from "../../components/ProgressBar";
import CollectionGrid from "../../components/CollectionGrid";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CollectionScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <Stack.Screen options={{ title: "Collection", headerShown: false }} />
      <View className="p-6">
        <Text className="text-xl font-semibold mb-4 text-gray-300">
          Your Collection
        </Text>
        <ProgressBar progress={33} />
        <Text className="text-center text-lg font-medium mb-6 text-white">
          33% of Paris landmarks discovered
        </Text>
        <CollectionGrid />
      </View>
    </SafeAreaView>
  );
}

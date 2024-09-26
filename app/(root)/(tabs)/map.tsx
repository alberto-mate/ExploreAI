import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Map from "../../../components/Map";
import LandmarkList from "../../../components/LandmarkList";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <Map />
      <LandmarkList />
    </SafeAreaView>
  );
}

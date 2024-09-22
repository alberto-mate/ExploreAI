import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Map from '../../components/Map';
import LandmarkList from '../../components/LandmarkList';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <Stack.Screen options={{ title: 'ExploreAI', headerShown: false }} />
      <Map />
      <LandmarkList />
    </SafeAreaView>
  );
}
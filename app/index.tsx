import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import Map from '../components/Map';
import LandmarkList from '../components/LandmarkList';
import NavigationTabs from '../components/NavigationTabs';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-gray-900">
      <Stack.Screen options={{ title: 'ExploreAI', headerShown: false }} />
      <Map />
      <LandmarkList />
      <NavigationTabs />
    </View>
  );
}
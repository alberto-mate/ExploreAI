import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { landmarks } from '../constants/landmarks';
import { Award, Lock } from 'lucide-react-native';
import { Landmark } from '../types';

export default function LandmarkList() {
  const router = useRouter();

  const renderItem = ({ item: landmark }: { item: Landmark }) => (
    <Pressable
      className={`p-4 rounded-md ${
        landmark.unlocked ? 'bg-green-500/20' : 'bg-gray-500/20'
      }`}
      onPress={() => router.push(`/${landmark.id}`)}
    >
      <View className="flex-row justify-between items-center">
        <Text className="font-medium text-white">{landmark.name}</Text>
        {landmark.unlocked ? (
          <Award color="#22c55e" size={20} />
        ) : (
          <Lock color="#9ca3af" size={20} />
        )}
      </View>
    </Pressable>
  );

  return (
    <View className="p-6">
      <Text className="text-xl font-semibold mb-4 text-gray-300">
        Nearby Landmarks
      </Text>
      <FlatList
        data={landmarks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View className="h-3" />}
      />
    </View>
  );
}
import React from 'react';
import { View, Image, Text, FlatList } from 'react-native';
import { landmarks } from '../constants/landmarks';

export default function CollectionGrid() {
  const unlockedLandmarks = landmarks.filter((l) => l.unlocked);

  const renderItem = ({ item: landmark }) => (
    <View className="bg-white/10 rounded-lg p-2 backdrop-blur-md">
      <Image
        source={{ uri: landmark.image }}
        className="w-full h-24 rounded-md mb-2"
        resizeMode="cover"
      />
      <Text className="text-sm font-medium text-white text-center">
        {landmark.name}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={unlockedLandmarks}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      ItemSeparatorComponent={() => <View className="h-4" />}
    />
  );
}
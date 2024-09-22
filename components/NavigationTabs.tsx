import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Map, Album } from 'lucide-react-native';

export default function NavigationTabs() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View className="flex-row justify-center space-x-4 p-4 bg-gray-800">
      <Pressable
        className={`flex-1 py-2 ${
          pathname === '/' ? 'bg-blue-500' : 'bg-gray-700'
        } rounded-md`}
        onPress={() => router.push('/')}
      >
        <View className="flex-row justify-center items-center">
          <Map className="mr-2" color="white" size={20} />
          <Text className="text-white font-semibold">Map</Text>
        </View>
      </Pressable>
      <Pressable
        className={`flex-1 py-2 ${
          pathname === '/collection' ? 'bg-blue-500' : 'bg-gray-700'
        } rounded-md`}
        onPress={() => router.push('/collection')}
      >
        <View className="flex-row justify-center items-center">
          <Album className="mr-2" color="white" size={20} />
          <Text className="text-white font-semibold">Collection</Text>
        </View>
      </Pressable>
    </View>
  );
}
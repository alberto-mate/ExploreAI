import { Link } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cities } from "../../../../constants/cities";

export default function CitiesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="p-6">
        <Text className="text-xl font-semibold mb-4 text-white">
          Cities Screen
        </Text>
        <FlatList
          data={cities}
          renderItem={({ item }) => (
            <Link asChild href={`/cities/${item.id}`}>
              <Pressable className="p-4 rounded-md bg-gray-500/20">
                <Text className="text-white">{item.name}</Text>
              </Pressable>
            </Link>
          )}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View className="h-2" />}
        />
      </View>
    </SafeAreaView>
  );
}

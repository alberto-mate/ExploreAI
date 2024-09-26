import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="p-6">
        <Text className="text-xl font-semibold mb-4 text-white">
          Profile Screen
        </Text>
      </View>
    </SafeAreaView>
  );
}

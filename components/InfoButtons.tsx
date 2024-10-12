import { History, Lightbulb, Globe2, Volume2 } from "lucide-react-native";
import React, { useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useOpenAI } from "@/hooks/useOpenAI"; // Import the new hook

const InfoButtons = ({ name }: { name: string }) => {
  const [activeInfo, setActiveInfo] = useState<string | null>(null);
  const { text, isLoading, startStreaming } = useOpenAI(); // Use the custom hook

  const infoTypes = [
    { title: "History", icon: History, promptKey: "landmark-history" },
    { title: "Fun Facts", icon: Lightbulb, promptKey: "landmark-funfacts" },
    {
      title: "Cultural Insights",
      icon: Globe2,
      promptKey: "landmark-cultural",
    },
  ];

  const handlePress = (infoTitle: string) => {
    if (activeInfo === infoTitle) {
      setActiveInfo(null); // Collapse if pressing the same button
    } else {
      setActiveInfo(infoTitle); // Set the active info type to fetch
      const activePromptKey =
        infoTypes.find((info) => info.title === infoTitle)?.promptKey || "";
      startStreaming(activePromptKey, name); // Start streaming the content
    }
  };

  // Animated styles for the content
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: activeInfo
      ? withTiming(1, { duration: 500 })
      : withTiming(0, { duration: 500 }),
    transform: [{ translateY: activeInfo ? withSpring(0) : withSpring(10) }],
  }));

  return (
    <View className="space-y-4 mb-8">
      <View className="flex-row justify-between gap-x-2">
        {infoTypes.map((info) => {
          const Icon = info.icon;
          const isActive = activeInfo === info.title;

          return (
            <Pressable
              key={info.title}
              onPress={() => handlePress(info.title)}
              className={`flex-1 py-3 px-2 rounded-xl items-center justify-center ${
                isActive
                  ? "bg-blue-600 shadow-lg shadow-blue-600/50"
                  : "bg-gray-800"
              }`}
            >
              <Icon
                size={20}
                color={isActive ? "#ffffff" : "#9CA3AF"}
                className="mb-1"
              />
              <Text
                className={`text-xs font-medium ${isActive ? "text-white" : "text-gray-400"}`}
              >
                {info.title}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {activeInfo && (
        <Animated.View
          style={[animatedStyle]}
          className="bg-gray-800 p-4 rounded-xl"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" className="mb-4" />
          ) : (
            <Text className="text-white text-base mb-4 leading-6">{text}</Text>
          )}

          <Pressable className="flex-row items-center justify-center bg-blue-600 py-3 rounded-lg">
            <Volume2 size={20} color="#ffffff" className="mr-2" />
            <Text className="text-white font-medium">Listen</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
};

export default InfoButtons;

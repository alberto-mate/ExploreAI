import { History, Lightbulb, Globe2, Volume2 } from "lucide-react-native";
import OpenAI from "openai";
import React, { useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY!,
});

const InfoButtons = ({ name }: { name: string }) => {
  const [activeInfo, setActiveInfo] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const infoTypes = [
    {
      title: "History",
      icon: History,
      prompt: `Provide a detailed historical description of the landmark named ${name}.`,
    },
    {
      title: "Fun Facts",
      icon: Lightbulb,
      prompt: `Share some fun facts about the landmark named ${name}.`,
    },
    {
      title: "Cultural Insights",
      icon: Globe2,
      prompt: `Give some cultural insights on the landmark named ${name}.`,
    },
  ];

  // Fetch content from OpenAI API
  const fetchContent = async (infoTitle: string) => {
    const info = infoTypes.find((info) => info.title === infoTitle);
    if (!info) return;

    setLoading(true);
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: info.prompt },
        ],
      });
      setContent(completion.choices[0].message.content);
    } catch (error) {
      setContent("Sorry, there was an issue fetching the information.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Animated styles for the content
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: activeInfo
      ? withTiming(1, { duration: 500 })
      : withTiming(0, { duration: 500 }),
    transform: [{ translateY: activeInfo ? withSpring(0) : withSpring(10) }],
  }));

  const handlePress = (infoTitle: string) => {
    if (activeInfo === infoTitle) {
      setActiveInfo(null);
    } else {
      setActiveInfo(infoTitle);
      fetchContent(infoTitle); // Fetch content when a button is pressed
    }
  };

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
                className={`text-xs font-medium ${
                  isActive ? "text-white" : "text-gray-400"
                }`}
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
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" className="mb-4" />
          ) : (
            <Text className="text-white text-base mb-4 leading-6">
              {content}
            </Text>
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

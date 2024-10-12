import { useState } from "react";
import OpenAI from "openai-react-native";
import { getBodyOpenAI } from "@/utils/prompt";

const clientOpenAI = new OpenAI({
  baseURL: "https://api.openai.com/v1",
  apiKey: process.env.EXPO_PUBLIC_OPENAI_KEY || "",
});

export const useOpenAI = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const startStreaming = async (promptKey: string, name: string) => {
    setIsLoading(true);
    setText("");

    const bodyOpenAI = await getBodyOpenAI(promptKey, name);
    if (!clientOpenAI) {
      setIsLoading(false);
      return;
    }

    clientOpenAI.chat.completions.stream(
      bodyOpenAI,
      (data) => {
        const content = data.choices[0].delta.content;
        if (content) {
          setText((prevText) => prevText + content);
        }
      },
      {
        onOpen: () => {
          setIsLoading(false);
        },
      },
    );
  };

  return { text, isLoading, startStreaming };
};

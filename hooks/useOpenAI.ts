import { useState, useCallback, useEffect } from "react";
import OpenAI from "openai-react-native";
import { getBodyOpenAI } from "@/utils/prompt";

const clientOpenAI = new OpenAI({
  baseURL: "https://api.openai.com/v1",
  apiKey: process.env.EXPO_PUBLIC_OPENAI_KEY || "",
});

// Type definitions
interface CacheEntry {
  text: string;
  timestamp: number;
}

interface Cache {
  [key: string]: CacheEntry;
}

export const useOpenAI = (cacheDuration = 3600000) => {
  // Default cache duration: 1 hour
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cache, setCache] = useState<Cache>({});

  // Generate a cache key from prompt parameters
  const getCacheKey = (promptKey: string, name: string) => {
    return `${promptKey}-${name}`;
  };

  // Check if cache entry is valid
  const isValidCache = (entry: CacheEntry) => {
    return Date.now() - entry.timestamp < cacheDuration;
  };

  // Clear expired cache entries
  const clearExpiredCache = useCallback(() => {
    const newCache: Cache = {};
    Object.entries(cache).forEach(([key, entry]) => {
      if (isValidCache(entry)) {
        newCache[key] = entry;
      }
    });
    setCache(newCache);
  }, [cache, cacheDuration]);

  const startStreaming = async (promptKey: string, name: string) => {
    setIsLoading(true);
    const cacheKey = getCacheKey(promptKey, name);

    // Check cache first
    const cachedEntry = cache[cacheKey];
    if (cachedEntry && isValidCache(cachedEntry)) {
      setText(cachedEntry.text);
      setIsLoading(false);
      return;
    }

    setText("");

    const bodyOpenAI = await getBodyOpenAI(promptKey, name);
    if (!clientOpenAI) {
      setIsLoading(false);
      return;
    }

    let fullResponse = "";

    clientOpenAI.chat.completions.stream(
      bodyOpenAI,
      (data) => {
        const content = data.choices[0].delta.content;
        if (content) {
          fullResponse += content;
          setText(fullResponse);
        }
      },
      {
        onOpen: () => {
          setIsLoading(false);
        },
        onDone: () => {
          // Save to cache
          setCache((prevCache) => ({
            ...prevCache,
            [cacheKey]: {
              text: fullResponse,
              timestamp: Date.now(),
            },
          }));
        },
      },
    );
  };

  // Optional method to manually clear cache
  const clearCache = () => {
    setCache({});
  };

  // Clear expired cache entries periodically
  useEffect(() => {
    const interval = setInterval(clearExpiredCache, 300000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [clearExpiredCache]);

  return {
    text,
    isLoading,
    startStreaming,
    clearCache,
    cacheSize: Object.keys(cache).length,
  };
};

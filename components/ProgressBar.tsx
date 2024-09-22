import React from 'react';
import { View } from 'react-native';

type ProgressBarProps = {
  progress: number;
};

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <View className="h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
      <View
        className="h-full bg-blue-500"
        style={{ width: `${progress}%` }}
      />
    </View>
  );
}
import { Tabs } from "expo-router";
import { View } from "react-native";
import { Map, Album, PersonStanding, LucideProps } from "lucide-react-native";

const TabIcon = ({
  IconComponent,
  focused,
}: {
  IconComponent: React.FC<LucideProps>; // Update to accept LucideProps
  focused: boolean;
}) => (
  <View
    className={`rounded-full w-12 h-12 items-center justify-center ${
      focused ? "bg-gray-500" : ""
    }`}
  >
    <IconComponent color="white" size={22} />
    {/* color="white" is valid for LucideProps */}
  </View>
);

export default function TabsLayout() {
  return (
    <Tabs
      //initialRouteName="map"
      screenOptions={{
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#1F2937",
          shadowOffset: {
            width: 0,
            height: 15,
          },
          shadowOpacity: 0.8,
          shadowRadius: 30.0,
          elevation: 24,
          borderTopLeftRadius: 21,
          borderTopRightRadius: 21,
          position: "absolute",
          bottom: 0,
          padding: 10,
          width: "100%",
          height: 84,
          zIndex: 0,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={Map} focused={focused} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="cities"
        options={{
          title: "Cities",
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={Album} focused={focused} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon IconComponent={PersonStanding} focused={focused} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

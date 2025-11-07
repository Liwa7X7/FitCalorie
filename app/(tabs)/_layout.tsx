import { Tabs } from "expo-router";
import { Camera, History, User, Sparkles } from "lucide-react-native";
import React from "react";

import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.light.card,
          borderTopWidth: 1,
          borderTopColor: Colors.light.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600' as const,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => <Camera size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => <History size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="suggestions"
        options={{
          title: "Suggestions",
          tabBarIcon: ({ color }) => <Sparkles size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile", // This title is for the tab bar, not the header.
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
          headerShown: false, // Ensure no default header is shown by the tab navigator for this screen
        }}
      />
    </Tabs>
  );
}

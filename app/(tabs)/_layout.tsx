import { Apple, BookOpen, Cookie } from "@tamagui/lucide-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";

import Colors from "../../constants/Colors";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Food Tracking",
          tabBarIcon: ({ color }) => <Cookie color={color} />,
        }}
      />
      <Tabs.Screen
        name="foodCategories"
        options={{
          title: "Food Categories",
          tabBarIcon: ({ color }) => <Apple color={color} />,
        }}
      />
      <Tabs.Screen
        name="mealPlans"
        options={{
          title: "Meal Plans",
          tabBarIcon: ({ color }) => <BookOpen color={color} />,
        }}
      />
    </Tabs>
  );
}

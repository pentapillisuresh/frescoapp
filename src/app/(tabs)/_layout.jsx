import { Tabs } from "expo-router";
import { Home, ShoppingCart, ClipboardList, User } from "lucide-react-native";
import { useDarkMode } from "@/utils/useDarkMode";
import { useStore } from "@/store/useStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";

export default function TabLayout() {
  const { colors } = useDarkMode();
  const { userRole } = useStore();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // ✅ Active / Inactive Colors
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,

        // ✅ Tab Bar Container Style
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
        },

        // ✅ IMPORTANT: Do NOT enable scroll
        tabBarScrollEnabled: false,

        // ✅ Equal width for all tabs (prevents ...)
        tabBarItemStyle: {
          flex: 1,
        },

        // ✅ Label Style
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Inter_500Medium",
          textAlign: "center",
        },

        // ✅ Icon Spacing
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Home color={color} size={22} />
          ),
        }}
      />

      {/* Cart */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <ShoppingCart color={color} size={22} />
          ),
        }}
      />

      {/* Orders */}
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => (
            <ClipboardList color={color} size={22} />
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <User color={color} size={22} />
          ),
        }}
      />
    </Tabs>
  );
}

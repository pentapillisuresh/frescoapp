import { useColorScheme } from "react-native";
import { useMemo } from "react";

export const useDarkMode = () => {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === "dark";

  const colors = useMemo(() => {
    if (isDark) {
      return {
        background: "#121212",
        surface: "#1E1E1E",
        elevated: "#262626",
        surfaceVariant: "#2A2A2A",
        text: "#FFFFFF",
        textSecondary: "rgba(255, 255, 255, 0.6)",
        textTertiary: "rgba(255, 255, 255, 0.4)",
        primary: "#4CAF50",
        primaryVariant: "#45A049",
        accent: "#66BB6A",
        success: "#4CAF50",
        warning: "#FFA726",
        error: "#F44336",
        border: "rgba(255, 255, 255, 0.12)",
        borderSecondary: "rgba(255, 255, 255, 0.08)",
        overlay: "rgba(0, 0, 0, 0.5)",
        notification: "#FF5722",
        rating: "#FFB300",
        promo: "#FFF176",
        promoText: "#1A1A1A",
        statusBar: "light",
      };
    } else {
      return {
        background: "#FFFFFF",
        surface: "#FFFFFF",
        elevated: "#F5F5F5",
        surfaceVariant: "#F8F8F8",
        text: "#0F4241",
        textSecondary: "#5F5F5F",
        textTertiary: "#8C9499",
        primary: "#089A21",
        primaryVariant: "#02971F",
        accent: "#28A745",
        success: "#089A21",
        warning: "#FF9800",
        error: "#F44336",
        border: "#E5E5E5",
        borderSecondary: "#E4E7EB",
        overlay: "rgba(0, 0, 0, 0.5)",
        notification: "#FF3B30",
        rating: "#FFC107",
        promo: "#FFF45D",
        promoText: "#0F4241",
        statusBar: "dark",
      };
    }
  }, [isDark]);

  return { isDark, colors };
};

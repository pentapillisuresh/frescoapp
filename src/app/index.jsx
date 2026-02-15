import React, { useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useFonts, Inter_700Bold } from "@expo-google-fonts/inter";

export default function SplashScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Inter_700Bold,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ImageBackground
        source={require("../../assets/images/frescoadmin.png")}
        style={styles.image}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        {fontsLoaded && (
          <View style={styles.content}>
{/*             <Text style={styles.logoText}>FRESCO</Text> */}

            <View style={styles.taglineBox}>
              <Text style={styles.tagline}>
                Freshness Delivered
              </Text>
            </View>
          </View>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  content: {
    alignItems: "center",
    zIndex: 2,
  },

  logoText: {
    fontSize: 64,
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    letterSpacing: 4,
  },

  taglineBox: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 10,
  },

  tagline: {
    fontSize: 14,
    color: "#089A21",
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
});


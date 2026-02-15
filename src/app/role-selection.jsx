import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDarkMode } from "@/utils/useDarkMode";
import { useStore } from "@/store/useStore";
import {
  useFonts,
  Inter_600SemiBold,
  Inter_400Regular,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import { ShoppingBag, Truck, Clock, Package, TrendingUp, Home } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function RoleSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useDarkMode();
  const { setUserRole } = useStore();

  const [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
  });

  if (!fontsLoaded) return null;

  const handleRoleSelect = (role) => {
    setUserRole(role);
    if (role === "wholesale") {
      router.push("/wholesale-registration");
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/retail.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
        style={StyleSheet.absoluteFill}
      />

      <StatusBar style="light" />

      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 20,
          },
        ]}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Image
            source={require("../../assets/images/frescologo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>
            Select your preferred shopping experience
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleRoleSelect("retail")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["rgba(8,154,33,0.2)", "rgba(8,154,33,0.05)"]}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: "#089A21" }]}>
                  <ShoppingBag color="#FFFFFF" size={28} />
                </View>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>Retail</Text>
                  <Text style={styles.cardBadge}>Personal</Text>
                </View>
              </View>

              <Text style={styles.cardDesc}>
                Fresh groceries and meals delivered to your doorstep
              </Text>

              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <Clock color="#089A21" size={16} />
                  <Text style={styles.benefitText}>30-min delivery</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Package color="#089A21" size={16} />
                  <Text style={styles.benefitText}>Free delivery ₹499+</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Home color="#089A21" size={16} />
                  <Text style={styles.benefitText}>Home delivery</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.selectText}>Shop Retail</Text>
                <View style={[styles.arrowIcon, { backgroundColor: "#089A21" }]}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => handleRoleSelect("wholesale")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["rgba(239,108,0,0.2)", "rgba(239,108,0,0.05)"]}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: "#EF6C00" }]}>
                  <Truck color="#FFFFFF" size={28} />
                </View>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>Wholesale</Text>
                  <Text style={styles.cardBadge}>Business</Text>
                </View>
              </View>

              <Text style={styles.cardDesc}>
                Bulk orders with special pricing for businesses
              </Text>

              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <TrendingUp color="#EF6C00" size={16} />
                  <Text style={styles.benefitText}>Up to 40% off</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Package color="#EF6C00" size={16} />
                  <Text style={styles.benefitText}>Bulk orders</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Clock color="#EF6C00" size={16} />
                  <Text style={styles.benefitText}>Priority support</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.selectText}>Shop Wholesale</Text>
                <View style={[styles.arrowIcon, { backgroundColor: "#EF6C00" }]}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text
              style={styles.loginText}
              onPress={() => router.push("/login")}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.9)",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  cardsContainer: {
    gap: 16,
    marginVertical: 10,
  },
  card: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardBadge: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.9)",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: "hidden",
  },
  cardDesc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.9)",
    lineHeight: 20,
    marginBottom: 16,
  },
  benefitsList: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  benefitText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.9)",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  arrowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
  },
  loginText: {
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
    textDecorationLine: "underline",
  },
});
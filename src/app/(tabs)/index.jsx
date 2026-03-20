import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ShoppingCart, MapPin, ChevronRight, X } from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useStore } from "@/store/useStore";
import { useRouter } from "expo-router";
import { Video, ResizeMode } from "expo-av";

const OUTLETS = [
  "Main Market, mvp",
  "Farmers Hub, gajuwaka",
  "Rural Greens, akkyapalem",
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const videoRef = useRef(null);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [showLocationModal, setShowLocationModal] = useState(false);
  const { userRole, cart, koveraLocation, setKoveraLocation } = useStore();

  // Auto-play video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playAsync();
    }
  }, []);

  const handleGroceriesClick = () => {
    router.push("/categories");
  };

  const handleKoveraClick = () => {
    setShowLocationModal(true);
  };

  const handleOutletSelect = (outlet) => {
    setKoveraLocation(outlet);
    setShowLocationModal(false);
    router.push("/kovera-food");
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 12,
          paddingHorizontal: 16,
          backgroundColor: "#124703",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 28,
                color: "#FFFFFF",
              }}
            >
              FRESCO
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 13,
                color: "#C8E6C9",
                marginTop: 2,
              }}
            >
              Fresh Groceries & Farm Food
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#BFDD27",
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 11,
                color: "#1B5E20",
              }}
            >
              {userRole === "wholesale" ? "WHOLESALE" : "RETAIL"}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner - Full width video with no text overlay */}
        <View
          style={{
            height: 200,
            backgroundColor: "#1B5E20",
            width: "100%", // Full width
            marginTop: 0, // Remove top margin
          }}
        >
          <Video
            ref={videoRef}
            source={require("../../../assets/images/fresco2.mp4")}
            style={{ width: "100%", height: "100%" }}
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay
            isMuted={true}
            useNativeControls={false}
          />
          {/* No text overlay */}
        </View>

        {/* Welcome Section */}
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 20,
              color: "#1B5E20",
              marginBottom: 6,
            }}
          >
            Welcome Back! 👋
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 14,
              color: "#757575",
              lineHeight: 20,
            }}
          >
            {userRole === "wholesale"
              ? "Browse our wholesale groceries for your business needs"
              : "What would you like to shop for today?"}
          </Text>
        </View>

        {/* Main Categories */}
        <View style={{ paddingHorizontal: 16, marginTop: 20, gap: 16 }}>
          {/* Groceries Card */}
          <TouchableOpacity
            onPress={handleGroceriesClick}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              overflow: "hidden",
              borderWidth: 2,
              borderColor: "#E0E0E0",
            }}
          >
            <View style={{ height: 140 }}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1543168256-418811576931?w=800",
                }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
              <View
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  backgroundColor: "#124703",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 11,
                    color: "#FFFFFF",
                  }}
                >
                  🥬 GROCERIES
                </Text>
              </View>
            </View>
            <View style={{ padding: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Inter_700Bold",
                      fontSize: 18,
                      color: "#1B5E20",
                      marginBottom: 4,
                    }}
                  >
                    Fresh Groceries
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 13,
                      color: "#757575",
                      lineHeight: 18,
                    }}
                  >
                    Vegetables, Fruits, Dairy & More
                  </Text>
                </View>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#BFDD27",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ChevronRight size={24} color="#1B5E20" />
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* KOVERA Food Card - Only for Retail */}
          {userRole === "retail" && (
            <TouchableOpacity
              onPress={handleKoveraClick}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                overflow: "hidden",
                borderWidth: 2,
                borderColor: "#E0E0E0",
              }}
            >
              <View style={{ height: 140 }}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
                  }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
                <View
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    backgroundColor: "#FF6F00",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_700Bold",
                      fontSize: 11,
                      color: "#FFFFFF",
                    }}
                  >
                    🍽️ KOVERA
                  </Text>
                </View>
              </View>
              <View style={{ padding: 16 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "Inter_700Bold",
                        fontSize: 18,
                        color: "#1B5E20",
                        marginBottom: 4,
                      }}
                    >
                      KOVERA - The Farmers Kitchen
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: 13,
                        color: "#757575",
                        lineHeight: 18,
                      }}
                    >
                      Ready-to-eat meals from farm fresh ingredients
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: "#BFDD27",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ChevronRight size={24} color="#1B5E20" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Features Banner */}
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <View
            style={{
              backgroundColor: "#E8F5E9",
              borderRadius: 16,
              padding: 20,
              borderLeftWidth: 0,
              borderLeftColor: "#124703",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 16,
                color: "#1B5E20",
                marginBottom: 8,
              }}
            >
              Why Choose FRESCO?
            </Text>
            <View style={{ gap: 6 }}>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 13,
                  color: "#124703",
                  lineHeight: 18,
                }}
              >
                ✓ Farm Fresh Daily Delivery
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 13,
                  color: "#124703",
                  lineHeight: 18,
                }}
              >
                ✓{" "}
                {userRole === "wholesale"
                  ? "Best Wholesale Prices"
                  : "100% Quality Guarantee"}
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 13,
                  color: "#124703",
                  lineHeight: 18,
                }}
              >
                ✓ Support Local Farmers
              </Text>
            </View>
          </View>
        </View>

        {/* Promotional Banners */}
        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            <View
              style={{
                width: 280,
                height: 120,
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800",
                }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 15,
                    color: "#FFFFFF",
                  }}
                >
                  Fresh Fruits Daily
                </Text>
              </View>
            </View>

            <View
              style={{
                width: 280,
                height: 120,
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800",
                }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 15,
                    color: "#FFFFFF",
                  }}
                >
                  Organic Vegetables
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Outlet Selection Modal */}
      <Modal visible={showLocationModal} transparent animationType="slide">
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
          onPress={() => setShowLocationModal(false)}
        >
          <Pressable
            style={{
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingTop: 20,
              paddingBottom: insets.bottom + 20,
              paddingHorizontal: 24,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 20,
                  color: "#1B5E20",
                }}
              >
                Select KOVERA Outlet
              </Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <X size={24} color="#757575" />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: "#757575",
                marginBottom: 16,
                lineHeight: 20,
              }}
            >
              Choose your nearest KOVERA kitchen to see the menu
            </Text>

            {OUTLETS.map((outlet, index) => (
              <TouchableOpacity
                key={outlet}
                onPress={() => handleOutletSelect(outlet)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  backgroundColor: "#F5F5F5",
                  borderRadius: 16,
                  marginBottom: 12,
                  borderWidth: 2,
                  borderColor:
                    koveraLocation === outlet ? "#124703" : "transparent",
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#E8F5E9",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <MapPin size={20} color="#124703" />
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 15,
                    color: "#1B5E20",
                  }}
                >
                  {outlet}
                </Text>
                <ChevronRight size={20} color="#BDBDBD" />
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Floating Cart Badge */}
      {cartCount > 0 && (
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/cart")}
          style={{
            position: "absolute",
            bottom: insets.bottom + 80,
            right: 20,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: "#124703",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <ShoppingCart size={24} color="#FFFFFF" />
          <View
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: "#BFDD27",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: "#FFFFFF",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 11,
                color: "#1B5E20",
              }}
            >
              {cartCount}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
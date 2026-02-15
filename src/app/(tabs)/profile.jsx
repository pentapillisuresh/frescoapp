import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
  Shield,
  HelpCircle,
  FileText,
  X,
} from "lucide-react-native";
import { useStore } from "@/store/useStore";
import { useRouter } from "expo-router";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const { userRole, clearCart, setLoggedIn } = useStore();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      label: "Home",
      address: "123 Green Street, Bangalore - 560001",
      default: true,
    },
    {
      id: "2",
      label: "Office",
      address: "456 Tech Park, Bangalore - 560037",
      default: false,
    },
  ]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          clearCart();
          setLoggedIn(false);
          router.replace("/login");
        },
      },
    ]);
  };

  const handleDeleteAddress = (id) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setAddresses(addresses.filter((addr) => addr.id !== id));
          },
        },
      ],
    );
  };

  const menuItems = [
    {
      icon: MapPin,
      label: "Manage Addresses",
      onPress: () => setShowAddressModal(true),
      color: "#2E7D32",
    },
    {
      icon: Bell,
      label: "Notifications",
      onPress: () =>
        Alert.alert("Notifications", "Notification settings coming soon!"),
      color: "#FF9800",
    },
    {
      icon: Shield,
      label: "Privacy & Security",
      onPress: () => Alert.alert("Privacy", "Privacy settings coming soon!"),
      color: "#1976D2",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      onPress: () => Alert.alert("Support", "Contact support@fresco.com"),
      color: "#9C27B0",
    },
    {
      icon: FileText,
      label: "Terms & Conditions",
      onPress: () => Alert.alert("Terms", "Terms & Conditions coming soon!"),
      color: "#607D8B",
    },
    {
      icon: Settings,
      label: "App Settings",
      onPress: () => setShowSettingsModal(true),
      color: "#424242",
    },
  ];

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#2E7D32" }}>
      <StatusBar style="light" backgroundColor="#2E7D32" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingBottom: 16,
          paddingHorizontal: 20,
          backgroundColor: "#2E7D32",
        }}
      >
        <Text
          style={{
            fontFamily: "Inter_700Bold",
            fontSize: 24,
            color: "#FFFFFF",
          }}
        >
          My Profile
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: "#F5F5F5", borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
        contentContainerStyle={{
          padding: 16,
          paddingTop: 24,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Card */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            padding: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#E0E0E0",
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "#E8F5E9",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
                borderWidth: 4,
                borderColor: "#FFEB3B",
              }}
            >
              <User size={50} color="#2E7D32" />
            </View>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 22,
                color: "#1B5E20",
                marginBottom: 4,
              }}
            >
              {userRole === "wholesale" ? "Wholesale Buyer" : "Retail Customer"}
            </Text>
            <View
              style={{
                backgroundColor:
                  userRole === "wholesale" ? "#FFF3E0" : "#E8F5E9",
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 13,
                  color: userRole === "wholesale" ? "#E65100" : "#2E7D32",
                }}
              >
                {userRole === "wholesale"
                  ? "WHOLESALE ACCOUNT"
                  : "RETAIL ACCOUNT"}
              </Text>
            </View>
          </View>

          <View style={{ gap: 12 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#E8F5E9",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Phone size={20} color="#2E7D32" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 12,
                    color: "#757575",
                    marginBottom: 2,
                  }}
                >
                  Phone Number
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 15,
                    color: "#1B5E20",
                  }}
                >
                  +91 98765 43210
                </Text>
              </View>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#E8F5E9",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Mail size={20} color="#2E7D32" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 12,
                    color: "#757575",
                    marginBottom: 2,
                  }}
                >
                  Email Address
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 15,
                    color: "#1B5E20",
                  }}
                >
                  customer@fresco.com
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            padding: 8,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#E0E0E0",
          }}
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                borderBottomColor: "#F5F5F5",
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: `${item.color}15`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <item.icon size={20} color={item.color} />
              </View>
              <Text
                style={{
                  flex: 1,
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 15,
                  color: "#1B5E20",
                }}
              >
                {item.label}
              </Text>
              <ChevronRight size={20} color="#BDBDBD" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderWidth: 2,
            borderColor: "#C62828",
          }}
        >
          <LogOut size={20} color="#C62828" />
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 16,
              color: "#C62828",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Address Modal */}
      <Modal visible={showAddressModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingTop: 20,
              paddingBottom: insets.bottom + 20,
              paddingHorizontal: 24,
              maxHeight: "80%",
            }}
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
                Saved Addresses
              </Text>
              <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                <X size={24} color="#757575" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {addresses.map((addr) => (
                <View
                  key={addr.id}
                  style={{
                    backgroundColor: addr.default ? "#E8F5E9" : "#F5F5F5",
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                    borderWidth: addr.default ? 2 : 1,
                    borderColor: addr.default ? "#2E7D32" : "#E0E0E0",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Inter_700Bold",
                            fontSize: 16,
                            color: "#1B5E20",
                          }}
                        >
                          {addr.label}
                        </Text>
                        {addr.default && (
                          <View
                            style={{
                              backgroundColor: "#2E7D32",
                              paddingHorizontal: 8,
                              paddingVertical: 3,
                              borderRadius: 10,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "Inter_600SemiBold",
                                fontSize: 10,
                                color: "#FFFFFF",
                              }}
                            >
                              DEFAULT
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text
                        style={{
                          fontFamily: "Inter_400Regular",
                          fontSize: 14,
                          color: "#757575",
                          lineHeight: 20,
                        }}
                      >
                        {addr.address}
                      </Text>
                    </View>
                    {!addr.default && (
                      <TouchableOpacity
                        onPress={() => handleDeleteAddress(addr.id)}
                        style={{ marginLeft: 8 }}
                      >
                        <Text
                          style={{
                            fontFamily: "Inter_600SemiBold",
                            fontSize: 13,
                            color: "#C62828",
                          }}
                        >
                          Delete
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}

              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Add Address",
                    "This feature will let you add a new delivery address",
                  );
                }}
                style={{
                  backgroundColor: "#2E7D32",
                  borderRadius: 16,
                  padding: 16,
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 16,
                    color: "#FFFFFF",
                  }}
                >
                  + Add New Address
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal visible={showSettingsModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingTop: 20,
              paddingBottom: insets.bottom + 20,
              paddingHorizontal: 24,
            }}
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
                App Settings
              </Text>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <X size={24} color="#757575" />
              </TouchableOpacity>
            </View>

            <View style={{ gap: 12 }}>
              <View
                style={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: 16,
                  padding: 16,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 15,
                    color: "#1B5E20",
                    marginBottom: 4,
                  }}
                >
                  App Version
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: "#757575",
                  }}
                >
                  FRESCO v1.0.0
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Cache Cleared",
                    "App cache has been cleared successfully!",
                  );
                }}
                style={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 15,
                    color: "#1B5E20",
                  }}
                >
                  Clear Cache
                </Text>
                <ChevronRight size={20} color="#BDBDBD" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "About",
                    "FRESCO - Fresh groceries delivered to your doorstep!",
                  );
                }}
                style={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 15,
                    color: "#1B5E20",
                  }}
                >
                  About FRESCO
                </Text>
                <ChevronRight size={20} color="#BDBDBD" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
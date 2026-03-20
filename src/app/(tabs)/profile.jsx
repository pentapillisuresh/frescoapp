import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
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
  Home,
  Building2,
  MapPinned,
  Check,
  Plus,
  Globe,
  Tag,
  Edit3,
  Trash2,
  Star,
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
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      label: "Home",
      address: "123 Green Street, Bangalore - 560001",
      city: "Bangalore",
      pincode: "560001",
      landmark: "Near City Park",
      phone: "+91 98765 43210",
      default: true,
      type: "home",
    },
    {
      id: "2",
      label: "Office",
      address: "456 Tech Park, Bangalore - 560037",
      city: "Bangalore",
      pincode: "560037",
      landmark: "Opposite Metro Station",
      phone: "+91 98765 12345",
      default: false,
      type: "office",
    },
  ]);

  // New address form state
  const [newAddress, setNewAddress] = useState({
    label: "",
    address: "",
    city: "",
    pincode: "",
    landmark: "",
    phone: "",
    type: "home",
  });

  // Online profile images based on user role
  const profileImages = {
    retail: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
    wholesale: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    default: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
  };

  const getProfileImage = () => {
    if (userRole === "wholesale") {
      return { uri: profileImages.wholesale };
    } else if (userRole === "retail") {
      return { uri: profileImages.retail };
    }
    return { uri: profileImages.default };
  };

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

  const handleSetDefaultAddress = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      default: addr.id === id
    })));
    Alert.alert("Success", "Default address updated successfully!");
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowEditAddressModal(true);
  };

  const handleUpdateAddress = () => {
    // Validate form
    if (!editingAddress.label || !editingAddress.address || !editingAddress.city || !editingAddress.pincode || !editingAddress.phone) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(editingAddress.phone.replace(/[^0-9]/g, ''))) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number");
      return;
    }

    // Validate pincode (6 digits)
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(editingAddress.pincode)) {
      Alert.alert("Error", "Please enter a valid 6-digit pincode");
      return;
    }

    setAddresses(addresses.map(addr =>
      addr.id === editingAddress.id ? editingAddress : addr
    ));

    setShowEditAddressModal(false);
    setEditingAddress(null);

    Alert.alert("Success", "Address updated successfully!");
  };

  const handleAddAddress = () => {
    // Validate form
    if (!newAddress.label || !newAddress.address || !newAddress.city || !newAddress.pincode || !newAddress.phone) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(newAddress.phone)) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number");
      return;
    }

    // Validate pincode (6 digits)
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(newAddress.pincode)) {
      Alert.alert("Error", "Please enter a valid 6-digit pincode");
      return;
    }

    const newAddressWithId = {
      ...newAddress,
      id: Date.now().toString(),
      default: addresses.length === 0, // Make default if first address
    };

    setAddresses([...addresses, newAddressWithId]);
    setShowAddAddressModal(false);

    // Reset form
    setNewAddress({
      label: "",
      address: "",
      city: "",
      pincode: "",
      landmark: "",
      phone: "",
      type: "home",
    });

    Alert.alert("Success", "Address added successfully!");
  };

  const getAddressTypeIcon = (type) => {
    switch(type) {
      case "home":
        return <Home size={20} color="#124703" />;
      case "office":
        return <Building2 size={20} color="#124703" />;
      default:
        return <MapPinned size={20} color="#124703" />;
    }
  };

  const menuItems = [
    {
      icon: MapPin,
      label: "Manage Addresses",
      onPress: () => setShowAddressModal(true),
      color: "#124703",
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
      onPress: () => Alert.alert("Support", "contact@fresco.com\n+91 98765 43210"),
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
    <View style={{ flex: 1, backgroundColor: "#124703" }}>
      <StatusBar style="light" backgroundColor="#124703" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingBottom: 16,
          paddingHorizontal: 20,
          backgroundColor: "#124703",
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
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Image
              source={getProfileImage()}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginBottom: 12,
                borderWidth: 4,
                borderColor: "#BFDD27",
              }}
            />
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 22,
                color: "#1B5E20",
                marginBottom: 4,
              }}
            >
              {userRole === "wholesale" ? "Rahul Sharma" : "Suresh Kumar"}
            </Text>
            <View
              style={{
                backgroundColor:
                  userRole === "wholesale" ? "#FFF3E0" : "#E8F5E9",
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 20,
                marginTop: 4,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 13,
                  color: userRole === "wholesale" ? "#E65100" : "#124703",
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
                <Phone size={20} color="#124703" />
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
                  {userRole === "wholesale" ? "+91 98765 43210" : "+91 98765 12345"}
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
                <Mail size={20} color="#124703" />
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
                  {userRole === "wholesale" ? "rahul.sharma@fresco.com" : "suresh.kumar@fresco.com"}
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
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
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
                    backgroundColor: "#FFFFFF",
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: addr.default ? "#124703" : "#E0E0E0",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
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
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                          {getAddressTypeIcon(addr.type)}
                          <Text
                            style={{
                              fontFamily: "Inter_700Bold",
                              fontSize: 16,
                              color: "#1B5E20",
                              marginLeft: 4,
                            }}
                          >
                            {addr.label}
                          </Text>
                        </View>
                        {addr.default && (
                          <View
                            style={{
                              backgroundColor: "#124703",
                              paddingHorizontal: 8,
                              paddingVertical: 3,
                              borderRadius: 10,
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Star size={10} color="#FFFFFF" fill="#FFFFFF" />
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
                          color: "#424242",
                          lineHeight: 20,
                          marginBottom: 4,
                        }}
                      >
                        {addr.address}
                      </Text>

                      <Text
                        style={{
                          fontFamily: "Inter_400Regular",
                          fontSize: 13,
                          color: "#757575",
                          marginBottom: 2,
                        }}
                      >
                        {addr.city} - {addr.pincode}
                      </Text>

                      {addr.landmark && (
                        <Text
                          style={{
                            fontFamily: "Inter_400Regular",
                            fontSize: 13,
                            color: "#757575",
                            marginBottom: 2,
                          }}
                        >
                          Landmark: {addr.landmark}
                        </Text>
                      )}

                      <Text
                        style={{
                          fontFamily: "Inter_400Regular",
                          fontSize: 13,
                          color: "#124703",
                          marginTop: 4,
                        }}
                      >
                        Phone: {addr.phone}
                      </Text>
                    </View>

                    <View style={{ gap: 8 }}>
                      {/* Edit Button */}
                      <TouchableOpacity
                        onPress={() => handleEditAddress(addr)}
                        style={{
                          backgroundColor: "#E3F2FD",
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 8,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Edit3 size={12} color="#1976D2" />
                        <Text
                          style={{
                            fontFamily: "Inter_600SemiBold",
                            fontSize: 11,
                            color: "#1976D2",
                          }}
                        >
                          EDIT
                        </Text>
                      </TouchableOpacity>

                      {!addr.default ? (
                        <>
                          <TouchableOpacity
                            onPress={() => handleSetDefaultAddress(addr.id)}
                            style={{
                              backgroundColor: "#E8F5E9",
                              paddingHorizontal: 12,
                              paddingVertical: 6,
                              borderRadius: 8,
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Star size={12} color="#124703" />
                            <Text
                              style={{
                                fontFamily: "Inter_600SemiBold",
                                fontSize: 11,
                                color: "#124703",
                              }}
                            >
                              SET DEFAULT
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => handleDeleteAddress(addr.id)}
                            style={{
                              backgroundColor: "#FFEBEE",
                              paddingHorizontal: 12,
                              paddingVertical: 6,
                              borderRadius: 8,
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Trash2 size={12} color="#C62828" />
                            <Text
                              style={{
                                fontFamily: "Inter_600SemiBold",
                                fontSize: 11,
                                color: "#C62828",
                              }}
                            >
                              DELETE
                            </Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#F5F5F5",
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 8,
                            opacity: 0.5,
                          }}
                          disabled
                        >
                          <Text
                            style={{
                              fontFamily: "Inter_600SemiBold",
                              fontSize: 11,
                              color: "#757575",
                            }}
                          >
                            DEFAULT
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                onPress={() => {
                  setShowAddressModal(false);
                  setShowAddAddressModal(true);
                }}
                style={{
                  backgroundColor: "#124703",
                  borderRadius: 16,
                  padding: 16,
                  alignItems: "center",
                  marginTop: 8,
                  marginBottom: 16,
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Plus size={20} color="#FFFFFF" />
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 16,
                    color: "#FFFFFF",
                  }}
                >
                  Add New Address
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Address Modal */}
      <Modal visible={showAddAddressModal} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
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
                maxHeight: "90%",
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
                  Add New Address
                </Text>
                <TouchableOpacity onPress={() => setShowAddAddressModal(false)}>
                  <X size={24} color="#757575" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Address Type Selection */}
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 14,
                    color: "#1B5E20",
                    marginBottom: 8,
                  }}
                >
                  Address Type *
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setNewAddress({...newAddress, type: "home", label: "Home"})}
                    style={{
                      flex: 1,
                      backgroundColor: newAddress.type === "home" ? "#E8F5E9" : "#F5F5F5",
                      borderRadius: 12,
                      padding: 12,
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor: newAddress.type === "home" ? "#124703" : "#E0E0E0",
                    }}
                  >
                    <Home size={24} color={newAddress.type === "home" ? "#124703" : "#757575"} />
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 13,
                        color: newAddress.type === "home" ? "#124703" : "#757575",
                        marginTop: 4,
                      }}
                    >
                      Home
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setNewAddress({...newAddress, type: "office", label: "Office"})}
                    style={{
                      flex: 1,
                      backgroundColor: newAddress.type === "office" ? "#E8F5E9" : "#F5F5F5",
                      borderRadius: 12,
                      padding: 12,
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor: newAddress.type === "office" ? "#124703" : "#E0E0E0",
                    }}
                  >
                    <Building2 size={24} color={newAddress.type === "office" ? "#124703" : "#757575"} />
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 13,
                        color: newAddress.type === "office" ? "#124703" : "#757575",
                        marginTop: 4,
                      }}
                    >
                      Office
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Address Label */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 14,
                      color: "#1B5E20",
                      marginBottom: 8,
                    }}
                  >
                    Address Label *
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#F5F5F5",
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      borderWidth: 1,
                      borderColor: "#E0E0E0",
                    }}
                  >
                    <Tag size={20} color="#757575" />
                    <TextInput
                      style={{
                        flex: 1,
                        fontFamily: "Inter_400Regular",
                        fontSize: 15,
                        color: "#1B5E20",
                        paddingVertical: 14,
                        paddingHorizontal: 12,
                      }}
                      placeholder="e.g., Home, Office, Parents"
                      placeholderTextColor="#9E9E9E"
                      value={newAddress.label}
                      onChangeText={(text) => setNewAddress({...newAddress, label: text})}
                    />
                  </View>
                </View>

                {/* Address */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 14,
                      color: "#1B5E20",
                      marginBottom: 8,
                    }}
                  >
                    Street Address *
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#F5F5F5",
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      borderWidth: 1,
                      borderColor: "#E0E0E0",
                    }}
                  >
                    <TextInput
                      style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: 15,
                        color: "#1B5E20",
                        paddingVertical: 14,
                      }}
                      placeholder="House/Flat No., Building, Street"
                      placeholderTextColor="#9E9E9E"
                      value={newAddress.address}
                      onChangeText={(text) => setNewAddress({...newAddress, address: text})}
                      multiline
                    />
                  </View>
                </View>

                {/* City and Pincode */}
                <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
                  <View style={{ flex: 2 }}>
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 14,
                        color: "#1B5E20",
                        marginBottom: 8,
                      }}
                    >
                      City *
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#F5F5F5",
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        borderWidth: 1,
                        borderColor: "#E0E0E0",
                      }}
                    >
                      <TextInput
                        style={{
                          fontFamily: "Inter_400Regular",
                          fontSize: 15,
                          color: "#1B5E20",
                          paddingVertical: 14,
                        }}
                        placeholder="Enter city"
                        placeholderTextColor="#9E9E9E"
                        value={newAddress.city}
                        onChangeText={(text) => setNewAddress({...newAddress, city: text})}
                      />
                    </View>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 14,
                        color: "#1B5E20",
                        marginBottom: 8,
                      }}
                    >
                      Pincode *
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#F5F5F5",
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        borderWidth: 1,
                        borderColor: "#E0E0E0",
                      }}
                    >
                      <TextInput
                        style={{
                          fontFamily: "Inter_400Regular",
                          fontSize: 15,
                          color: "#1B5E20",
                          paddingVertical: 14,
                        }}
                        placeholder="560001"
                        placeholderTextColor="#9E9E9E"
                        value={newAddress.pincode}
                        onChangeText={(text) => setNewAddress({...newAddress, pincode: text})}
                        keyboardType="numeric"
                        maxLength={6}
                      />
                    </View>
                  </View>
                </View>

                {/* Landmark */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 14,
                      color: "#1B5E20",
                      marginBottom: 8,
                    }}
                  >
                    Landmark (Optional)
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#F5F5F5",
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      borderWidth: 1,
                      borderColor: "#E0E0E0",
                    }}
                  >
                    <TextInput
                      style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: 15,
                        color: "#1B5E20",
                        paddingVertical: 14,
                      }}
                      placeholder="Nearby landmark"
                      placeholderTextColor="#9E9E9E"
                      value={newAddress.landmark}
                      onChangeText={(text) => setNewAddress({...newAddress, landmark: text})}
                    />
                  </View>
                </View>

                {/* Phone Number */}
                <View style={{ marginBottom: 24 }}>
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 14,
                      color: "#1B5E20",
                      marginBottom: 8,
                    }}
                  >
                    Phone Number *
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#F5F5F5",
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      borderWidth: 1,
                      borderColor: "#E0E0E0",
                    }}
                  >
                    <Phone size={20} color="#757575" />
                    <TextInput
                      style={{
                        flex: 1,
                        fontFamily: "Inter_400Regular",
                        fontSize: 15,
                        color: "#1B5E20",
                        paddingVertical: 14,
                        paddingHorizontal: 12,
                      }}
                      placeholder="10-digit mobile number"
                      placeholderTextColor="#9E9E9E"
                      value={newAddress.phone}
                      onChangeText={(text) => setNewAddress({...newAddress, phone: text})}
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
                  <TouchableOpacity
                    onPress={() => setShowAddAddressModal(false)}
                    style={{
                      flex: 1,
                      backgroundColor: "#F5F5F5",
                      borderRadius: 16,
                      padding: 16,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#E0E0E0",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 16,
                        color: "#757575",
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleAddAddress}
                    style={{
                      flex: 1,
                      backgroundColor: "#124703",
                      borderRadius: 16,
                      padding: 16,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <Check size={20} color="#FFFFFF" />
                    <Text
                      style={{
                        fontFamily: "Inter_700Bold",
                        fontSize: 16,
                        color: "#FFFFFF",
                      }}
                    >
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit Address Modal */}
      <Modal visible={showEditAddressModal} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
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
                maxHeight: "90%",
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
                  Edit Address
                </Text>
                <TouchableOpacity onPress={() => {
                  setShowEditAddressModal(false);
                  setEditingAddress(null);
                }}>
                  <X size={24} color="#757575" />
                </TouchableOpacity>
              </View>

              {editingAddress && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Address Type Selection */}
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 14,
                      color: "#1B5E20",
                      marginBottom: 8,
                    }}
                  >
                    Address Type *
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setEditingAddress({...editingAddress, type: "home", label: "Home"})}
                      style={{
                        flex: 1,
                        backgroundColor: editingAddress.type === "home" ? "#E8F5E9" : "#F5F5F5",
                        borderRadius: 12,
                        padding: 12,
                        alignItems: "center",
                        borderWidth: 2,
                        borderColor: editingAddress.type === "home" ? "#124703" : "#E0E0E0",
                      }}
                    >
                      <Home size={24} color={editingAddress.type === "home" ? "#124703" : "#757575"} />
                      <Text
                        style={{
                          fontFamily: "Inter_600SemiBold",
                          fontSize: 13,
                          color: editingAddress.type === "home" ? "#124703" : "#757575",
                          marginTop: 4,
                        }}
                      >
                        Home
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setEditingAddress({...editingAddress, type: "office", label: "Office"})}
                      style={{
                        flex: 1,
                        backgroundColor: editingAddress.type === "office" ? "#E8F5E9" : "#F5F5F5",
                        borderRadius: 12,
                        padding: 12,
                        alignItems: "center",
                        borderWidth: 2,
                        borderColor: editingAddress.type === "office" ? "#124703" : "#E0E0E0",
                      }}
                    >
                      <Building2 size={24} color={editingAddress.type === "office" ? "#124703" : "#757575"} />
                      <Text
                        style={{
                          fontFamily: "Inter_600SemiBold",
                          fontSize: 13,
                          color: editingAddress.type === "office" ? "#124703" : "#757575",
                          marginTop: 4,
                        }}
                      >
                        Office
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Address Label */}
                  <View style={{ marginBottom: 16 }}>
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 14,
                        color: "#1B5E20",
                        marginBottom: 8,
                      }}
                    >
                      Address Label *
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#F5F5F5",
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        borderWidth: 1,
                        borderColor: "#E0E0E0",
                      }}
                    >
                      <Tag size={20} color="#757575" />
                      <TextInput
                        style={{
                          flex: 1,
                          fontFamily: "Inter_400Regular",
                          fontSize: 15,
                          color: "#1B5E20",
                          paddingVertical: 14,
                          paddingHorizontal: 12,
                        }}
                        placeholder="e.g., Home, Office, Parents"
                        placeholderTextColor="#9E9E9E"
                        value={editingAddress.label}
                        onChangeText={(text) => setEditingAddress({...editingAddress, label: text})}
                      />
                    </View>
                  </View>

                  {/* Address */}
                  <View style={{ marginBottom: 16 }}>
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 14,
                        color: "#1B5E20",
                        marginBottom: 8,
                      }}
                    >
                      Street Address *
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#F5F5F5",
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        borderWidth: 1,
                        borderColor: "#E0E0E0",
                      }}
                    >
                      <TextInput
                        style={{
                          fontFamily: "Inter_400Regular",
                          fontSize: 15,
                          color: "#1B5E20",
                          paddingVertical: 14,
                        }}
                        placeholder="House/Flat No., Building, Street"
                        placeholderTextColor="#9E9E9E"
                        value={editingAddress.address}
                        onChangeText={(text) => setEditingAddress({...editingAddress, address: text})}
                        multiline
                      />
                    </View>
                  </View>

                  {/* City and Pincode */}
                  <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
                    <View style={{ flex: 2 }}>
                      <Text
                        style={{
                          fontFamily: "Inter_600SemiBold",
                          fontSize: 14,
                          color: "#1B5E20",
                          marginBottom: 8,
                        }}
                      >
                        City *
                      </Text>
                      <View
                        style={{
                          backgroundColor: "#F5F5F5",
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          borderWidth: 1,
                          borderColor: "#E0E0E0",
                        }}
                      >
                        <TextInput
                          style={{
                            fontFamily: "Inter_400Regular",
                            fontSize: 15,
                            color: "#1B5E20",
                            paddingVertical: 14,
                          }}
                          placeholder="Enter city"
                          placeholderTextColor="#9E9E9E"
                          value={editingAddress.city}
                          onChangeText={(text) => setEditingAddress({...editingAddress, city: text})}
                        />
                      </View>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: "Inter_600SemiBold",
                          fontSize: 14,
                          color: "#1B5E20",
                          marginBottom: 8,
                        }}
                      >
                        Pincode *
                      </Text>
                      <View
                        style={{
                          backgroundColor: "#F5F5F5",
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          borderWidth: 1,
                          borderColor: "#E0E0E0",
                        }}
                      >
                        <TextInput
                          style={{
                            fontFamily: "Inter_400Regular",
                            fontSize: 15,
                            color: "#1B5E20",
                            paddingVertical: 14,
                          }}
                          placeholder="560001"
                          placeholderTextColor="#9E9E9E"
                          value={editingAddress.pincode}
                          onChangeText={(text) => setEditingAddress({...editingAddress, pincode: text})}
                          keyboardType="numeric"
                          maxLength={6}
                        />
                      </View>
                    </View>
                  </View>

                  {/* Landmark */}
                  <View style={{ marginBottom: 16 }}>
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 14,
                        color: "#1B5E20",
                        marginBottom: 8,
                      }}
                    >
                      Landmark (Optional)
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#F5F5F5",
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        borderWidth: 1,
                        borderColor: "#E0E0E0",
                      }}
                    >
                      <TextInput
                        style={{
                          fontFamily: "Inter_400Regular",
                          fontSize: 15,
                          color: "#1B5E20",
                          paddingVertical: 14,
                        }}
                        placeholder="Nearby landmark"
                        placeholderTextColor="#9E9E9E"
                        value={editingAddress.landmark}
                        onChangeText={(text) => setEditingAddress({...editingAddress, landmark: text})}
                      />
                    </View>
                  </View>

                  {/* Phone Number */}
                  <View style={{ marginBottom: 24 }}>
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 14,
                        color: "#1B5E20",
                        marginBottom: 8,
                      }}
                    >
                      Phone Number *
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#F5F5F5",
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        borderWidth: 1,
                        borderColor: "#E0E0E0",
                      }}
                    >
                      <Phone size={20} color="#757575" />
                      <TextInput
                        style={{
                          flex: 1,
                          fontFamily: "Inter_400Regular",
                          fontSize: 15,
                          color: "#1B5E20",
                          paddingVertical: 14,
                          paddingHorizontal: 12,
                        }}
                        placeholder="10-digit mobile number"
                        placeholderTextColor="#9E9E9E"
                        value={editingAddress.phone.replace(/[^0-9]/g, '')}
                        onChangeText={(text) => setEditingAddress({...editingAddress, phone: text})}
                        keyboardType="phone-pad"
                        maxLength={10}
                      />
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
                    <TouchableOpacity
                      onPress={() => {
                        setShowEditAddressModal(false);
                        setEditingAddress(null);
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: "#F5F5F5",
                        borderRadius: 16,
                        padding: 16,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "#E0E0E0",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Inter_600SemiBold",
                          fontSize: 16,
                          color: "#757575",
                        }}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleUpdateAddress}
                      style={{
                        flex: 1,
                        backgroundColor: "#124703",
                        borderRadius: 16,
                        padding: 16,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <Check size={20} color="#FFFFFF" />
                      <Text
                        style={{
                          fontFamily: "Inter_700Bold",
                          fontSize: 16,
                          color: "#FFFFFF",
                        }}
                      >
                        Update
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
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

              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Language",
                    "Language settings coming soon!",
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
                  Language
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 14,
                      color: "#757575",
                    }}
                  >
                    English
                  </Text>
                  <ChevronRight size={20} color="#BDBDBD" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Notification Settings",
                    "Customize your notification preferences",
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
                  Notifications
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
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal,
  Alert,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MapPin,
  X,
  Home,
  Building2,
  Check,
  Star,
  Weight,
} from "lucide-react-native";
import { useStore } from "@/store/useStore";
import { useRouter } from "expo-router";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

// Local images - FIXED PATHS (going up 3 levels to assets)
const PRODUCT_IMAGES = {
  "Red Capsicum": require("../../../assets/images/redcap.png"),
  "Broccoli": require("../../../assets/images/broccoli.webp"),
  "Zucchini": require("../../../assets/images/zucchini.webp"),
  "Tomato": require("../../../assets/images/tomoto.webp"),
  "Onion": require("../../../assets/images/onion.webp"),
  "Potato": require("../../../assets/images/potato.webp"),
  "Apple": require("../../../assets/images/apple.webp"),
  "dragon": require("../../../assets/images/dragon.avif"),
  "Banana": require("../../../assets/images/banana.webp"),
  "Orange": require("../../../assets/images/orange.webp"),
  "Milk": require("../../../assets/images/milk.avif"),
  "Paneer": require("../../../assets/images/panner.avif"),
  "Curd": require("../../../assets/images/curd.avif"),
  "Soya Chunks": require("../../../assets/images/soya.avif"),
  "Tofu": require("../../../assets/images/tofu.avif"),
  "Chips": require("../../../assets/images/chips.avif"),
  "Biscuits": require("../../../assets/images/biscuit.avif"),
  "Prawns Small": require("../../../assets/images/prawns.avif"),
  "Prawns Medium": require("../../../assets/images/prawns1.avif"),
  "Prawns Large": require("../../../assets/images/prawns.avif"),
  "Green Chilli": require("../../../assets/images/banana.webp"),
  "Coriander Bunch": require("../../../assets/images/banana.webp"),
  "Coal": require("../../../assets/images/coal.png"),
};

const FALLBACK_IMAGE = require("../../../assets/images/banana.webp");

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    userRole,
    addOrder,
    getCartTotalWeight,
    getWeightInKg,
  } = useStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showLimitToast, setShowLimitToast] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");
  const successAnim = useRef(new Animated.Value(0)).current;

  const [selectedAddress, setSelectedAddress] = useState({
    id: "1",
    label: "Home",
    address: "123 Green Street, Vizag - 530001",
    city: "Vizag",
    pincode: "530001",
    landmark: "Near City Park",
    phone: "+91 98765 43210",
    default: true,
    type: "home",
  });

  const [addresses, setAddresses] = useState([
    {
      id: "1",
      label: "Home",
      address: "123 Green Street, Vizag - 530001",
      city: "Vizag",
      pincode: "530001",
      landmark: "Near City Park",
      phone: "+91 98765 43210",
      default: true,
      type: "home",
    },
    {
      id: "2",
      label: "Office",
      address: "456 Tech Park, Vizag - 530037",
      city: "Vizag",
      pincode: "530037",
      landmark: "Opposite Metro Station",
      phone: "+91 98765 12345",
      default: false,
      type: "office",
    },
    {
      id: "3",
      label: "Parents Home",
      address: "789 Beach Road, Vizag - 530002",
      city: "Vizag",
      pincode: "530002",
      landmark: "Near Lighthouse",
      phone: "+91 98765 67890",
      default: false,
      type: "home",
    },
  ]);

  const cartTotalWeight = getCartTotalWeight();

  const getProductImage = (product) => {
    // Try to get image by imageKey or name
    if (product.imageKey) {
      return PRODUCT_IMAGES[product.imageKey] || FALLBACK_IMAGE;
    }
    // Try to extract imageKey from product
    const imageKey = product.name.split('(')[0].trim();
    return PRODUCT_IMAGES[imageKey] || FALLBACK_IMAGE;
  };

  const handleCheckout = () => {
    // Check if cart exceeds 30kg limit
    if (cartTotalWeight > 30) {
      setLimitMessage(`Cart exceeds 30kg limit (${cartTotalWeight.toFixed(1)}kg). Please reduce quantity.`);
      setShowLimitToast(true);
      setTimeout(() => setShowLimitToast(false), 3000);
      return;
    }

    // Show success animation
    setShowSuccess(true);
    Animated.sequence([
      Animated.spring(successAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
      }),
      Animated.delay(1500),
      Animated.timing(successAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const newOrder = {
        id: Math.random().toString(36).substr(2, 9),
        items: cart,
        total,
        status: "Pending",
        date: new Date().toLocaleDateString(),
        type: userRole,
        deliveryAddress: selectedAddress,
        totalWeight: cartTotalWeight,
      };
      addOrder(newOrder);
      setShowSuccess(false);
      clearCart();
      router.push("/(tabs)/orders");
    });
  };

  const handleUpdateQuantity = (itemId, newQuantity, item) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    // Check limits before incrementing
    if (newQuantity > (cart.find(i => i.id === itemId)?.quantity || 0)) {
      const itemWeight = getWeightInKg(item.weight);
      const currentItem = cart.find(i => i.id === itemId);
      const currentItemQuantity = currentItem ? currentItem.quantity : 0;
      const newItemTotalWeight = (currentItemQuantity + 1) * itemWeight;

      // Check individual product limit (10kg)
      if (newItemTotalWeight > 10) {
        setLimitMessage(`Cannot add more than 10kg of ${item.name.split('(')[0].trim()}`);
        setShowLimitToast(true);
        setTimeout(() => setShowLimitToast(false), 2000);
        return;
      }

      // Check overall cart limit (30kg)
      const newTotalWeight = cartTotalWeight + itemWeight;
      if (newTotalWeight > 30) {
        const remainingWeight = (30 - (cartTotalWeight - (currentItemQuantity * itemWeight))).toFixed(1);
        setLimitMessage(`Overall cart limit is 30kg. You can add only ${remainingWeight}kg more.`);
        setShowLimitToast(true);
        setTimeout(() => setShowLimitToast(false), 2000);
        return;
      }
    }

    updateQuantity(itemId, newQuantity);
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
  };

  const getAddressTypeIcon = (type) => {
    switch(type) {
      case "home":
        return <Home size={20} color="#124703" />;
      case "office":
        return <Building2 size={20} color="#124703" />;
      default:
        return <MapPin size={20} color="#124703" />;
    }
  };

  const subtotal = cart.reduce((sum, item) => {
    const price =
      userRole === "wholesale"
        ? item.wholesalePrice
        : item.price || item.retailPrice;
    return sum + price * item.quantity;
  }, 0);
  const deliveryFee = userRole === "wholesale" ? 0 : 40;
  const total = subtotal + deliveryFee;

  if (!fontsLoaded) return null;

  if (cart.length === 0) {
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
            My Cart
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "#F5F5F5",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 40,
            marginTop: 20,
          }}
        >
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "#E8F5E9",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <ShoppingBag size={60} color="#81C784" />
          </View>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 22,
              color: "#1B5E20",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Your cart is empty
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 14,
              color: "#757575",
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            Add some fresh groceries to get started
          </Text>
        </View>
      </View>
    );
  }

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
          My Cart
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 14,
            color: "#C8E6C9",
            marginTop: 4,
          }}
        >
          {cart.length} {cart.length === 1 ? "item" : "items"} • {cartTotalWeight.toFixed(1)}kg / 30kg
        </Text>
      </View>

      {/* Limit Warning Toast */}
      {showLimitToast && (
        <Animated.View
          style={{
            position: 'absolute',
            top: insets.top + 100,
            left: 20,
            right: 20,
            backgroundColor: '#C62828',
            borderRadius: 30,
            padding: 16,
            zIndex: 1000,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 14,
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            ⚠️ {limitMessage}
          </Text>
        </Animated.View>
      )}

      <View style={{ flex: 1, backgroundColor: "#F5F5F5", borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: 20 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 16,
            paddingTop: 24,
            paddingBottom: insets.bottom + 200,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Weight Progress Bar */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: "#E0E0E0",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 14,
                  color: "#1B5E20",
                }}
              >
                Cart Weight Limit
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Weight size={16} color="#124703" />
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 14,
                    color: cartTotalWeight > 30 ? "#C62828" : "#124703",
                  }}
                >
                  {cartTotalWeight.toFixed(1)}kg / 30kg
                </Text>
              </View>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: "#E0E0E0",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: 8,
                  width: `${Math.min((cartTotalWeight / 30) * 100, 100)}%`,
                  backgroundColor: cartTotalWeight > 30 ? "#C62828" : "#124703",
                  borderRadius: 4,
                }}
              />
            </View>
            {cartTotalWeight > 30 && (
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 12,
                  color: "#C62828",
                  marginTop: 4,
                }}
              >
                Exceeds 30kg limit. Please reduce quantity.
              </Text>
            )}
          </View>

          {/* Delivery Address */}
          {userRole === "retail" && (
            <TouchableOpacity
              onPress={() => setShowAddressModal(true)}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 16,
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
                  {getAddressTypeIcon(selectedAddress.type)}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 14,
                        color: "#1B5E20",
                      }}
                    >
                      Deliver to {selectedAddress.label}
                    </Text>
                    {selectedAddress.default && (
                      <View
                        style={{
                          backgroundColor: "#E8F5E9",
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          borderRadius: 8,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Star size={10} color="#124703" fill="#124703" />
                        <Text
                          style={{
                            fontFamily: "Inter_600SemiBold",
                            fontSize: 9,
                            color: "#124703",
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
                      fontSize: 12,
                      color: "#757575",
                    }}
                  >
                    {selectedAddress.address}
                  </Text>
                  {selectedAddress.landmark && (
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: 11,
                        color: "#9E9E9E",
                        marginTop: 2,
                      }}
                    >
                      Landmark: {selectedAddress.landmark}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    backgroundColor: "#124703",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 12,
                      color: "#FFFFFF",
                    }}
                  >
                    Change
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* Cart Items */}
          {cart.map((item) => {
            const price =
              userRole === "wholesale"
                ? item.wholesalePrice
                : item.price || item.retailPrice;

            const itemWeight = getWeightInKg(item.weight);
            const totalItemWeight = (itemWeight * item.quantity).toFixed(2);

            return (
              <View
                key={item.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: "#E0E0E0",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              >
                <View style={{ flexDirection: "row", gap: 12 }}>
                  {/* Product Image - Now using actual images */}
                  <Image
                    source={getProductImage(item)}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 35,
                      borderWidth: 2,
                      borderColor: "#BFDD27",
                    }}
                  />

                  {/* Product Details */}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 15,
                        color: "#1B5E20",
                        marginBottom: 4,
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: 12,
                        color: "#757575",
                        marginBottom: 2,
                      }}
                    >
                      {item.weight} each
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: 11,
                        color: "#9E9E9E",
                        marginBottom: 4,
                      }}
                    >
                      Total: {totalItemWeight}kg
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_700Bold",
                        fontSize: 16,
                        color: "#124703",
                      }}
                    >
                      ₹{price} × {item.quantity} = ₹
                      {(price * item.quantity).toFixed(2)}
                    </Text>
                  </View>

                  {/* Delete Button */}
                  <TouchableOpacity
                    onPress={() => removeFromCart(item.id)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: "#FFEBEE",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Trash2 size={18} color="#C62828" />
                  </TouchableOpacity>
                </View>

                {/* Quantity Controls */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    marginTop: 12,
                    gap: 12,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      const newQuantity = item.quantity - 1;
                      handleUpdateQuantity(item.id, newQuantity, item);
                    }}
                    disabled={item.quantity <= 1}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: item.quantity <= 1 ? "#F5F5F5" : "#124703",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Minus
                      size={16}
                      color={item.quantity <= 1 ? "#BDBDBD" : "#FFFFFF"}
                    />
                  </TouchableOpacity>

                  <View
                    style={{
                      minWidth: 40,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      backgroundColor: "#F5F5F5",
                      borderRadius: 12,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter_700Bold",
                        fontSize: 16,
                        color: "#1B5E20",
                      }}
                    >
                      {item.quantity}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      const newQuantity = item.quantity + 1;
                      handleUpdateQuantity(item.id, newQuantity, item);
                    }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "#124703",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Plus size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Bottom Summary */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#FFFFFF",
            paddingTop: 16,
            paddingBottom: insets.bottom + 16,
            paddingHorizontal: 20,
            borderTopWidth: 1,
            borderTopColor: "#E0E0E0",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 10,
          }}
        >
          {/* Price Details */}
          <View style={{ gap: 8, marginBottom: 16 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                  color: "#757575",
                }}
              >
                Subtotal ({cartTotalWeight.toFixed(1)}kg)
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 14,
                  color: "#1B5E20",
                }}
              >
                ₹{subtotal.toFixed(2)}
              </Text>
            </View>

            {userRole === "retail" && (
              <View
                style={{ flexDirection: "row", justifyContent: "space-between" }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: 14,
                    color: "#757575",
                  }}
                >
                  Delivery Fee
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 14,
                    color: "#1B5E20",
                  }}
                >
                  ₹{deliveryFee.toFixed(2)}
                </Text>
              </View>
            )}

            <View
              style={{
                height: 1,
                backgroundColor: "#E0E0E0",
                marginVertical: 4,
              }}
            />

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 16,
                  color: "#1B5E20",
                }}
              >
                Total
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 18,
                  color: "#124703",
                }}
              >
                ₹{total.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Checkout Button */}
          <TouchableOpacity
            onPress={handleCheckout}
            disabled={cartTotalWeight > 30}
            style={{
              backgroundColor: cartTotalWeight > 30 ? "#BDBDBD" : "#124703",
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: "center",
              opacity: cartTotalWeight > 30 ? 0.7 : 1,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              {cartTotalWeight > 30
                ? "Exceeds 30kg Limit"
                : userRole === "wholesale"
                  ? "Submit Order"
                  : "Proceed to Checkout"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Address Selection Modal */}
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
                Select Delivery Address
              </Text>
              <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                <X size={24} color="#757575" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {addresses.map((address) => (
                <TouchableOpacity
                  key={address.id}
                  onPress={() => handleSelectAddress(address)}
                  style={{
                    backgroundColor: selectedAddress.id === address.id ? "#E8F5E9" : "#FFFFFF",
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                    borderWidth: 2,
                    borderColor: selectedAddress.id === address.id ? "#124703" : "#E0E0E0",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
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
                      {getAddressTypeIcon(address.type)}
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <Text
                          style={{
                            fontFamily: "Inter_700Bold",
                            fontSize: 16,
                            color: "#1B5E20",
                          }}
                        >
                          {address.label}
                        </Text>
                        {address.default && (
                          <View
                            style={{
                              backgroundColor: "#124703",
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                              borderRadius: 8,
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
                          marginBottom: 2,
                        }}
                      >
                        {address.address}
                      </Text>

                      <Text
                        style={{
                          fontFamily: "Inter_400Regular",
                          fontSize: 13,
                          color: "#757575",
                          marginBottom: 2,
                        }}
                      >
                        {address.city} - {address.pincode}
                      </Text>

                      {address.landmark && (
                        <Text
                          style={{
                            fontFamily: "Inter_400Regular",
                            fontSize: 12,
                            color: "#9E9E9E",
                            marginBottom: 4,
                          }}
                        >
                          Landmark: {address.landmark}
                        </Text>
                      )}

                      <Text
                        style={{
                          fontFamily: "Inter_400Regular",
                          fontSize: 13,
                          color: "#124703",
                        }}
                      >
                        Phone: {address.phone}
                      </Text>
                    </View>

                    {selectedAddress.id === address.id && (
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: "#124703",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Check size={16} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={() => {
                  setShowAddressModal(false);
                  Alert.alert(
                    "Add Address",
                    "Please add address from Profile section",
                    [
                      { text: "OK" },
                      {
                        text: "Go to Profile",
                        onPress: () => {
                          router.push("/(tabs)/profile");
                        }
                      }
                    ]
                  );
                }}
                style={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: 16,
                  padding: 16,
                  alignItems: "center",
                  marginTop: 8,
                  marginBottom: 16,
                  borderWidth: 2,
                  borderColor: "#124703",
                  borderStyle: "dashed",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 16,
                    color: "#124703",
                  }}
                >
                  + Add New Address
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Overlay */}
      {showSuccess && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            alignItems: "center",
            justifyContent: "center",
            opacity: successAnim,
          }}
        >
          <Animated.View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 24,
              padding: 40,
              alignItems: "center",
              transform: [
                {
                  scale: successAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#E8F5E9",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 40 }}>✓</Text>
            </View>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 22,
                color: "#124703",
                marginBottom: 8,
              }}
            >
              Order Placed!
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: "#757575",
                textAlign: "center",
              }}
            >
              Your order has been successfully placed
            </Text>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}
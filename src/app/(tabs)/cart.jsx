import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Trash2, Plus, Minus, ShoppingBag, MapPin } from "lucide-react-native";
import { useStore } from "@/store/useStore";
import { useRouter } from "expo-router";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

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
    updateCartQuantity,
    removeFromCart,
    clearCart,
    userRole,
    addOrder,
  } = useStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const successAnim = useRef(new Animated.Value(0)).current;

  const handleCheckout = () => {
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
      };
      addOrder(newOrder);
      setShowSuccess(false);
      clearCart();
      router.push("/(tabs)/orders");
    });
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
          {cart.length} {cart.length === 1 ? "item" : "items"}
        </Text>
      </View>

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
          {/* Delivery Address */}
          {userRole === "retail" && (
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
                  <MapPin size={20} color="#2E7D32" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 14,
                      color: "#1B5E20",
                      marginBottom: 2,
                    }}
                  >
                    Deliver to Home
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 12,
                      color: "#757575",
                    }}
                  >
                    123 Green Street, vizag - 560001
                  </Text>
                </View>
                <TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 13,
                      color: "#2E7D32",
                    }}
                  >
                    Change
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Cart Items */}
          {cart.map((item) => {
            const price =
              userRole === "wholesale"
                ? item.wholesalePrice
                : item.price || item.retailPrice;
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
                }}
              >
                <View style={{ flexDirection: "row", gap: 12 }}>
                  {/* Product Image */}
                  <View
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 35,
                      backgroundColor: "#F5F5F5",
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 2,
                      borderColor: "#FFEB3B",
                    }}
                  >
                    <Text style={{ fontSize: 32 }}>{item.image}</Text>
                  </View>

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
                        marginBottom: 8,
                      }}
                    >
                      {item.weight}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_700Bold",
                        fontSize: 16,
                        color: "#2E7D32",
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
                    onPress={() =>
                      updateCartQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    disabled={item.quantity <= 1}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: item.quantity <= 1 ? "#F5F5F5" : "#2E7D32",
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
                    onPress={() => updateCartQuantity(item.id, item.quantity + 1)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "#2E7D32",
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
                Subtotal
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
                  color: "#2E7D32",
                }}
              >
                ₹{total.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Checkout Button */}
          <TouchableOpacity
            onPress={handleCheckout}
            style={{
              backgroundColor: "#2E7D32",
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              {userRole === "wholesale" ? "Submit Order" : "Proceed to Checkout"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

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
                color: "#2E7D32",
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
import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react-native";
import { useStore } from "@/store/useStore";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const { orders, userRole, cancelOrder } = useStore();

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return { Icon: Clock, color: "#FF9800" };
      case "Processing":
        return { Icon: Package, color: "#2196F3" };
      case "Shipped":
        return { Icon: Truck, color: "#9C27B0" };
      case "Delivered":
        return { Icon: CheckCircle, color: "#124703" };
      case "Cancelled":
        return { Icon: XCircle, color: "#C62828" };
      default:
        return { Icon: Clock, color: "#757575" };
    }
  };

  const handleCancelOrder = (orderId) => {
    Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: () => {
          cancelOrder(orderId);
          Alert.alert(
            "Order Cancelled",
            "Your order has been cancelled successfully",
          );
        },
      },
    ]);
  };

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#124703" }}>
      <StatusBar style="light" backgroundColor="#124703" />

      {/* Header with proper insets */}
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
          My Orders
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 14,
            color: "#C8E6C9",
            marginTop: 4,
          }}
        >
          {orders.length} {orders.length === 1 ? "order" : "orders"} in total
        </Text>
      </View>

      {/* Content area with white background for scrollable content */}
      {orders.length === 0 ? (
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
            No Orders Yet
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
            Your order history will appear here
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: "#F5F5F5", borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: 20 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: insets.bottom + 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            {orders.map((order) => {
              const { Icon, color } = getStatusIcon(order.status);
              return (
                <View
                  key={order.id}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 20,
                    padding: 16,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: "#E0E0E0",
                  }}
                >
                  {/* Order Header */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 16,
                      paddingBottom: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: "#F5F5F5",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontFamily: "Inter_700Bold",
                          fontSize: 16,
                          color: "#1B5E20",
                          marginBottom: 4,
                        }}
                      >
                        Order #{order.id}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Inter_400Regular",
                          fontSize: 13,
                          color: "#757575",
                        }}
                      >
                        {order.date}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: `${color}15`,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 20,
                        gap: 6,
                      }}
                    >
                      <Icon size={16} color={color} />
                      <Text
                        style={{
                          fontFamily: "Inter_600SemiBold",
                          fontSize: 12,
                          color: color,
                        }}
                      >
                        {order.status}
                      </Text>
                    </View>
                  </View>

                  {/* Order Items */}
                  <View style={{ marginBottom: 12 }}>
                    {order.items.slice(0, 2).map((item, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 8,
                          gap: 12,
                        }}
                      >
                        <View
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: "#F5F5F5",
                            alignItems: "center",
                            justifyContent: "center",
                            borderWidth: 2,
                            borderColor: "#BFDD27",
                          }}
                        >
                          <Text style={{ fontSize: 24 }}>{item.image}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontFamily: "Inter_600SemiBold",
                              fontSize: 14,
                              color: "#1B5E20",
                            }}
                          >
                            {item.name}
                          </Text>
                          <Text
                            style={{
                              fontFamily: "Inter_400Regular",
                              fontSize: 12,
                              color: "#757575",
                            }}
                          >
                            Qty: {item.quantity}
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontFamily: "Inter_700Bold",
                            fontSize: 14,
                            color: "#124703",
                          }}
                        >
                          ₹{(item.price || item.retailPrice) * item.quantity}
                        </Text>
                      </View>
                    ))}
                    {order.items.length > 2 && (
                      <Text
                        style={{
                          fontFamily: "Inter_400Regular",
                          fontSize: 12,
                          color: "#757575",
                          marginTop: 4,
                        }}
                      >
                        +{order.items.length - 2} more items
                      </Text>
                    )}
                  </View>

                  {/* Order Footer */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: 12,
                      borderTopWidth: 1,
                      borderTopColor: "#F5F5F5",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontFamily: "Inter_400Regular",
                          fontSize: 12,
                          color: "#757575",
                          marginBottom: 4,
                        }}
                      >
                        Total Amount
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Inter_700Bold",
                          fontSize: 20,
                          color: "#1B5E20",
                        }}
                      >
                        ₹{order.total.toFixed(2)}
                      </Text>
                    </View>

                    {order.status === "Pending" && userRole === "retail" && (
                      <TouchableOpacity
                        onPress={() => handleCancelOrder(order.id)}
                        style={{
                          backgroundColor: "#FFEBEE",
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: "#C62828",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Inter_600SemiBold",
                            fontSize: 13,
                            color: "#C62828",
                          }}
                        >
                          Cancel Order
                        </Text>
                      </TouchableOpacity>
                    )}

                    {order.status === "Delivered" && (
                      <TouchableOpacity
                        onPress={() =>
                          Alert.alert("Reorder", "Item will be added to cart")
                        }
                        style={{
                          backgroundColor: "#124703",
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 12,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Inter_600SemiBold",
                            fontSize: 13,
                            color: "#FFFFFF",
                          }}
                        >
                          Reorder
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
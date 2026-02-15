import { View, Text, ScrollView, TouchableOpacity, Image, FlatList } from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, ShoppingCart, Plus, Star, Minus } from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useStore } from "@/store/useStore";
import { useRouter } from "expo-router";

// Local images for categories
const CATEGORY_IMAGES = {
  pulao: require("../../assets/images/pulao.png"),
  fry: require("../../assets/images/pulao.png"),
  salads: require("../../assets/images/pulao.png"),
  snacks: require("../../assets/images/pulao.png"),
  fried: require("../../assets/images/pulao.png"),
};

// Local images for products
const PRODUCT_IMAGES = {
  "Farmers Special Pulao": require("../../assets/images/pulao.png"),
  "Veg Biryani": require("../../assets/images/pulao.png"),
  "Crispy Fish Fry": require("../../assets/images/pulao.png"),
  "Chicken Fry": require("../../assets/images/pulao.png"),
  "Fresh Garden Salad": require("../../assets/images/pulao.png"),
  "Samosa": require("../../assets/images/pulao.png"),
  "Prawns Fry": require("../../assets/images/pulao.png"),
};

const FALLBACK_IMAGE = require("../../assets/images/pulao.png");

const KOVERA_CATEGORIES = [
  { id: "pulao", name: "Pulao", image: require("../../assets/images/pulao.png") },
  { id: "fry", name: "Fry", image: require("../../assets/images/pulao.png") },
  { id: "salads", name: "Salads", image: require("../../assets/images/pulao.png") },
  { id: "snacks", name: "Snacks", image: require("../../assets/images/pulao.png") },
  { id: "fried", name: "Air/Oil Fried", image: require("../../assets/images/pulao.png") },
];

const DUMMY_KOVERA_FOOD = {
  pulao: [
    {
      id: "k1",
      name: "Farmers Special Pulao",
      category: "Pulao",
      price: 280,
      rating: 4.8,
      imageKey: "Farmers Special Pulao",
      tag: "Bestseller",
    },
    {
      id: "k2",
      name: "Veg Biryani",
      category: "Pulao",
      price: 250,
      rating: 4.7,
      imageKey: "Veg Biryani",
      tag: "Popular",
    },
  ],
  fry: [
    {
      id: "k3",
      name: "Crispy Fish Fry",
      category: "Fry",
      price: 350,
      rating: 4.9,
      imageKey: "Crispy Fish Fry",
      tag: "Chef's Special",
    },
    {
      id: "k4",
      name: "Chicken Fry",
      category: "Fry",
      price: 320,
      rating: 4.8,
      imageKey: "Chicken Fry",
      tag: "Bestseller",
    },
  ],
  salads: [
    {
      id: "k5",
      name: "Fresh Garden Salad",
      category: "Salads",
      price: 150,
      rating: 4.6,
      imageKey: "Fresh Garden Salad",
      tag: "Healthy",
    },
  ],
  snacks: [
    {
      id: "k6",
      name: "Samosa",
      category: "Snacks",
      price: 40,
      rating: 4.5,
      imageKey: "Samosa",
      tag: "Popular",
    },
  ],
  fried: [
    {
      id: "k7",
      name: "Prawns Fry",
      category: "Fried",
      price: 380,
      rating: 4.9,
      imageKey: "Prawns Fry",
      tag: "Chef's Special",
    },
  ],
};

export default function KoveraFoodPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [selectedCategory, setSelectedCategory] = useState("pulao");
  const [quantities, setQuantities] = useState({});
  const { koveraLocation, cart, addToCart, updateQuantity } = useStore();

  const products = DUMMY_KOVERA_FOOD[selectedCategory] || [];
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItems = cart.filter(item => item.quantity > 0);

  const getProductImage = (imageKey) => {
    return PRODUCT_IMAGES[imageKey] || FALLBACK_IMAGE;
  };

  const getCartItemCount = (productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const handleIncrement = (product) => {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      addToCart({
        ...product,
        quantity: 1,
        price: product.price,
      });
    }
  };

  const handleDecrement = (productId) => {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem && existingItem.quantity > 1) {
      updateQuantity(productId, existingItem.quantity - 1);
    } else if (existingItem && existingItem.quantity === 1) {
      updateQuantity(productId, 0);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 16,
          paddingHorizontal: 16,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F0",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#F5F5F5",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowLeft size={20} color="#333333" />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 18,
                color: "#333333",
              }}
            >
             FRESCO
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 12,
                color: "#666666",
                marginTop: 2,
              }}
            >
              {koveraLocation || "Home • 20-30 mins"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/cart")}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#F5F5F5",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <ShoppingCart size={20} color="#333333" />
            {cartCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: "#FF6B6B",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1.5,
                  borderColor: "#FFFFFF",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 10,
                    color: "#FFFFFF",
                  }}
                >
                  {cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Pills with Images */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingVertical: 16,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F0",
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          {KOVERA_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={{
                backgroundColor: selectedCategory === cat.id ? "#FF6B6B" : "#FFFFFF",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 25,
                borderWidth: 1,
                borderColor: selectedCategory === cat.id ? "#FF6B6B" : "#E0E0E0",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Image
                source={cat.image}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                }}
              />
              <Text
                style={{
                  fontFamily: selectedCategory === cat.id ? "Inter_600SemiBold" : "Inter_500Medium",
                  fontSize: 13,
                  color: selectedCategory === cat.id ? "#FFFFFF" : "#666666",
                }}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Food Items */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: cartItems.length > 0 ? 100 : insets.bottom + 20,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {products.map((item) => {
          const itemCount = getCartItemCount(item.id);

          return (
            <View
              key={item.id}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#F0F0F0",
                overflow: "hidden",
              }}
            >
              {/* Tag if exists */}
              {item.tag && (
                <View
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    backgroundColor: "#FF6B6B",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                    zIndex: 1,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 10,
                      color: "#FFFFFF",
                    }}
                  >
                    {item.tag}
                  </Text>
                </View>
              )}

              <View style={{ flexDirection: "row", padding: 12 }}>
                {/* Product Image */}
                <Image
                  source={getProductImage(item.imageKey)}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 12,
                    marginRight: 12,
                  }}
                />

                {/* Product Details */}
                <View style={{ flex: 1 }}>
                  {/* Rating */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      marginBottom: 4,
                    }}
                  >
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: 12,
                        color: "#666666",
                      }}
                    >
                      {item.rating} (634)
                    </Text>
                  </View>

                  {/* Product Name */}
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      fontSize: 15,
                      color: "#333333",
                      marginBottom: 4,
                    }}
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>

                  {/* Nutrition Info */}
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: 12,
                      color: "#666666",
                      marginBottom: 8,
                    }}
                  >
                    22g protein • 366 kcal
                  </Text>

                  {/* Price and Add Button */}
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Text
                        style={{
                          fontFamily: "Inter_700Bold",
                          fontSize: 16,
                          color: "#333333",
                        }}
                      >
                        ₹{item.price}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Inter_400Regular",
                          fontSize: 13,
                          color: "#999999",
                          textDecorationLine: "line-through",
                        }}
                      >
                        ₹{item.price + 20}
                      </Text>
                    </View>

                    {itemCount === 0 ? (
                      <TouchableOpacity
                        onPress={() => handleIncrement(item)}
                        style={{
                          backgroundColor: "#FFFFFF",
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 20,
                          borderWidth: 1,
                          borderColor: "#FF6B6B",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Inter_600SemiBold",
                            fontSize: 13,
                            color: "#FF6B6B",
                          }}
                        >
                          ADD
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "#FFFFFF",
                          borderRadius: 20,
                          borderWidth: 1,
                          borderColor: "#FF6B6B",
                          padding: 4,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => handleDecrement(item.id)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 14,
                            backgroundColor: itemCount === 1 ? "#F5F5F5" : "#FF6B6B",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Minus
                            size={14}
                            color={itemCount === 1 ? "#999999" : "#FFFFFF"}
                          />
                        </TouchableOpacity>

                        <Text
                          style={{
                            fontFamily: "Inter_700Bold",
                            fontSize: 14,
                            color: "#333333",
                            minWidth: 30,
                            textAlign: "center",
                          }}
                        >
                          {itemCount}
                        </Text>

                        <TouchableOpacity
                          onPress={() => handleIncrement(item)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 14,
                            backgroundColor: "#FF6B6B",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Plus size={14} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom Cart Bar - Exactly like the image */}
      {cartItems.length > 0 && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#FFFFFF",
            paddingTop: 12,
            paddingBottom: insets.bottom + 12,
            paddingHorizontal: 16,
            borderTopWidth: 1,
            borderTopColor: "#F0F0F0",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 15,
                  color: "#333333",
                }}
              >
                {cartCount} Item added
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 13,
                  color: "#666666",
                  marginTop: 2,
                }}
              >
                Total: ₹{cartTotal}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/cart")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 15,
                  color: "#FF6B6B",
                }}
              >
                View Cart
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 15,
                  color: "#FF6B6B",
                }}
              >
                ›
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
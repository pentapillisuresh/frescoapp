import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ShoppingCart, Plus, Minus, X, ArrowLeft, Clock, Flame, Snowflake, Package } from "lucide-react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useStore } from "@/store/useStore";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 120 - 24) / 2;

// Filter buttons data
const FILTER_BUTTONS = [
  { id: "fresh", name: "Fresh", icon: Flame },
  { id: "frozen", name: "Frozen", icon: Snowflake },
  { id: "instant", name: "Instant", icon: Package },
  { id: "other", name: "Other", icon: Package },
];

// Local images
const PRODUCT_IMAGES = {
  "Red Capsicum": require("../../assets/images/redcap.png"),
  "Broccoli": require("../../assets/images/broccoli.webp"),
  "Zucchini": require("../../assets/images/zucchini.webp"),
  "Tomato": require("../../assets/images/tomoto.webp"),
  "Onion": require("../../assets/images/onion.webp"),
  "Potato": require("../../assets/images/potato.webp"),
  "Apple": require("../../assets/images/apple.webp"),
  "dragon": require("../../assets/images/dragon.avif"),
  "Banana": require("../../assets/images/banana.webp"),
  "Orange": require("../../assets/images/orange.webp"),
  "Milk": require("../../assets/images/milk.avif"),
  "Paneer": require("../../assets/images/panner.avif"),
  "Curd": require("../../assets/images/curd.avif"),
  "Soya Chunks": require("../../assets/images/soya.avif"),
  "Tofu": require("../../assets/images/tofu.avif"),
  "Chips": require("../../assets/images/chips.avif"),
  "Biscuits": require("../../assets/images/biscuit.avif"),
  "Prawns Small": require("../../assets/images/prawns.avif"),
  "Prawns Medium": require("../../assets/images/prawns1.avif"),
  "Prawns Large": require("../../assets/images/prawns.avif"),
  "Green Chilli": require("../../assets/images/greenchilli.webp"),
  "Coriander Bunch": require("../../assets/images/kottimeera.webp"),
};

const FALLBACK_IMAGE = require("../../assets/images/redcap.png");

// Categories with updated names
const CATEGORIES = [
  { id: "all", name: "All", image: require("../../assets/images/all.jpg") },
  { id: "exotics", name: "Exotics", image: require("../../assets/images/exotics.jpg") },
  { id: "vegetables", name: "Vegetables", image: require("../../assets/images/vegtables.jpg") },
  { id: "dairy", name: "Dairy", image: require("../../assets/images/dairy.jpg") },
  { id: "fried-onion", name: "Fried Onion", image: require("../../assets/images/friedonion.jpg") },
  { id: "veg", name: "Veg", image: require("../../assets/images/veg1.jpg") },
  { id: "snacks", name: "Snacks", image: require("../../assets/images/snacks.jpg") },
  { id: "veg-meat", name: "Veg meat", image: require("../../assets/images/veg.webp") },
  { id: "seafood", name: "Seafood", image: require("../../assets/images/seafood.jpg") },
  { id: "snacks-fruits", name: "Snacks Fruits", image: require("../../assets/images/fruits.jpg") },
];

const DUMMY_PRODUCTS = [
  {
    id: "1",
    name: "Green Chilli (Mirapakaya)",
    mrp: 12,
    retailPrice: 11,
    wholesalePrice: 10,
    weight: "100 g",
    discount: "8",
    time: "8 MINS",
    category: "vegetables",
    imageKey: "Green Chilli"
  },
  {
    id: "2",
    name: "Banana (Aratipandu)",
    mrp: 31,
    retailPrice: 26,
    wholesalePrice: 24,
    weight: "3 units",
    discount: "16",
    time: "8 MINS",
    category: "snacks-fruits",
    imageKey: "Banana"
  },
  {
    id: "3",
    name: "Onion (Ulligadda)",
    mrp: 35,
    retailPrice: 28,
    wholesalePrice: 25,
    weight: "1000 g",
    discount: "20",
    time: "8 MINS",
    category: "vegetables",
    imageKey: "Onion"
  },
  {
    id: "4",
    name: "Coriander Bunch (Kottimeera)",
    mrp: 11,
    retailPrice: 7,
    wholesalePrice: 6,
    weight: "100 g",
    discount: "36",
    time: "8 MINS",
    category: "exotics",
    imageKey: "Coriander Bunch"
  },
  {
    id: "5",
    name: "Tomato (Tamata)",
    mrp: 25,
    retailPrice: 20,
    wholesalePrice: 18,
    weight: "500 g",
    discount: "20",
    time: "8 MINS",
    category: "vegetables",
    imageKey: "Tomato"
  },
  {
    id: "6",
    name: "Potato (Alugadda)",
    mrp: 30,
    retailPrice: 25,
    wholesalePrice: 22,
    weight: "1 kg",
    discount: "17",
    time: "8 MINS",
    category: "vegetables",
    imageKey: "Potato"
  },
  {
    id: "7",
    name: "Apple (Seebu)",
    mrp: 180,
    retailPrice: 150,
    wholesalePrice: 140,
    weight: "500 g",
    discount: "17",
    time: "8 MINS",
    category: "snacks-fruits",
    imageKey: "Apple"
  },
  {
    id: "8",
    name: "Orange (Naranga)",
    mrp: 100,
    retailPrice: 85,
    wholesalePrice: 80,
    weight: "500 g",
    discount: "15",
    time: "8 MINS",
    category: "snacks-fruits",
    imageKey: "Orange"
  },
  {
    id: "9",
    name: "Milk (Palu)",
    mrp: 60,
    retailPrice: 54,
    wholesalePrice: 50,
    weight: "1 L",
    discount: "10",
    time: "8 MINS",
    category: "dairy",
    imageKey: "Milk"
  },
  {
    id: "10",
    name: "Paneer (Chenna)",
    mrp: 120,
    retailPrice: 100,
    wholesalePrice: 95,
    weight: "250 g",
    discount: "17",
    time: "8 MINS",
    category: "dairy",
    imageKey: "Paneer"
  },
  {
    id: "11",
    name: "Curd (Perugu)",
    mrp: 45,
    retailPrice: 40,
    wholesalePrice: 38,
    weight: "500 g",
    discount: "11",
    time: "8 MINS",
    category: "dairy",
    imageKey: "Curd"
  },
  {
    id: "12",
    name: "Fried Onion (Vulli Paayalu)",
    mrp: 85,
    retailPrice: 75,
    wholesalePrice: 70,
    weight: "200 g",
    discount: "12",
    time: "8 MINS",
    category: "fried-onion",
    imageKey: "Onion"
  },
  {
    id: "13",
    name: "Soya Chunks",
    mrp: 90,
    retailPrice: 80,
    wholesalePrice: 75,
    weight: "500 g",
    discount: "11",
    time: "8 MINS",
    category: "veg",
    imageKey: "Soya Chunks"
  },
  {
    id: "14",
    name: "Tofu",
    mrp: 110,
    retailPrice: 95,
    wholesalePrice: 90,
    weight: "250 g",
    discount: "14",
    time: "8 MINS",
    category: "veg",
    imageKey: "Tofu"
  },
  {
    id: "15",
    name: "Chips (Alu Chips)",
    mrp: 40,
    retailPrice: 35,
    wholesalePrice: 32,
    weight: "150 g",
    discount: "13",
    time: "8 MINS",
    category: "snacks",
    imageKey: "Chips"
  },
  {
    id: "16",
    name: "Biscuits",
    mrp: 30,
    retailPrice: 25,
    wholesalePrice: 23,
    weight: "200 g",
    discount: "17",
    time: "8 MINS",
    category: "snacks",
    imageKey: "Biscuits"
  },
  {
    id: "17",
    name: "Veg Meat (Plant Based)",
    mrp: 150,
    retailPrice: 135,
    wholesalePrice: 125,
    weight: "250 g",
    discount: "10",
    time: "8 MINS",
    category: "veg-meat",
    imageKey: "Soya Chunks"
  },
  {
    id: "18",
    name: "Prawns Small (Royyalu)",
    mrp: 280,
    retailPrice: 250,
    wholesalePrice: 235,
    weight: "250 g",
    discount: "11",
    time: "8 MINS",
    category: "seafood",
    imageKey: "Prawns Small"
  },
  {
    id: "19",
    name: "Prawns Medium (Royyalu)",
    mrp: 350,
    retailPrice: 320,
    wholesalePrice: 300,
    weight: "250 g",
    discount: "9",
    time: "8 MINS",
    category: "seafood",
    imageKey: "Prawns Medium"
  },
  {
    id: "20",
    name: "Prawns Large (Royyalu)",
    mrp: 420,
    retailPrice: 380,
    wholesalePrice: 360,
    weight: "250 g",
    discount: "10",
    time: "8 MINS",
    category: "seafood",
    imageKey: "Prawns Large"
  },
  {
    id: "21",
    name: "Broccoli",
    mrp: 80,
    retailPrice: 70,
    wholesalePrice: 65,
    weight: "250 g",
    discount: "13",
    time: "8 MINS",
    category: "exotics",
    imageKey: "Broccoli"
  },
  {
    id: "22",
    name: "Zucchini",
    mrp: 75,
    retailPrice: 65,
    wholesalePrice: 60,
    weight: "250 g",
    discount: "13",
    time: "8 MINS",
    category: "exotics",
    imageKey: "Zucchini"
  },
  {
    id: "23",
    name: "Red Capsicum",
    mrp: 60,
    retailPrice: 52,
    wholesalePrice: 48,
    weight: "250 g",
    discount: "13",
    time: "8 MINS",
    category: "exotics",
    imageKey: "Red Capsicum"
  },
  {
    id: "24",
    name: "Dragon Fruit",
    mrp: 120,
    retailPrice: 100,
    wholesalePrice: 95,
    weight: "1 unit",
    discount: "17",
    time: "8 MINS",
    category: "snacks-fruits",
    imageKey: "dragon"
  },
];

export default function CategoriesPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("fresh");
  const [cartAnimation] = useState(new Animated.Value(1));

  const { userRole, cart, addToCart, updateQuantity } = useStore();

  // Animate cart icon when item added
  useEffect(() => {
    if (cartCount > 0) {
      Animated.sequence([
        Animated.timing(cartAnimation, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(cartAnimation, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [cartCount]);

  // Filter products by category
  const products = selectedCategory === "all"
    ? DUMMY_PRODUCTS
    : DUMMY_PRODUCTS.filter(p => p.category === selectedCategory);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const getProductImage = (product) => {
    return PRODUCT_IMAGES[product.imageKey] || FALLBACK_IMAGE;
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
        id: product.id,
        name: product.name,
        price: userRole === "wholesale" ? product.wholesalePrice : product.retailPrice,
        quantity: 1,
        weight: product.weight,
        image: getProductImage(product),
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
          paddingBottom: 12,
          paddingHorizontal: 16,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#E5E9F0",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: "#F8F9FA",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowLeft size={22} color="#1E293B" />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <View style={{
              backgroundColor: "#F8F9FA",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 15,
                  color: "#64748B",
                }}
              >
                🔍 Search for atta, dal, and more
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/cart")}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: "#2E7D32",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Animated.View style={{ transform: [{ scale: cartAnimation }] }}>
              <ShoppingCart size={22} color="#FFFFFF" />
            </Animated.View>
            {cartCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  minWidth: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: "#FF6B6B",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: "#FFFFFF",
                  paddingHorizontal: 4,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: 11,
                    color: "#FFFFFF",
                  }}
                >
                  {cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Filter Buttons - Fresh, Frozen, Instant, Other */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 16,
            gap: 8,
          }}
        >
          {FILTER_BUTTONS.map((filter) => {
            const Icon = filter.icon;
            const isSelected = selectedFilter === filter.id;

            return (
              <TouchableOpacity
                key={filter.id}
                onPress={() => setSelectedFilter(filter.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 30,
                  backgroundColor: isSelected ? "#2E7D32" : "#F8F9FA",
                  borderWidth: 1,
                  borderColor: isSelected ? "#2E7D32" : "#E5E9F0",
                }}
              >
                <Icon
                  size={16}
                  color={isSelected ? "#FFFFFF" : "#64748B"}
                />
                <Text
                  style={{
                    fontFamily: isSelected ? "Inter_600SemiBold" : "Inter_500Medium",
                    fontSize: 13,
                    color: isSelected ? "#FFFFFF" : "#1E293B",
                  }}
                >
                  {filter.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Content */}
      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Left Sidebar - Categories with round images */}
        <View style={{
          width: 120,
          backgroundColor: "#FFFFFF",
          borderRightWidth: 1,
          borderRightColor: "#E5E9F0",
        }}>
          <FlatList
            data={CATEGORIES}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedCategory(item.id)}
                activeOpacity={0.7}
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 8,
                  backgroundColor: selectedCategory === item.id ? "#E8F5E9" : "transparent",
                  alignItems: "center",
                  borderRightWidth: 3,
                  borderRightColor: selectedCategory === item.id ? "#2E7D32" : "transparent",
                }}
              >
                <Image
                  source={item.image}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    marginBottom: 8,
                    borderWidth: 2,
                    borderColor: selectedCategory === item.id ? "#2E7D32" : "#E5E9F0",
                  }}
                />
                <Text
                  style={{
                    fontFamily: selectedCategory === item.id ? "Inter_600SemiBold" : "Inter_500Medium",
                    fontSize: 12,
                    color: selectedCategory === item.id ? "#2E7D32" : "#64748B",
                    textAlign: "center",
                  }}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Products Grid */}
        <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 12 }}
            contentContainerStyle={{
              paddingVertical: 12,
              paddingBottom: insets.bottom + 20, // Normal padding without cart bar
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const itemCount = getCartItemCount(item.id);

              return (
                <View
                  style={{
                    width: CARD_WIDTH,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 16,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: "#E5E9F0",
                    overflow: "hidden",
                  }}
                >
                  {/* Product Image - No badges */}
                  <Image
                    source={getProductImage(item)}
                    style={{
                      width: "100%",
                      height: CARD_WIDTH,
                      resizeMode: "cover",
                    }}
                  />

                  {/* Product Details - Fixed height to prevent button movement */}
                  <View style={{
                    padding: 10,
                    height: 130, // Reduced height for card
                    justifyContent: 'space-between',
                  }}>
                    <View>
                      <Text
                        style={{
                          fontFamily: "Inter_500Medium",
                          fontSize: 10,
                          color: "#64748B",
                          marginBottom: 2,
                        }}
                      >
                        {item.weight}
                      </Text>

                      <Text
                        style={{
                          fontFamily: "Inter_600SemiBold",
                          fontSize: 13,
                          color: "#1E293B",
                          marginBottom: 4,
                          height: 36, // Reduced height for name (2 lines)
                        }}
                        numberOfLines={2}
                      >
                        {item.name}
                      </Text>

                      {/* Price Row */}
                      <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 6,
                      }}>
                        <Text
                          style={{
                            fontFamily: "Inter_700Bold",
                            fontSize: 14,
                            color: "#2E7D32",
                          }}
                        >
                          ₹{userRole === "wholesale" ? item.wholesalePrice : item.retailPrice}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Inter_400Regular",
                            fontSize: 11,
                            color: "#94A3B8",
                            textDecorationLine: "line-through",
                          }}
                        >
                          ₹{item.mrp}
                        </Text>
                      </View>
                    </View>

                    {/* Add/Quantity Controls - Fixed position at bottom */}
                    {itemCount === 0 ? (
                      <TouchableOpacity
                        onPress={() => handleIncrement(item)}
                        style={{
                          backgroundColor: "#FFFFFF",
                          paddingVertical: 6,
                          borderRadius: 25,
                          alignItems: "center",
                          borderWidth: 1.5,
                          borderColor: "#2E7D32",
                          flexDirection: "row",
                          justifyContent: "center",
                          gap: 4,
                          height: 34, // Reduced height
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Inter_600SemiBold",
                            fontSize: 12,
                            color: "#2E7D32",
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
                          justifyContent: "space-between",
                          backgroundColor: "#FFFFFF",
                          borderRadius: 25,
                          borderWidth: 1.5,
                          borderColor: "#2E7D32",
                          padding: 3,
                          height: 34, // Reduced height
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => handleDecrement(item.id)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 14,
                            backgroundColor: itemCount === 1 ? "#F8F9FA" : "#2E7D32",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Minus
                            size={14}
                            color={itemCount === 1 ? "#94A3B8" : "#FFFFFF"}
                          />
                        </TouchableOpacity>

                        <Text
                          style={{
                            fontFamily: "Inter_700Bold",
                            fontSize: 13,
                            color: "#1E293B",
                            minWidth: 28,
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
                            backgroundColor: "#2E7D32",
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
              );
            }}
          />
        </View>
      </View>

      {/* No bottom view cart bar - completely removed */}
    </View>
  );
}
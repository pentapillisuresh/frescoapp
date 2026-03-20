import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  FlatList,
  Easing,
  UIManager,
  Platform,
  LayoutAnimation,
} from "react-native";
import { useState, useRef, useEffect } from "react";
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

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const { width } = Dimensions.get("window");

// Local images for categories
const CATEGORY_IMAGES = {
  pulao: require("../../assets/images/pulao.png"),
  fry: require("../../assets/images/fish1.jpg"),
  salads: require("../../assets/images/salad1.jpg"),
  snacks: require("../../assets/images/snack1.jpg"),
  fried: require("../../assets/images/chicken2.jpg"),
  biryani: require("../../assets/images/pulao2.jpg"),
  curries: require("../../assets/images/curry1.jpg"),
  breads: require("../../assets/images/bread1.jpg"),
};

// Local images for products
const PRODUCT_IMAGES = {
  // Pulao Items
  "Farmers Special Pulao": require("../../assets/images/pulao4.jpg"),
  "Veg Biryani": require("../../assets/images/pulao1.jpg"),
  "Peas Pulao": require("../../assets/images/pulao2.jpg"),
  "Jeera Rice": require("../../assets/images/pulao3.jpg"),

  // Fry Items
  "Crispy Fish Fry": require("../../assets/images/fish1.jpg"),
  "Chicken Fry": require("../../assets/images/fish2.jpg"),
  "Prawns Fry": require("../../assets/images/fish3.jpg"),
  "Chilli Chicken": require("../../assets/images/fish4.jpg"),

  // Salad Items
  "Fresh Garden Salad": require("../../assets/images/salad1.jpg"),
  "Greek Salad": require("../../assets/images/salad2.jpg"),
  "Caesar Salad": require("../../assets/images/salad3.jpg"),
  "Fruit Salad": require("../../assets/images/salad4.jpg"),

  // Snacks Items
  "Samosa": require("../../assets/images/snack1.jpg"),
  "Veg Spring Roll": require("../../assets/images/snack2.jpg"),
  "Chicken Spring Roll": require("../../assets/images/snack3.jpg"),
  "Onion Pakoda": require("../../assets/images/snack4.jpg"),

  // Fried Items
  "Chicken Lollipop": require("../../assets/images/chicken1.jpg"),
  "Fish Fry": require("../../assets/images/chicken3.webp"),
  "Fried Calamari": require("../../assets/images/chicken4.jpg"),
  "French Fries": require("../../assets/images/chicken1.jpg"),

  // Curries Items
  "Butter Chicken": require("../../assets/images/curry1.jpg"),
  "Chicken Curry": require("../../assets/images/curry2.avif"),
  "Mutton Curry": require("../../assets/images/curry3.webp"),
  "Fish Curry": require("../../assets/images/curry4.jpg"),

  // Breads Items
  "Garlic Naan": require("../../assets/images/bread1.jpg"),
  "Butter Naan": require("../../assets/images/bread2.jpg"),
  "Tandoori Roti": require("../../assets/images/bread3.jpg"),
  "Plain Naan": require("../../assets/images/bread4.jpg"),

};

const FALLBACK_IMAGE = require("../../assets/images/pulao1.jpg");

const KOVERA_CATEGORIES = [
  { id: "pulao", name: "Pulao", image: require("../../assets/images/pulao.png") },
  { id: "biryani", name: "Biryani", image: require("../../assets/images/pulao2.jpg") },
  { id: "fry", name: "Fry", image: require("../../assets/images/fish1.jpg") },
  { id: "curries", name: "Curries", image: require("../../assets/images/curry1.jpg") },
  { id: "salads", name: "Salads", image: require("../../assets/images/salad1.jpg") },
  { id: "snacks", name: "Snacks", image: require("../../assets/images/snack1.jpg") },
  { id: "fried", name: "Air/Oil Fried", image: require("../../assets/images/chicken2.jpg") },
  { id: "breads", name: "Breads", image: require("../../assets/images/bread1.jpg") },
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
      protein: "18g",
      calories: "420 kcal",
      reviews: 1245,
    },
    {
      id: "k2",
      name: "Kashmiri Pulao",
      category: "Pulao",
      price: 290,
      rating: 4.7,
      imageKey: "Kashmiri Pulao",
      tag: "Premium",
      protein: "16g",
      calories: "450 kcal",
      reviews: 876,
    },
    {
      id: "k3",
      name: "Peas Pulao",
      category: "Pulao",
      price: 190,
      rating: 4.5,
      imageKey: "Peas Pulao",
      tag: "Popular",
      protein: "12g",
      calories: "320 kcal",
      reviews: 2341,
    },
    {
      id: "k4",
      name: "Jeera Rice",
      category: "Pulao",
      price: 150,
      rating: 4.6,
      imageKey: "Jeera Rice",
      tag: "Classic",
      protein: "8g",
      calories: "280 kcal",
      reviews: 1876,
    },
    {
      id: "k5",
      name: "Mushroom Pulao",
      category: "Pulao",
      price: 240,
      rating: 4.7,
      imageKey: "Mushroom Pulao",
      tag: "Chef's Special",
      protein: "14g",
      calories: "380 kcal",
      reviews: 654,
    },
  ],

  biryani: [
    {
      id: "b1",
      name: "Veg Biryani",
      category: "Biryani",
      price: 250,
      rating: 4.7,
      imageKey: "Veg Biryani",
      tag: "Popular",
      protein: "15g",
      calories: "450 kcal",
      reviews: 3456,
    },
    {
      id: "b2",
      name: "Chicken Biryani",
      category: "Biryani",
      price: 320,
      rating: 4.9,
      imageKey: "Chicken Biryani",
      tag: "Bestseller",
      protein: "28g",
      calories: "520 kcal",
      reviews: 5678,
    },
    {
      id: "b3",
      name: "Mutton Biryani",
      category: "Biryani",
      price: 420,
      rating: 4.9,
      imageKey: "Mutton Biryani",
      tag: "Chef's Special",
      protein: "32g",
      calories: "580 kcal",
      reviews: 2345,
    },
    {
      id: "b4",
      name: "Hyderabadi Biryani",
      category: "Biryani",
      price: 380,
      rating: 4.8,
      imageKey: "Hyderabadi Biryani",
      tag: "Premium",
      protein: "30g",
      calories: "550 kcal",
      reviews: 1987,
    },
    {
      id: "b5",
      name: "Prawns Biryani",
      category: "Biryani",
      price: 450,
      rating: 4.8,
      imageKey: "Prawns Biryani",
      tag: "Special",
      protein: "35g",
      calories: "520 kcal",
      reviews: 876,
    },
    {
      id: "b6",
      name: "Egg Biryani",
      category: "Biryani",
      price: 220,
      rating: 4.6,
      imageKey: "Egg Biryani",
      tag: "Popular",
      protein: "18g",
      calories: "420 kcal",
      reviews: 1456,
    },
  ],

  fry: [
    {
      id: "f1",
      name: "Crispy Fish Fry",
      category: "Fry",
      price: 350,
      rating: 4.9,
      imageKey: "Crispy Fish Fry",
      tag: "Chef's Special",
      protein: "25g",
      calories: "380 kcal",
      reviews: 2345,
    },
    {
      id: "f2",
      name: "Chicken Fry",
      category: "Fry",
      price: 320,
      rating: 4.8,
      imageKey: "Chicken Fry",
      tag: "Bestseller",
      protein: "28g",
      calories: "420 kcal",
      reviews: 3456,
    },
    {
      id: "f3",
      name: "Chilli Chicken",
      category: "Fry",
      price: 340,
      rating: 4.7,
      imageKey: "Chilli Chicken",
      tag: "Popular",
      protein: "26g",
      calories: "400 kcal",
      reviews: 1876,
    },
    {
      id: "f4",
      name: "Pepper Chicken",
      category: "Fry",
      price: 330,
      rating: 4.7,
      imageKey: "Pepper Chicken",
      tag: "Spicy",
      protein: "27g",
      calories: "410 kcal",
      reviews: 1234,
    },
    {
      id: "f5",
      name: "Apollo Fish",
      category: "Fry",
      price: 380,
      rating: 4.8,
      imageKey: "Apollo Fish",
      tag: "Special",
      protein: "26g",
      calories: "390 kcal",
      reviews: 987,
    },
    {
      id: "f6",
      name: "Dragon Chicken",
      category: "Fry",
      price: 360,
      rating: 4.8,
      imageKey: "Dragon Chicken",
      tag: "Chef's Special",
      protein: "28g",
      calories: "430 kcal",
      reviews: 1654,
    },
  ],

  curries: [
    {
      id: "c1",
      name: "Butter Chicken",
      category: "Curries",
      price: 380,
      rating: 4.9,
      imageKey: "Butter Chicken",
      tag: "Bestseller",
      protein: "32g",
      calories: "520 kcal",
      reviews: 4567,
    },
    {
      id: "c2",
      name: "Chicken Curry",
      category: "Curries",
      price: 320,
      rating: 4.7,
      imageKey: "Chicken Curry",
      tag: "Popular",
      protein: "30g",
      calories: "480 kcal",
      reviews: 2345,
    },
    {
      id: "c3",
      name: "Mutton Curry",
      category: "Curries",
      price: 450,
      rating: 4.8,
      imageKey: "Mutton Curry",
      tag: "Chef's Special",
      protein: "35g",
      calories: "550 kcal",
      reviews: 1876,
    },
    {
      id: "c4",
      name: "Fish Curry",
      category: "Curries",
      price: 380,
      rating: 4.7,
      imageKey: "Fish Curry",
      tag: "Coastal Special",
      protein: "28g",
      calories: "420 kcal",
      reviews: 1456,
    },
    {
      id: "c5",
      name: "Paneer Butter Masala",
      category: "Curries",
      price: 280,
      rating: 4.7,
      imageKey: "Paneer Butter Masala",
      tag: "Popular",
      protein: "18g",
      calories: "450 kcal",
      reviews: 2987,
    },
    {
      id: "c6",
      name: "Dal Makhani",
      category: "Curries",
      price: 220,
      rating: 4.6,
      imageKey: "Dal Makhani",
      tag: "Classic",
      protein: "14g",
      calories: "320 kcal",
      reviews: 3456,
    },
    {
      id: "c7",
      name: "Kadai Chicken",
      category: "Curries",
      price: 340,
      rating: 4.7,
      imageKey: "Kadai Chicken",
      tag: "Spicy",
      protein: "31g",
      calories: "490 kcal",
      reviews: 1234,
    },
  ],

  salads: [
    {
      id: "s1",
      name: "Fresh Garden Salad",
      category: "Salads",
      price: 150,
      rating: 4.6,
      imageKey: "Fresh Garden Salad",
      tag: "Healthy",
      protein: "6g",
      calories: "120 kcal",
      reviews: 2341,
    },
    {
      id: "s2",
      name: "Greek Salad",
      category: "Salads",
      price: 220,
      rating: 4.7,
      imageKey: "Greek Salad",
      tag: "Premium",
      protein: "8g",
      calories: "180 kcal",
      reviews: 876,
    },
    {
      id: "s3",
      name: "Caesar Salad",
      category: "Salads",
      price: 240,
      rating: 4.7,
      imageKey: "Caesar Salad",
      tag: "Popular",
      protein: "10g",
      calories: "220 kcal",
      reviews: 1456,
    },
    {
      id: "s4",
      name: "Fruit Salad",
      category: "Salads",
      price: 180,
      rating: 4.5,
      imageKey: "Fruit Salad",
      tag: "Fresh",
      protein: "4g",
      calories: "150 kcal",
      reviews: 987,
    },
    {
      id: "s5",
      name: "Chicken Salad",
      category: "Salads",
      price: 280,
      rating: 4.7,
      imageKey: "Chicken Salad",
      tag: "Protein Rich",
      protein: "22g",
      calories: "280 kcal",
      reviews: 654,
    },
    {
      id: "s6",
      name: "Tuna Salad",
      category: "Salads",
      price: 300,
      rating: 4.8,
      imageKey: "Tuna Salad",
      tag: "Chef's Special",
      protein: "25g",
      calories: "260 kcal",
      reviews: 432,
    },
  ],

  snacks: [
    {
      id: "sn1",
      name: "Samosa",
      category: "Snacks",
      price: 40,
      rating: 4.5,
      imageKey: "Samosa",
      tag: "Popular",
      protein: "4g",
      calories: "180 kcal",
      reviews: 5678,
    },
    {
      id: "sn2",
      name: "Veg Spring Roll",
      category: "Snacks",
      price: 120,
      rating: 4.6,
      imageKey: "Veg Spring Roll",
      tag: "Crispy",
      protein: "6g",
      calories: "220 kcal",
      reviews: 2345,
    },
    {
      id: "sn3",
      name: "Chicken Spring Roll",
      category: "Snacks",
      price: 180,
      rating: 4.7,
      imageKey: "Chicken Spring Roll",
      tag: "Bestseller",
      protein: "12g",
      calories: "280 kcal",
      reviews: 1876,
    },
    {
      id: "sn4",
      name: "Onion Pakoda",
      category: "Snacks",
      price: 80,
      rating: 4.5,
      imageKey: "Onion Pakoda",
      tag: "Evening Special",
      protein: "5g",
      calories: "200 kcal",
      reviews: 2341,
    },
    {
      id: "sn5",
      name: "Gobi Manchurian",
      category: "Snacks",
      price: 160,
      rating: 4.6,
      imageKey: "Gobi Manchurian",
      tag: "Popular",
      protein: "8g",
      calories: "260 kcal",
      reviews: 2987,
    },
    {
      id: "sn6",
      name: "Chicken 65",
      category: "Snacks",
      price: 220,
      rating: 4.8,
      imageKey: "Chicken 65",
      tag: "Chef's Special",
      protein: "18g",
      calories: "320 kcal",
      reviews: 3456,
    },
    {
      id: "sn7",
      name: "Fish Fingers",
      category: "Snacks",
      price: 240,
      rating: 4.7,
      imageKey: "Fish Fingers",
      tag: "Crispy",
      protein: "16g",
      calories: "280 kcal",
      reviews: 1234,
    },
  ],

  fried: [
    {
      id: "fr1",
      name: "Prawns Fry",
      category: "Fried",
      price: 380,
      rating: 4.9,
      imageKey: "Prawns Fry",
      tag: "Chef's Special",
      protein: "28g",
      calories: "380 kcal",
      reviews: 2345,
    },
    {
      id: "fr2",
      name: "Chicken Lollipop",
      category: "Fried",
      price: 280,
      rating: 4.8,
      imageKey: "Chicken Lollipop",
      tag: "Bestseller",
      protein: "24g",
      calories: "360 kcal",
      reviews: 3456,
    },
    {
      id: "fr3",
      name: "Fish Fry",
      category: "Fried",
      price: 320,
      rating: 4.8,
      imageKey: "Fish Fry",
      tag: "Popular",
      protein: "26g",
      calories: "340 kcal",
      reviews: 1876,
    },
    {
      id: "fr4",
      name: "Fried Calamari",
      category: "Fried",
      price: 360,
      rating: 4.7,
      imageKey: "Fried Calamari",
      tag: "Special",
      protein: "24g",
      calories: "320 kcal",
      reviews: 876,
    },
    {
      id: "fr5",
      name: "French Fries",
      category: "Fried",
      price: 120,
      rating: 4.5,
      imageKey: "French Fries",
      tag: "Classic",
      protein: "4g",
      calories: "280 kcal",
      reviews: 4567,
    },
    {
      id: "fr6",
      name: "Chicken Popcorn",
      category: "Fried",
      price: 180,
      rating: 4.6,
      imageKey: "Chicken Popcorn",
      tag: "Kids Favorite",
      protein: "16g",
      calories: "300 kcal",
      reviews: 2341,
    },
  ],

  breads: [
    {
      id: "br1",
      name: "Garlic Naan",
      category: "Breads",
      price: 60,
      rating: 4.7,
      imageKey: "Garlic Naan",
      tag: "Bestseller",
      protein: "6g",
      calories: "180 kcal",
      reviews: 5678,
    },
    {
      id: "br2",
      name: "Butter Naan",
      category: "Breads",
      price: 50,
      rating: 4.6,
      imageKey: "Butter Naan",
      tag: "Popular",
      protein: "5g",
      calories: "160 kcal",
      reviews: 4567,
    },
    {
      id: "br3",
      name: "Tandoori Roti",
      category: "Breads",
      price: 35,
      rating: 4.5,
      imageKey: "Tandoori Roti",
      tag: "Healthy",
      protein: "4g",
      calories: "120 kcal",
      reviews: 3456,
    },
    {
      id: "br4",
      name: "Plain Naan",
      category: "Breads",
      price: 40,
      rating: 4.5,
      imageKey: "Plain Naan",
      tag: "Classic",
      protein: "5g",
      calories: "150 kcal",
      reviews: 2987,
    },
    {
      id: "br5",
      name: "Stuffed Kulcha",
      category: "Breads",
      price: 80,
      rating: 4.7,
      imageKey: "Stuffed Kulcha",
      tag: "Chef's Special",
      protein: "8g",
      calories: "220 kcal",
      reviews: 1876,
    },
    {
      id: "br6",
      name: "Roomali Roti",
      category: "Breads",
      price: 25,
      rating: 4.4,
      imageKey: "Roomali Roti",
      tag: "Light",
      protein: "3g",
      calories: "90 kcal",
      reviews: 2341,
    },
  ],
};

// Separate Food Item Card Component to use Hooks properly
const FoodItemCard = ({ item, onIncrement, onDecrement, itemCount, getProductImage }) => {
  const buttonRef = useRef(null);

  return (
    <View
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
              {item.rating} ({item.reviews})
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
            {item.protein} protein • {item.calories}
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
                ₹{item.price + Math.floor(item.price * 0.2)}
              </Text>
            </View>

            {itemCount === 0 ? (
              <TouchableOpacity
                ref={buttonRef}
                onPress={() => onIncrement(item, buttonRef)}
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
                  onPress={() => onDecrement(item.id)}
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
                  onPress={() => onIncrement(item, buttonRef)}
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
  const [cartAnimation] = useState(new Animated.Value(1));
  const [addedItem, setAddedItem] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // Animation values for flying image
  const flyImagePosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const flyImageScale = useRef(new Animated.Value(1)).current;
  const flyImageOpacity = useRef(new Animated.Value(0)).current;
  const flyImageRotate = useRef(new Animated.Value(0)).current;

  // Reference to cart icon for animation destination
  const cartIconRef = useRef(null);
  const [cartIconLayout, setCartIconLayout] = useState({ x: 0, y: 0 });

  const { koveraLocation, cart, addToCart, updateQuantity } = useStore();

  const products = DUMMY_KOVERA_FOOD[selectedCategory] || [];
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItems = cart.filter(item => item.quantity > 0);

  // Animate cart icon when item added
  useEffect(() => {
    if (cartCount > 0) {
      Animated.sequence([
        Animated.timing(cartAnimation, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(cartAnimation, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [cartCount]);

  // Hide toast after 1.5 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowToast(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const getProductImage = (imageKey) => {
    return PRODUCT_IMAGES[imageKey] || FALLBACK_IMAGE;
  };

  const getCartItemCount = (productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const measureCartIcon = () => {
    return new Promise((resolve) => {
      if (cartIconRef.current) {
        cartIconRef.current.measure((x, y, width, height, pageX, pageY) => {
          const layout = {
            x: pageX + width / 2,
            y: pageY + height / 2
          };
          setCartIconLayout(layout);
          resolve(layout);
        });
      } else {
        resolve({ x: width - 30, y: insets.top + 30 });
      }
    });
  };

  const startFlyAnimation = async (product, buttonLayout) => {
    // Get cart icon position
    const cartPos = await measureCartIcon();

    // Set the flying image to start at button position
    flyImagePosition.setValue({ x: buttonLayout.pageX, y: buttonLayout.pageY });
    flyImageScale.setValue(0.8); // Start slightly smaller
    flyImageOpacity.setValue(1);
    flyImageRotate.setValue(0);

    // Sequence: First jump up slowly with size increase, then fly to cart
    Animated.sequence([
      // First animation - slow jump up with size increase (stays in place)
      Animated.parallel([
        Animated.timing(flyImagePosition.y, {
          toValue: buttonLayout.pageY - 80, // Jump up 80px
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(flyImageScale, {
          toValue: 1.8, // Increase size by 80%
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(flyImageRotate, {
          toValue: 0.2, // Slight rotation
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      // Second animation - slow fall back down to original position with slight size decrease
      Animated.parallel([
        Animated.timing(flyImagePosition.y, {
          toValue: buttonLayout.pageY,
          duration: 300,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(flyImageScale, {
          toValue: 1.5, // Still larger than original
          duration: 300,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      // Third animation - quick bounce up again
      Animated.parallel([
        Animated.timing(flyImagePosition.y, {
          toValue: buttonLayout.pageY - 40,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(flyImageScale, {
          toValue: 1.6,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      // Fourth animation - final position at button before flying
      Animated.parallel([
        Animated.timing(flyImagePosition.y, {
          toValue: buttonLayout.pageY,
          duration: 150,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(flyImageScale, {
          toValue: 1.4,
          duration: 150,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      // Fifth animation - now fly to cart with slow movement
      Animated.parallel([
        Animated.timing(flyImagePosition.x, {
          toValue: cartPos.x,
          duration: 1200, // Slow movement to cart
          easing: Easing.bezier(0.2, 0.8, 0.4, 1),
          useNativeDriver: true,
        }),
        Animated.timing(flyImagePosition.y, {
          toValue: cartPos.y,
          duration: 1200,
          easing: Easing.bezier(0.3, 0.7, 0.3, 1),
          useNativeDriver: true,
        }),
        Animated.timing(flyImageScale, {
          toValue: 0.3,
          duration: 1100,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(flyImageRotate, {
          toValue: 2, // Two full rotations while flying
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(1000),
          Animated.timing(flyImageOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start(() => {
      setAddedItem(product);
      setShowToast(true);
    });
  };

  const handleIncrement = (product, buttonRef) => {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
      setAddedItem(product);
      setShowToast(true);
    } else {
      // Measure button position for fly animation
      if (buttonRef && buttonRef.current) {
        buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
          startFlyAnimation(product, {
            pageX: pageX + width / 2,
            pageY: pageY + height / 2
          });
        });
      }

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

  // Interpolate rotation for spinning effect
  const spin = flyImageRotate.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '180deg', '360deg']
  });

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
      <StatusBar style="dark" />

      {/* Flying Image Animation */}
      <Animated.Image
        source={addedItem ? getProductImage(addedItem.imageKey) : FALLBACK_IMAGE}
        style={{
          position: 'absolute',
          width: 50,
          height: 50,
          borderRadius: 25,
          borderWidth: 2,
          borderColor: '#FFFFFF',
          zIndex: 1000,
          transform: [
            { translateX: flyImagePosition.x },
            { translateY: flyImagePosition.y },
            { scale: flyImageScale },
            { rotate: spin },
          ],
          opacity: flyImageOpacity,
        }}
      />

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
            ref={cartIconRef}
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
            <Animated.View style={{ transform: [{ scale: cartAnimation }] }}>
              <ShoppingCart size={20} color="#333333" />
            </Animated.View>
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

      {/* Success Toast */}
      {showToast && addedItem && (
        <Animated.View
          style={{
            position: 'absolute',
            top: insets.top + 100,
            left: 20,
            right: 20,
            backgroundColor: '#1E293B',
            borderRadius: 30,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            zIndex: 100,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Image
            source={getProductImage(addedItem.imageKey)}
            style={{ width: 30, height: 30, borderRadius: 15 }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 13,
                color: "#FFFFFF",
              }}
              numberOfLines={1}
            >
              {addedItem.name}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 11,
                color: "#94A3B8",
              }}
            >
              Added to cart
            </Text>
          </View>
        </Animated.View>
      )}

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
            <FoodItemCard
              key={item.id}
              item={item}
              itemCount={itemCount}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              getProductImage={getProductImage}
            />
          );
        })}
      </ScrollView>

      {/* Bottom Cart Bar */}
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
                {cartCount} {cartCount === 1 ? 'Item' : 'Items'} added
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
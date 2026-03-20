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
  TextInput,
  Alert,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ShoppingCart,
  Plus,
  Minus,
  ArrowLeft,
  Search,
  Leaf,
  Snowflake,
  Timer,
  Package,
  X,
  Flame,
} from "lucide-react-native";
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
const CARD_WIDTH = (width - 100 - 16) / 2;

// Filter buttons data with updated icons - Added Coal after Instant
const FILTER_BUTTONS = [
  { id: "fresh", name: "Fresh", icon: Leaf },
  { id: "frozen", name: "Frozen", icon: Snowflake },
  { id: "instant", name: "Instant", icon: Timer },
  { id: "coal", name: "Coal", icon: Flame },
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
  "Coal": require("../../assets/images/coal.png"), // Added Coal image
};

const FALLBACK_IMAGE = require("../../assets/images/banana.webp");

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
  {
    id: "25",
    name: "Coal (Bricket)",
    mrp: 150,
    retailPrice: 130,
    wholesalePrice: 120,
    weight: "5 kg",
    discount: "13",
    time: "15 MINS",
    category: "other",
    imageKey: "Coal"
  },
  {
    id: "26",
    name: "Charcoal (Matti Bricket)",
    mrp: 180,
    retailPrice: 160,
    wholesalePrice: 145,
    weight: "5 kg",
    discount: "11",
    time: "15 MINS",
    category: "other",
    imageKey: "Coal"
  },
];

// Separate Product Card Component
const ProductCard = ({ item, onIncrement, onDecrement, itemCount, getProductImage }) => {
  const buttonRef = useRef(null);

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
      {/* Product Image */}
      <Image
        source={getProductImage(item)}
        style={{
          width: "100%",
          height: CARD_WIDTH,
          resizeMode: "cover",
        }}
      />

      {/* Product Details */}
      <View style={{
        padding: 10,
        height: 130,
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
              height: 36,
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
                color: "#124703",
              }}
            >
              ₹{item.retailPrice}
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

        {/* Add/Quantity Controls */}
        {itemCount === 0 ? (
          <TouchableOpacity
            ref={buttonRef}
            onPress={() => onIncrement(item, buttonRef)}
            style={{
              backgroundColor: "#FFFFFF",
              paddingVertical: 6,
              borderRadius: 25,
              alignItems: "center",
              borderWidth: 1.5,
              borderColor: "#124703",
              flexDirection: "row",
              justifyContent: "center",
              gap: 4,
              height: 34,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 12,
                color: "#124703",
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
              borderColor: "#124703",
              padding: 3,
              height: 34,
            }}
          >
            <TouchableOpacity
              onPress={() => onDecrement(item.id)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: itemCount === 1 ? "#F8F9FA" : "#124703",
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
              onPress={() => onIncrement(item, buttonRef)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: "#124703",
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
};

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
  const [searchQuery, setSearchQuery] = useState("");
  const [cartAnimation] = useState(new Animated.Value(1));
  const [addedItem, setAddedItem] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showLimitToast, setShowLimitToast] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");

  // Animation values for flying image
  const flyImagePosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const flyImageScale = useRef(new Animated.Value(1)).current;
  const flyImageOpacity = useRef(new Animated.Value(0)).current;
  const flyImageRotate = useRef(new Animated.Value(0)).current;

  // Reference to cart icon for animation destination
  const cartIconRef = useRef(null);
  const [cartIconLayout, setCartIconLayout] = useState({ x: 0, y: 0 });

  const { userRole, cart, addToCart, updateQuantity, getCartTotalWeight } = useStore();

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

  // Hide limit toast after 2 seconds
  useEffect(() => {
    if (showLimitToast) {
      const timer = setTimeout(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowLimitToast(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showLimitToast]);

  // Filter products by category and search query
  const filteredProducts = DUMMY_PRODUCTS.filter(product => {
    // First filter by category
    const categoryMatch = selectedCategory === "all" || product.category === selectedCategory;

    // Then filter by search query
    const searchMatch = searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name.includes(searchQuery);

    return categoryMatch && searchMatch;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalWeight = getCartTotalWeight();

  const getProductImage = (product) => {
    return PRODUCT_IMAGES[product.imageKey] || FALLBACK_IMAGE;
  };

  const getCartItemCount = (productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const getItemWeightInKg = (weight) => {
    if (weight.includes('kg') || weight.includes('Kg') || weight.includes('KG')) {
      return parseFloat(weight) || 1;
    } else if (weight.includes('g') && !weight.includes('kg')) {
      const grams = parseFloat(weight) || 0;
      return grams / 1000;
    } else if (weight.includes('L') || weight.includes('l')) {
      return parseFloat(weight) || 1;
    } else if (weight.includes('units') || weight.includes('unit')) {
      return 0.5; // Assume each unit is 0.5kg
    }
    return 1; // Default weight
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

    // Create a curved path with slow jump and size increase
    const midX = (buttonLayout.pageX + cartPos.x) / 2;
    const midY = Math.min(buttonLayout.pageY, cartPos.y) - 100; // Higher arc for jump effect

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

  const checkAndShowLimitMessage = (product, newQuantity) => {
    const itemWeight = getItemWeightInKg(product.weight);
    const currentItem = cart.find(item => item.id === product.id);
    const currentItemQuantity = currentItem ? currentItem.quantity : 0;
    const newItemTotalWeight = (currentItemQuantity + 1) * itemWeight;

    // Check individual product limit (10kg)
    if (newItemTotalWeight > 10) {
      setLimitMessage(`Cannot add more than 10kg of ${product.name.split('(')[0].trim()}`);
      setShowLimitToast(true);
      return false;
    }

    // Check overall cart limit (30kg)
    const newTotalWeight = cartTotalWeight + itemWeight;
    if (newTotalWeight > 30) {
      const remainingWeight = (30 - cartTotalWeight).toFixed(1);
      setLimitMessage(`Overall cart limit is 30kg. You can add only ${remainingWeight}kg more.`);
      setShowLimitToast(true);
      return false;
    }

    return true;
  };

  const handleIncrement = (product, buttonRef) => {
    const existingItem = cart.find(item => item.id === product.id);
    const price = userRole === "wholesale" ? product.wholesalePrice : product.retailPrice;

    if (existingItem) {
      // Check limits before incrementing
      if (!checkAndShowLimitMessage(product, existingItem.quantity + 1)) {
        return;
      }

      updateQuantity(product.id, existingItem.quantity + 1);
      setAddedItem(product);
      setShowToast(true);
    } else {
      // Check limits before adding new item
      if (!checkAndShowLimitMessage(product, 1)) {
        return;
      }

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
        id: product.id,
        name: product.name,
        price: price,
        quantity: 1,
        weight: product.weight,
        image: getProductImage(product),
        retailPrice: product.retailPrice,
        wholesalePrice: product.wholesalePrice,
        mrp: product.mrp,
        imageKey: product.imageKey,
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
        source={addedItem ? getProductImage(addedItem) : FALLBACK_IMAGE}
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
          pointerEvents: 'none', // This ensures the flying image doesn't block touches
        }}
      />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 12,
          paddingHorizontal: 16,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#E5E9F0",
          zIndex: 100, // Ensure header is above content but below flying image
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

          {/* Search Bar - Now Working */}
          <View style={{ flex: 1, position: "relative" }}>
            <View style={{
              position: "absolute",
              left: 12,
              top: 12,
              zIndex: 1,
            }}>
              <Search size={18} color="#94A3B8" />
            </View>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search for atta, dal, and more"
              placeholderTextColor="#94A3B8"
              style={{
                backgroundColor: "#F8F9FA",
                borderRadius: 12,
                paddingHorizontal: 40,
                paddingVertical: 12,
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: "#1E293B",
                borderWidth: 1,
                borderColor: "#E5E9F0",
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: 12,
                  top: 12,
                  zIndex: 1,
                }}
              >
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            ref={cartIconRef}
            onPress={() => router.push("/(tabs)/cart")}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: "#124703",
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

        {/* Filter Buttons with Updated Icons - Added Coal */}
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
                  backgroundColor: isSelected ? "#124703" : "#F8F9FA",
                  borderWidth: 1,
                  borderColor: isSelected ? "#124703" : "#E5E9F0",
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
            pointerEvents: 'none', // This ensures toast doesn't block touches
          }}
        >
          <Image
            source={getProductImage(addedItem)}
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
            zIndex: 100,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            pointerEvents: 'none',
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

      {/* Cart Weight Indicator */}
      {cartCount > 0 && (
        <View
          style={{
            position: 'absolute',
            top: insets.top + 180,
            right: 20,
            backgroundColor: '#124703',
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 6,
            zIndex: 90,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 12,
              color: "#FFFFFF",
            }}
          >
            Total: {cartTotalWeight.toFixed(1)}kg / 30kg
          </Text>
        </View>
      )}

      {/* Main Content */}
      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Left Sidebar - Categories */}
        <View style={{
          width: 80,
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
                  borderRightColor: selectedCategory === item.id ? "#124703" : "transparent",
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
                    borderColor: selectedCategory === item.id ? "#124703" : "#E5E9F0",
                  }}
                />
                <Text
                  style={{
                    fontFamily: selectedCategory === item.id ? "Inter_600SemiBold" : "Inter_500Medium",
                    fontSize: 12,
                    color: selectedCategory === item.id ? "#124703" : "#64748B",
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
          {filteredProducts.length === 0 ? (
            <View style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 20,
            }}>
              <Search size={64} color="#E5E9F0" />
              <Text style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 18,
                color: "#1E293B",
                marginTop: 16,
                marginBottom: 8,
              }}>
                No products found
              </Text>
              <Text style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: "#64748B",
                textAlign: 'center',
              }}>
                Try searching with different keywords or browse categories
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 12 }}
              contentContainerStyle={{
                paddingVertical: 12,
                paddingBottom: insets.bottom + 20,
              }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const itemCount = getCartItemCount(item.id);

                return (
                  <ProductCard
                    item={item}
                    itemCount={itemCount}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    getProductImage={getProductImage}
                  />
                );
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
}
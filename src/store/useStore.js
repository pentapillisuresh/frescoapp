import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useStore = create(
  persist(
    (set, get) => ({
      userRole: "retail", // 'retail' | 'wholesale'
      isLoggedIn: true,
      koveraLocation: null,
      cart: [],
      orders: [],

      setUserRole: (role) => set({ userRole: role }),
      setLoggedIn: (status) => set({ isLoggedIn: status }),
      setKoveraLocation: (location) => set({ koveraLocation: location }),

      addToCart: (product) =>
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (item) => item.id === product.id
          );

          if (existingIndex > -1) {
            const newCart = [...state.cart];
            newCart[existingIndex].quantity += product.quantity || 1;
            return { cart: newCart };
          }

          return {
            cart: [...state.cart, { ...product, quantity: product.quantity || 1 }],
          };
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity === 0) {
            return {
              cart: state.cart.filter((item) => item.id !== id),
            };
          }

          return {
            cart: state.cart.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        const { cart, userRole } = get();
        return cart.reduce((sum, item) => {
          const price = userRole === "wholesale" ? item.wholesalePrice : item.retailPrice;
          return sum + (price * item.quantity);
        }, 0);
      },

      getCartCount: () => {
        const { cart } = get();
        return cart.reduce((sum, item) => sum + item.quantity, 0);
      },

      // Helper function to extract weight in kg
      getWeightInKg: (weightString) => {
        if (!weightString) return 1;

        // Extract numeric value
        const numericValue = parseFloat(weightString) || 1;

        if (weightString.includes('kg') || weightString.includes('Kg') || weightString.includes('KG')) {
          return numericValue;
        } else if (weightString.includes('g') && !weightString.includes('kg')) {
          return numericValue / 1000;
        } else if (weightString.includes('L') || weightString.includes('l')) {
          return numericValue; // Assume 1L = 1kg for simplicity
        } else if (weightString.includes('units') || weightString.includes('unit')) {
          return 0.5; // Assume each unit is 0.5kg
        }
        return numericValue;
      },

      // Get total weight of cart in kg
      getCartTotalWeight: () => {
        const { cart } = get();
        return cart.reduce((sum, item) => {
          const itemWeight = get().getWeightInKg(item.weight);
          return sum + (itemWeight * item.quantity);
        }, 0);
      },

      // Check if adding item exceeds limits
      canAddToCart: (productId, additionalQuantity = 1) => {
        const { cart, getWeightInKg } = get();
        const existingItem = cart.find(item => item.id === productId);

        if (!existingItem) return { allowed: true, message: "" };

        const itemWeight = getWeightInKg(existingItem.weight);
        const newTotalWeight = (existingItem.quantity + additionalQuantity) * itemWeight;

        // Check individual product limit (10kg)
        if (newTotalWeight > 10) {
          return {
            allowed: false,
            message: `Cannot add more than 10kg of ${existingItem.name.split('(')[0].trim()}`
          };
        }

        return { allowed: true, message: "" };
      },

      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),

      cancelOrder: (orderId) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status: "Cancelled" } : o
          ),
        })),
    }),
    {
      name: "grocery-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
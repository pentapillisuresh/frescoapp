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
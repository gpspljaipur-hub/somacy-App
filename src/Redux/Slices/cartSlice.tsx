import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  product_name: string;
  price: number;
  image: string;
  quantity: number;
  discount?: number;
  attributeId?: any;
}

interface CartState {
  items: Record<string, CartItem>;
}

const initialState: CartState = {
  items: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      state.items[action.payload.id] = action.payload;
    },

    incrementQty(state, action: PayloadAction<string>) {
      if (state.items[action.payload]) {
        state.items[action.payload].quantity += 1;
      }
    },

    decrementQty(state, action: PayloadAction<string>) {
      const item = state.items[action.payload];
      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        delete state.items[action.payload];
      }
    },

    removeFromCart(state, action: PayloadAction<string>) {
      delete state.items[action.payload];
    },

    restoreCart(state, action: PayloadAction<Record<string, CartItem>>) {
      state.items = action.payload;
    },

    clearCart(state) {
      state.items = {};
    },
  },
});

export const {
  addToCart,
  incrementQty,
  decrementQty,
  removeFromCart,
  clearCart,
  restoreCart,
} = cartSlice.actions;

export default cartSlice.reducer;

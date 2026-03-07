import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductInfo {
  attribute_id: string;
  product_price: string;
  product_type: string;
  product_discount: string;
  Product_Out_Stock: string;
}

interface Product {
  id: string;
  product_name: string;
  product_image: string[];
  Brand_name: string;
  short_desc: string;
  product_info: ProductInfo[];
}

interface Category {
  id: string;
  category_name: string;
  catnameHindi: string;
  category_img: string;
  productlist: Product[];
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategoryLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setCategoryData(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
      state.loading = false;
      state.error = null;
    },

    setCategoryError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    clearCategory(state) {
      return initialState;
    },
  },
});

export const {
  setCategoryLoading,
  setCategoryData,
  setCategoryError,
  clearCategory,
} = categorySlice.actions;

export default categorySlice.reducer;

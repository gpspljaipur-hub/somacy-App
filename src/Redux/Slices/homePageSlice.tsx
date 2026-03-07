import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HomeState {
  banner: any[];
  categories: any[];
  brands: any[];
  medicines: any[];
  homeSections: any[];
  mainData: any | null;
  wallet: string;
  loading: boolean;
  prescriptionHistory: any[];
}

const initialState: HomeState = {
  banner: [],
  categories: [],
  brands: [],
  medicines: [],
  homeSections: [],
  mainData: null,
  wallet: "0",
  loading: false,
  prescriptionHistory: [],
};

const homePageSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setHomeData(state, action: PayloadAction<any>) {
      const data = action.payload;


      state.banner = data?.Banner || [];
      state.categories = data.Catlist || [];
      state.brands = data.Brand || [];
      state.medicines = data.Medicine || [];
      state.homeSections = data.Home_data || [];
      state.mainData = data.Main_Data || null;
      state.wallet = data.wallet || "0";
      state.loading = false;
    },

    setHomeLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setPrescriptionHistory(state, action: PayloadAction<any[]>) {
      state.prescriptionHistory = action.payload;
    },

    clearHome(state) {
      return initialState;
    },
  },
});

export const { setHomeData, setHomeLoading, clearHome, setPrescriptionHistory } = homePageSlice.actions;
export default homePageSlice.reducer;

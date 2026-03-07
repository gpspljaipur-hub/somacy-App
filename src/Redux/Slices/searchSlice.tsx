import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchItem {
  product_name: string;
}

interface SearchState {
  searchList: SearchItem[];
}

const initialState: SearchState = {
  searchList: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchData: (state, action: PayloadAction<SearchItem[]>) => {
      state.searchList = action.payload;
    },
    clearSearchData: state => {
      state.searchList = [];
    },
  },
});

export const { setSearchData, clearSearchData } = searchSlice.actions;
export default searchSlice.reducer;

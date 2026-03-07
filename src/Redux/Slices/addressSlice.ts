import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AddressItem {
    id: string;
    hno?: string;
    address: string;
    landmark?: string;
    type?: "Home" | "Office" | "Other" | string;
    lat_map?: string;
    long_map?: string;
    address_image?: string;
}

interface AddressState {
    selectedAddress: AddressItem | null;
}

const initialState: AddressState = {
    selectedAddress: null,
};

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        setSelectedAddress: (state, action: PayloadAction<AddressItem | null>) => {
            state.selectedAddress = action.payload;
        },
        clearSelectedAddress: (state) => {
            state.selectedAddress = null;
        },
    },
});

export const { setSelectedAddress, clearSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer;

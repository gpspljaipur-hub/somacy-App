import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserLogin {
  id: string;
  fname: string;
  lname: string;
  email: string;
  mobile: string;
  ccode: string;
  status: string;
  wallet: string;
}

interface AuthState {
  user: UserLogin | null;
  isLoggedIn: boolean;
  verificationId: string | null;
  lastLoggedUserId: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  verificationId: null,
  lastLoggedUserId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserLogin>) {
      state.user = action.payload;
      if (action.payload.id) {
        state.lastLoggedUserId = action.payload.id;
      }
      state.isLoggedIn = true;
    },
    setVerificationId(state, action: PayloadAction<string>) {
      state.verificationId = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
    clearVerificationId(state) {
      state.verificationId = null;
    },
  },
});

export const { setUser, logout, setVerificationId, clearVerificationId } = authSlice.actions;
export default authSlice.reducer;

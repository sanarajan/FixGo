import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface User {
  fullname?: string;
  image?: string;
  email?: string;
  [key: string]: any;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState:AuthState = {
  isAuthenticated: false,
  user: null,
};

const ProviderSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    setProviderUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logoutProvider(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateProviderImage: (state, action:PayloadAction<string>) => {
      console.log(
        "Called updateUserImage reducer with payload:",
        action.payload
      );

     if (state.user) {
        (state.user as User).image = action.payload;

      }
    },
     updateProviderFullname: (state, action: PayloadAction<string>) => {
      console.log(
        " Called fullname reducer with payload:",
        action.payload
      );
      if (state.user) {
       (state.user as User).fullname = action.payload;

      }
    },
  },
});

export const { setProviderUser, logoutProvider,updateProviderImage,updateProviderFullname } = ProviderSlice.actions;
export default ProviderSlice.reducer;

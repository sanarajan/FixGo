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

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const adminUserSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logoutAdmin(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateAdminImage: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.image = action.payload;
      }
    },
    updateAdminFullname: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.fullname = action.payload;
      }
    },
  },
});

export const {
  setAdminUser,
  logoutAdmin,
  updateAdminImage,
  updateAdminFullname,
} = adminUserSlice.actions;

export default adminUserSlice.reducer;

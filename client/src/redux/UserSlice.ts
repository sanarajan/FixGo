import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isAuthenticated: boolean;
  user: any | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    updateUserImage: (state, action) => {
      console.log(
        "Called updateUserImage reducer with payload:",
        action.payload
      );

      if (state.user) {
        state.user = {
          ...state.user,
          image: action.payload,
        };
      }
    },
     updateFullname: (state, action) => {
      console.log(
        " Called fullname reducer with payload:",
        action.payload
      );
      if (state.user) {
        state.user = {
          ...state.user,
          fullname: action.payload,
        };
      }
    },
    logoutUser(state,action) {
      // state.user = null;
      // state.isAuthenticated = false;
      console.log(action.payload+" paymload")
      const currentRole=action.payload
       if (currentRole) {
    localStorage.removeItem(`${currentRole}_user`);
    localStorage.removeItem(`${currentRole}_accessToken`);
    // localStorage.removeItem(`${currentRole}_refreshToken`);
    localStorage.removeItem("persist:customer"); // if using redux-persist
    localStorage.removeItem("serviceState")
    
  }

    },
  },
});

export const { setUser, logoutUser, updateUserImage,updateFullname } = userSlice.actions;
export default userSlice.reducer;

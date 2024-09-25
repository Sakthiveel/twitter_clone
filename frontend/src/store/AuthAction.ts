import { createSlice } from "@reduxjs/toolkit";

export const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    userInfo: {},
  },
  reducers: {
    userAuthenticate: (state, payload) => {
      state.isAuthenticated = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { userAuthenticate } = AuthSlice.actions;
export default AuthSlice.reducer;

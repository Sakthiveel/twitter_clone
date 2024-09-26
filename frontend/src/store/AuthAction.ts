import { createSlice } from "@reduxjs/toolkit";

export const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    accessToken: null,
    userInfo: {},
    tempUserInfo: {},
  },
  reducers: {
    signIn: (state, { payload, type }) => {
      if (!payload.accessToken) {
        throw new Error("Access Token is need");
      }
      console.log("reducer", { payload, type });
      state.isAuthenticated = true;
      state.accessToken = payload.accessToken;
      state.userInfo = payload.userInfo;
      state.tempUserInfo = {};
      // state = {
      //   isAuthenticated: true,
      //   accessToken: payload.accessToken,
      //   userInfo: {},
      // };
    },
    logOut: (state) => {
      if (!state.isAuthenticated) {
        throw new Error("Already signed out");
      }
      state = {
        isAuthenticated: false,
        accessToken: null,
        userInfo: {},
      };
    },
    setUserInfo: (state, { payload }) => {
      console.log("setUserInfo", { payload });
      if (!payload.userInfo) {
        throw new Error("No User Info to set redux state");
      }
      state.userInfo = { ...payload.userInfo };
    },
    setTempUserInfo: (state, { payload }) => {
      if (!payload.tempUserInfo) {
        throw new Error("No Temp user data to set ");
      }
      state.tempUserInfo = payload.tempUserInfo;
    },
  },
});

// Action creators are generated for each case reducer function
export const { signIn, setUserInfo, setTempUserInfo } = AuthSlice.actions;
export default AuthSlice.reducer;

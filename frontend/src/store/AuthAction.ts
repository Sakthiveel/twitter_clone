import { createSlice } from "@reduxjs/toolkit";
import { Post, tempUser, userSchema } from "../Schema/Schema";
interface AuthState {
  isAuthenticated: boolean;
  accessToken: number | null;
  userInfo: Post | object;
  tempUserInfo: tempUser | object;
}
const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  userInfo: {},
  tempUserInfo: {},
};
export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, { payload, type }) => {
      if (!payload.accessToken) {
        throw new Error("Access Token is need");
      }
      if (userSchema.validate(payload.userInfo).error) {
        throw new Error("No valid userInfo to sign in");
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
      if (userSchema.validate(state.userInfo).error) {
        throw new Error("Invalid user info to set");
      }
      state.userInfo = payload.userInfo;
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
export const { signIn, logOut, setTempUserInfo, setAccessToken } =
  AuthSlice.actions;
export default AuthSlice.reducer;

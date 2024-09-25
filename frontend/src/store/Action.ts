import { createSlice } from "@reduxjs/toolkit";

export const BaseSlice = createSlice({
  name: "base",
  initialState: {
    globalLoader: false,
  },
  reducers: {
    globalLoaderToggle: (state) => {
      state.globalLoader = state.globalLoader ? false : true;
    },
  },
});

// Action creators are generated for each case reducer function
export const { globalLoaderToggle } = BaseSlice.actions;
export default BaseSlice.reducer;

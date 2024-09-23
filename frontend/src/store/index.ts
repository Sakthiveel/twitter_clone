import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./userAction.ts";

export default configureStore({
  reducer: counterReducer,
});

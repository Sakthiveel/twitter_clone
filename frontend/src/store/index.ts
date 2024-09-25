import { configureStore } from "@reduxjs/toolkit";
import BaseReducer from "./Action.ts";
import AuthReducer from "./AuthAction.ts";

export default configureStore({
  reducer: { auth: AuthReducer, main: BaseReducer },
  // reducer: { main: BaseReducer },
});

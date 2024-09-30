import { createSlice } from "@reduxjs/toolkit";
import { Post } from "../Schema/Schema";

interface AppStateInterace {
  usersPosts: {
    postsDataArr: Array<Post>;
    postDataAsObj: { [key: string]: Post };
  };
}
interface BaseSlice {
  globalLoader: boolean;
  app: AppStateInterace;
}

const initialState: BaseSlice = {
  globalLoader: false,
  app: {
    usersPosts: {
      postsDataArr: [],
      postDataAsObj: {},
    },
  },
};
export const BaseSlice = createSlice({
  name: "base",
  initialState,
  reducers: {
    globalLoaderToggle: (state) => {
      console.log("global Loader", { state });
      state.globalLoader = state.globalLoader ? false : true;
    },
    updateUserPosts: (state, { payload }) => {
      if (!payload.postsData) {
        throw new Error("No Post data to set the state");
      }
      console.log("redux", { data: payload.postsData });
      const postsAsArr: Array<Post> = Object.keys(payload.postsData).map(
        (postId) => payload.postsData?.[postId]
      );
      state.app.usersPosts.postDataAsObj = payload.postsData;
      state.app.usersPosts.postsDataArr = postsAsArr;
    },
  },
});

// Action creators are generated for each case reducer function
export const { globalLoaderToggle, updateUserPosts } = BaseSlice.actions;
export default BaseSlice.reducer;

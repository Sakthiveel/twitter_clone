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
      const postDataAsObj = payload.postsData.reduce(
        (prev: object, postInfo: Post) => {
          const { post_id } = postInfo;
          return Object.assign(prev, { [post_id]: postInfo });
        },
        {}
      );
      state.app.usersPosts.postDataAsObj = postDataAsObj;
      state.app.usersPosts.postsDataArr = payload.postsData;
    },
  },
});

// Action creators are generated for each case reducer function
export const { globalLoaderToggle, updateUserPosts } = BaseSlice.actions;
export default BaseSlice.reducer;

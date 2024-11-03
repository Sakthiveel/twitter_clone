import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Following, Post, User } from "../Schema/Schema";

interface AppStateInterace {
  usersPosts: {
    postsDataArr: Array<Post>;
    postDataAsObj: { [key: string]: Post };
  };
  newUsers: {
    newUsersDataArr: Array<User>;
    newUsersDataAsObj: { [key: string]: User };
  };
  following: {
    followingUsers: Array<Following>;
    followingUsersAsObj: { [Key: string]: Following };
  };
  followers: {
    followersArr: Array<User>;
    followersObj: { [key: string]: User };
  };
}
export interface BaseSlice {
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
    newUsers: {
      newUsersDataArr: [],
      newUsersDataAsObj: {},
    },
    followers: {
      followersArr: [],
      followersObj: {},
    },
    following: {
      followingUsers: [],
      followingUsersAsObj: {},
    },
  },
};
export const BaseSlice = createSlice({
  name: "base",
  initialState,
  reducers: {
    globalLoaderToggle: (state) => {
      console.log("global Loader", { state });
      state.globalLoader = !state.globalLoader;
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
    updateUsersList: (state, { payload }) => {
      if (!payload.usersList) {
        throw new Error("No users list to set the state");
      }
      const newUsersArr = payload.usersList.filter((userInfo: User) => {
        return !state.app.following.followingUsersAsObj?.[userInfo.uid];
      });

      const newUsersDataAsObj = newUsersArr.reduce(
        (prev: object, userInfo: User) => {
          const { uid } = userInfo;
          return Object.assign(prev, { [uid]: userInfo });
        },
        {}
      );
      console.log("updateUsesList", {
        newUsersDataAsObj,
        newUsersArr,
        unfiltered: payload.usersList,
        state,
      });
      state.app.newUsers.newUsersDataArr = newUsersArr;
      state.app.newUsers.newUsersDataAsObj = newUsersDataAsObj;
    },
    updateFollowing: (state, action: PayloadAction<Array<Following>>) => {
      const followingUsers: Array<Following> = action.payload;
      if (!Array.isArray(followingUsers)) {
        throw new Error("No follwing Users to set");
      }
      console.log("updateFollowing redux", { followingUsers });
      const followingUsersAsObj = followingUsers.reduce(
        (prev: object, userInfo) => {
          const { uid } = userInfo;
          return Object.assign(prev, { [uid]: userInfo });
        },
        {}
      );
      state.app.following.followingUsers = followingUsers;
      state.app.following.followingUsersAsObj = followingUsersAsObj;
    },
    updateFollowers: (state, action: PayloadAction<[Following]>) => {
      const followersArr = action.payload;
      if (!Array.isArray(followersArr)) {
        throw new Error("NO followers to set");
      }
      const followersObj = followersArr.reduce((prev: object, userInfo) => {
        const { uid } = userInfo;
        return Object.assign(prev, { [uid]: userInfo });
      }, {});
      state.app.following.followingUsers = followersArr;
      state.app.following.followingUsersAsObj = followersObj;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  globalLoaderToggle,
  updateUserPosts,
  updateUsersList,
  updateFollowers,
  updateFollowing,
} = BaseSlice.actions;
export default BaseSlice.reducer;

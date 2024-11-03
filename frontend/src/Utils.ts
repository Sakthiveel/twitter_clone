import { ConstructionOutlined, NetworkCell } from "@mui/icons-material";
import { Post, PostSchema, User, UserKeys, userSchema } from "./Schema/Schema";
import { signOut } from "firebase/auth";
import { auth } from "./Firebase";
export const defaultuser: User = {
  age: 12,
  uid: "uid here bro",
  created_at: new Date(),
  display_name: "display name here",
  handler_name: "handler name here",
  profile_photo: null,
  bio: "default bio here",
};
// data validation should be handled before calling this function
export const addUser = async (
  userInfo: User,
  accessToken: string
): Promise<boolean> => {
  const { error: validationError } = userSchema.validate(userInfo);
  if (validationError) {
    throw Error(validationError.message);
  }
  const userInfoToSend = new FormData();
  for (const [key, value] of Object.entries(userInfo)) {
    userInfoToSend.append(key, value);
  }
  for (const [key, value] of userInfoToSend.entries()) {
    console.log("to backend data", { key, value });
  }
  let netwrokRes: Response;
  try {
    console.log("addUser fun", { userInfo });
    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        Authorization: `${accessToken}`,
      },
    };
    netwrokRes = await fetch(`${import.meta.env.VITE_SERVER_URL}/v1/addUser`, {
      ...requestOptions,
      body: userInfoToSend,
    });
    if (!netwrokRes.ok) {
      throw new Error("Request Failed");
    }
    const data = await netwrokRes.json();
    console.log("add user", { data });
    if (!data.status) throw Error("Somethign went wrong");
    return true;
  } catch (err) {
    // dont throw the error from here , handle it properly here itself
    console.log({ err, netwrokRes });
    return false;
  }
};

export const editUser = async (
  userInfo: User,
  accessToken: string
): Promise<boolean> => {
  const { error: validationError } = userSchema.validate(userInfo);
  if (validationError) {
    throw Error(validationError.message);
  }
  const userInfoToSend = new FormData();
  for (const [key, value] of Object.entries(userInfo)) {
    userInfoToSend.append(key, value);
  }
  for (const [key, value] of userInfoToSend.entries()) {
    console.log("to backend data", { key, value });
  }
  let netwrokRes: Response;
  try {
    console.log("editUser fun", { userInfo });
    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        Authorization: `${accessToken}`,
      },
    };
    netwrokRes = await fetch(`${import.meta.env.VITE_SERVER_URL}/v1/editUser`, {
      ...requestOptions,
      body: userInfoToSend,
    });
    if (!netwrokRes.ok) {
      throw new Error("Request Failed");
    }
    const data = await netwrokRes.json();
    console.log("edit user", { data });
    if (!data.status) throw new Error("Cannot able to edit the User Info");
    return true;
  } catch (err) {
    // dont throw the error from here , handle it properly here itself
    console.log({ err, netwrokRes });
    return false;
  }
};

export const checkUserExist = async (uid: string): Promise<User | null> => {
  const url = new URL(`${import.meta.env.VITE_SERVER_URL}/check_user_exists`);
  url.searchParams.append("uid", uid);
  let networkRes: Response;
  try {
    networkRes = await fetch(url);
    if (!networkRes.ok) {
      alert("Something went wrong , Please try again");
      throw new Error("Networkd resquests failed");
    }
    const data = await networkRes.json();
    console.log("checkUserExist", data);
    return data.isUserExist ? data.userInfo : null;
  } catch (err) {
    console.log({ err, networkRes });
    throw err;
  }
};

// expects only valid postinfo . validate  here once , last line of defence
export const addPost = async (
  postInfo: Post,
  accessToken: string
): Promise<boolean> => {
  const { error } = PostSchema.validate(postInfo);
  if (error) throw error.message;
  const postInfoToSend = new FormData();

  for (const [key, value] of Object.entries(postInfo)) {
    if (Array.isArray(value)) {
      for (const arrVal of value) {
        postInfoToSend.append(`${key}[]`, arrVal);
      }
    } else postInfoToSend.append(key, value);
  }

  try {
    const networkRes: Response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/v1/addPost`,
      {
        method: "POST",
        body: postInfoToSend,
        headers: {
          Authorization: `${accessToken}`,
        },
      }
    );
    if (!networkRes.ok) {
      throw networkRes;
    }
    const data = await networkRes.json();
    if (!data.status) console.log("add post action", { data });
    return data.status;
  } catch (err) {
    console.log("add post action", { err });
    return false;
  }
};

export const logoutHandler = async (): Promise<boolean> => {
  try {
    await signOut(auth);
  } catch (err) {
    console.log("logoutHandler", { err });
    return false;
  }
  return true;
};

export const checkHandlerNameAvailable = async (
  check_name: string
): Promise<boolean> => {
  const url = new URL(`${import.meta.env.VITE_SERVER_URL}/handler_name_exist`);
  url.searchParams.append("check_name", check_name);
  const networkRes = await fetch(url);
  if (!networkRes.status) {
    throw new Error(networkRes.statusText);
  }
  const { status } = await networkRes.json();
  return !status;
};

export const getUser = async (handler_name: string): Promise<User | null> => {
  try {
    const networkRes = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/getUser/?handler_name=${handler_name}`
    );
    if (!networkRes.ok) {
      throw new Error("Network Error");
    }
    const data: User = await networkRes.json();
    return data || null;
  } catch (err) {
    console.log("getUser", { err });
    return null;
  }
};

export const addFollowing = async (
  currentUserUid: string,
  addFollowingUids: Array<string>,
  accessToken: string
) => {
  console.log({ currentUserUid, addFollowingUids, accessToken });
  try {
    const networkRes = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/addFollowing`,
      {
        method: "POST",
        body: JSON.stringify({
          addFollowingUids,
          currentUserUid,
        }),
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!networkRes.ok) {
      throw new Error("Network Erro");
    }
    const data = await networkRes.json();
    console.log("Add followers", { data, networkRes });
    return data?.status;
  } catch (err) {
    console.error("addFollowers", err.message);
    return false;
  }
};

export const removeFollowing = async (
  currentUserUid: string,
  removeFollowingUids: Array<string>,
  accessToken: string
) => {
  console.log("removeFollowing", {
    currentUserUid,
    removeFollowingUids,
    accessToken,
  });
  try {
    const networkRes = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/removeFollowing`,
      {
        method: "POST",
        body: JSON.stringify({
          removeFollowingUids,
          currentUserUid,
        }),
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!networkRes.ok) {
      throw new Error("Network Erro");
    }
    const data = await networkRes.json();
    console.log("remove followers", { data, networkRes });
    return data?.status;
  } catch (err) {
    console.error("removeFollowers", err.message);
    return false;
  }
};

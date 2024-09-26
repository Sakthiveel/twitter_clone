import { NetworkCell } from "@mui/icons-material";
import { Post, PostSchema, User, UserKeys, userSchema } from "../Schema/Schema";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
export const addUser = async (userInfo: User): Promise<boolean> => {
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

export const checkUserExist = async (uid: string): Promise<User | null> => {
  const url = new URL(
    `${import.meta.env.VITE_SERVER_URL}/v1/check_user_exists`
  );
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
export const addPost = async (postInfo: Post): Boolean => {
  const { error } = PostSchema.validate(postInfo);
  if (error) throw error.message;
  const postInfoToSend = new FormData();

  for (const [key, value] of Object.entries(postInfo)) {
    postInfoToSend.append(key, value);
  }

  try {
    const networkRes: Response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/v1/updateUser`,
      { method: "POST", body: postInfoToSend }
    );
    if (!networkRes.ok) {
      throw networkRes;
    }
    const data = await networkRes.json();
    return data.status;
  } catch (err) {
    console.log("add post action", { err });
    return false;
  }
};

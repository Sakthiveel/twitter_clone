import { User, userSchema } from "../Schema/Schema";
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
export const addUser = async (userInfo: FormData) => {
  let res;
  try {
    console.log("addUser fun", { url: import.meta.env.VITE_SERVER_URL });
    const requestOptions: RequestInit = {
      method: "POST",
    };
    res = await fetch(`${import.meta.env.VITE_SERVER_URL}/v1/addUser`, {
      ...requestOptions,
      body: userInfo,
    });
    res = await res.json();
    console.log("add user", { res });
    if (!res.status) throw Error("Somethign went wrong");
  } catch (err) {
    console.log({ err });
    // throw err;
  }
};

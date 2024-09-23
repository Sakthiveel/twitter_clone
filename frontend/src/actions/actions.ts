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
export const addUser = async (userInfo: User = defaultuser) => {
  // todo: create an interface for the data modal
  const { error } = userSchema.validate(userInfo);
  if (error) throw error; // might need proper error handling here
  let res;
  try {
    console.log("addUser fun", { url: import.meta.env.VITE_SERVER_URL });
    const requestOptions: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    res = await fetch(`${import.meta.env.VITE_SERVER_URL}/v1/addUser`, {
      ...requestOptions,
      body: JSON.stringify(userInfo),
    });
    res = await res.json();
    console.log("add user", { res });
    if (!res.status) throw Error("Somethign went wrong");
  } catch (err) {
    // throw err;
  }
  return res;
};

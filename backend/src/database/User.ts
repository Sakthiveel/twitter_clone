import Joi from "joi";
import { db } from ".";

export const UserKeys = {
  uid: "uid",
  profile_photo: "profile_photo",
  bg_photo: "bg_photo",
  handler_name: "handler_name",
  bio: "bio",
  display_name: "display_name",
  age: "age",
  created_at: "created_at",
  modified_at: "modified_at",
  email: "email",
  authType: "authType",
} as const;

export interface User {
  [UserKeys.uid]: string;
  [UserKeys.handler_name]: string;
  [UserKeys.display_name]: string;
  [UserKeys.created_at]: Date;
  [UserKeys.modified_at]?: Date;
  [UserKeys.profile_photo]?: File | string | null;
  [UserKeys.bg_photo]?: File | string | null;
  [UserKeys.age]?: number;
  [UserKeys.bio]?: string;
}

export const schema = Joi.object({
  uid: Joi.string().required(),
  handler_name: Joi.string().required(),
  display_name: Joi.string().required(),
  created_at: Joi.date().required(),
  age: Joi.number(),
  modified_at: Joi.date(),
  [UserKeys.profile_photo]: Joi.any(), // todo check this
  [UserKeys.bg_photo]: Joi.any(), // todo check this
  [UserKeys.bio]: Joi.string(),
});

const collection_Name = "users";
const docRef = db.collection(collection_Name);
export const addUser = async (userInfo) => {
  console.log("addUser called", { userInfo });
  const { error } = schema.validate(userInfo);
  if (error) throw error;
  const { uid } = userInfo;
  return await docRef.doc(uid).set(userInfo);
};

export const updateUser = async (userInfo) => {
  throw new Error("update user fun not handled");
};

export const getUser = async (uid) => {
  const doc = await docRef.doc(uid).get();
  if (doc.exists) {
    console.log("getUser", doc.data());
    return doc.data();
  }
  return null;
};

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

export const addUser = async (userInfo) => {
  console.log("addUser called", { userInfo });
  const { error } = schema.validate(userInfo);
  if (error) throw error;
  const { uid } = userInfo;
  const docRef = db.collection(collection_Name).doc(uid);
  return await docRef.set(userInfo);
};

export const updateUser = async (userInfo) => {
  throw new Error("update user fun not handled");
};

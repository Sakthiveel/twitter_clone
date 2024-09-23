import Joi from "joi";
import { db } from ".";

const schema = Joi.object({
  uid: Joi.string().required(),
  handler_name: Joi.string().required(),
  display_name: Joi.string().required(),
  age: Joi.number().required(),
  created_at: Joi.date().required(),
  modified_at: Joi.date(),
});

const collection_Name = "users";

export const addUser = async (userInfo) => {
  console.log({ userInfo });
  throw Error("Got the req from the frontend");
  const { error } = schema.validate(userInfo);
  if (error) throw error;
  const { uid } = userInfo;
  const docRef = db.collection(collection_Name).doc(uid);
  return await docRef.set(userInfo);
};

export const updateUser = async (userInfo) => {
  throw new Error("update user fun not handled");
};

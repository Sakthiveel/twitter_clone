import Joi from "joi";
import { db } from ".";
import { FieldValue } from "firebase-admin/firestore";

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
  following: "following",
  followers: "follwers",
  users: "users",
  count: "count",
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
  [UserKeys.followers]?: {
    [UserKeys.users]: Array<string>;
    [UserKeys.count]: number;
  };
  [UserKeys.following]?: {
    [UserKeys.users]: Array<string>;
    [UserKeys.count]: number;
  };
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
  [UserKeys.following]: Joi.object({
    [UserKeys.users]: Joi.array<string>(),
    [UserKeys.count]: Joi.number(),
  }),
  [UserKeys.followers]: Joi.object({
    [UserKeys.users]: Joi.array<string>(),
    [UserKeys.count]: Joi.number(),
  }),
});

const collection_Name = "users";
const collectionRef = db.collection(collection_Name);
export const addUser = async (userInfo) => {
  console.log("addUser called", { userInfo });
  const { error } = schema.validate(userInfo);
  if (error) throw error;
  const { uid } = userInfo;
  const docRef = await collectionRef.doc(uid).get();
  if (docRef.exists) {
    return await collectionRef.doc(uid).update(userInfo);
  }
  return await collectionRef.doc(uid).set(userInfo);
};

export const updateUser = async (userInfo) => {
  throw new Error("update user fun not handled");
};

export const getUser = async (
  uid: string | null,
  handler_name: string | null
): Promise<User | null> => {
  console.log("getUser db func", { uid, handler_name });
  if (uid) {
    const doc = await collectionRef.doc(uid).get();
    if (doc.exists) {
      console.log("getUser", doc.data());
      return doc.data() as User;
    }
    return null;
  } else if (handler_name) {
    const query = collectionRef.where(
      UserKeys.handler_name,
      "==",
      handler_name
    );
    const snapshot = await query.limit(1).get();
    if (snapshot.empty) {
      console.log("No User found for the given  handler_name");
      return null;
    }
    let data: User;
    snapshot.forEach((doc) => {
      data = doc.data() as User;
    });
    console.log({ data });
    return data;
  }

  throw new Error("Need uid or handler_name to get the User info .");
};

export const handlerExists = async (handler_name: string): Promise<boolean> => {
  if (!handler_name.length) {
    throw new Error("Invalid handler_name to check");
  }
  const query = collectionRef.where(UserKeys.handler_name, "==", handler_name);
  const snapshot = await query.count().get();
  console.log({ snapshot });
  return Boolean(snapshot.data().count);
};

export const addFollowers = async (
  currentUserUid: string,
  addFollowersUids: Array<string>
): Promise<boolean> => {
  try {
    const currentUserRef = await collectionRef.doc(currentUserUid).get();
    if (!currentUserRef.exists) {
      throw new Error("User does not exists");
    }
    for (const followerUid of addFollowersUids) {
      const followerDoc = await collectionRef.doc(followerUid).get();
      if (!followerDoc.exists) {
        throw new Error("Some of the add to follower list users not exist");
      }
    }
    const usersFollwersList = []; // stores the actually following people uids
    db.runTransaction(async (trans) => {
      for (const followerdUid of addFollowersUids) {
        const followerRef = collectionRef.doc(followerdUid);
        const followersDoc = (await followerRef.get()).data();
        const followersObj = followersDoc?.[UserKeys.followers] || {};
        if (
          followersObj &&
          Array.isArray(followersObj?.[UserKeys.users]) &&
          followersObj?.[UserKeys.users].includes(currentUserUid)
        ) {
          break;
        }
        trans.update(followerRef, {
          [UserKeys.followers]: {
            [UserKeys.count]: FieldValue.increment(1),
            [UserKeys.users]: FieldValue.arrayUnion(currentUserUid),
          },
        });
        usersFollwersList.push(followerdUid);
      }
      if (usersFollwersList.length) {
        trans.update(collectionRef.doc(currentUserUid), {
          [UserKeys.following]: {
            [UserKeys.count]: FieldValue.increment(usersFollwersList.length),
            [UserKeys.users]: FieldValue.arrayUnion(...usersFollwersList),
          },
        });
      }
      return true;
    });
  } catch (err) {
    console.error("transation failed", err);
    return false;
  }
};

export const removeFollowers = async (
  currentUserUid: string,
  removeFollowersUids: Array<string>
) => {
  const docRef = collectionRef.doc(currentUserUid);
  const res = await docRef.update({
    following: FieldValue.arrayRemove(...removeFollowersUids),
  });
  console.log({ res });
};

// export const getAllUsers = async (): Promise<Array<object>> => {
//   const snapshot = await collectionRef.get();
//   const usersData = [];
//   snapshot.forEach((doc) => usersData.push(doc.data()));
//   console.log("getAllusers db function", { usersData });
//   return usersData;
// };

import Joi from "joi";
import { db } from ".";
import { FieldValue } from "firebase-admin/firestore";

const collection_Name = "posts";
const docRef = db.collection(collection_Name);
export const PostKeys = {
  post_id: "post_id",
  created_by: "created_by",
  display_name: "display_Name",
  text_content: "text_content",
  images: "images",
  likes_count: "likes_count",
  visibility: "visibility",
  created_at: "created_at",
  modified_at: "modified_at",
} as const;

export const PostVisibilityKeys = {
  public: "public",
  private: "private",
  only_followers: "only_followers",
};

export interface Post {
  [PostKeys.post_id]: string;
  [PostKeys.created_by]: string;
  [PostKeys.text_content]: string;
  [PostKeys.images]: Array<File | string>;
  [PostKeys.visibility]: string;
  [PostKeys.created_at]: Date;
  [PostKeys.display_name]: string;
  [PostKeys.likes_count]?: number;
  [PostKeys.modified_at]?: Date;
}

export const PostSchema = Joi.object({
  [PostKeys.post_id]: Joi.string().required(),
  [PostKeys.created_by]: Joi.string().required(),
  [PostKeys.text_content]: Joi.string().required(),
  [PostKeys.created_at]: Joi.date().required(),
  [PostKeys.display_name]: Joi.string().required(),
  [PostKeys.modified_at]: Joi.date(),
  [PostKeys.images]: Joi.array(),
  [PostKeys.likes_count]: Joi.number(),
  [PostKeys.visibility]: Joi.string().valid(
    PostVisibilityKeys.public,
    PostVisibilityKeys.private,
    PostVisibilityKeys.only_followers
  ),
});

const getPostCollectionRef = (created_by: string, post_id: string) =>
  db.collection("posts").doc(post_id);

export const addPost = async (postInfo: Post): Promise<boolean> => {
  console.log("add post ", { postInfo });
  const { error } = PostSchema.validate(postInfo);
  if (error) throw error;
  const created_by = postInfo?.[PostKeys.created_by];
  const post_id = postInfo?.[PostKeys.post_id];
  const postCollectionRef = getPostCollectionRef(created_by, post_id);
  const postDoc = await postCollectionRef.get();
  if (postDoc.exists) {
    throw new Error(
      "Trying to overwrite an exisiting post document. Please check the post_id"
    );
  }
  try {
    const firebaseRes = await postCollectionRef.set(postInfo);
    console.log({ firebaseRes });
  } catch (err) {
    return false;
  }
  return true;
};

// todo: check if post exists ,before updating
export const updatePost = async (postInfo: Post): Promise<boolean> => {
  console.log("update post", { postInfo });
  const { error } = PostSchema.validate(postInfo);
  if (error) throw error;
  const created_by = postInfo?.[PostKeys.created_by];
  const post_id = postInfo?.[PostKeys.post_id];
  const postCollectionRef = getPostCollectionRef(created_by, post_id);
  const postDoc = await postCollectionRef.get();
  if (!postDoc.exists) {
    throw new Error("Post does not exist or not created . Cannot be updated");
  }
  try {
    await postCollectionRef.set(postInfo);
  } catch (err) {
    console.log("err", { err });
    return false;
  }
  return true;
};

// todo: check if post exists ,before deleting
export const deletePost = async (
  post_id: string,
  created_by: string
): Promise<boolean> => {
  const postCollectionRef = getPostCollectionRef(created_by, post_id);
  const postDoc = await postCollectionRef.get();
  if (!postDoc.exists) {
    throw new Error("Post is not avaiale to delete");
  }
  try {
    const firebaseRes = await postCollectionRef.delete();
    console.log({ firebaseRes });
  } catch (e) {
    return false;
  }
  return true;
};

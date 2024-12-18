import Joi from "joi";

export interface Network_Response {
  status: boolean;
  response?: object;
}

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
export interface tempUser {
  [UserKeys.uid]: string;
  [UserKeys.display_name]: string | null;
  [UserKeys.email]: string | null;
  [UserKeys.profile_photo]: string | undefined | null;
  accessToken?: string;
}
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

export const userSchema = Joi.object({
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

export interface Following {
  [UserKeys.uid]: string;
  [UserKeys.created_at]: Date;
}

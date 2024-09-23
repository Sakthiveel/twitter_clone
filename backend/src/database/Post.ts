import Joi from "joi";

const schema = Joi.object({
  post_id: Joi.string().required(),
  created_by: Joi.string().required(),
  text_content: Joi.string(),
  images: Joi.array(),
  videos: Joi.array(),
  likes_count: Joi.number(),
  visibility: Joi.string().valid("public", "private", "followers_only"),
});

const collection_Name = "posts";

export const addPost = async (postInfo) => {};

export const updatePost = async (postInfo) => {};

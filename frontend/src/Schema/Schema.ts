import Joi from "joi";

export interface Network_Response {
  status: boolean;
  response?: object;
}

export interface User {
  uid: string;
  profile_photo?: FileList | null;
  handler_name: string;
  bio?: string;
  display_name: string;
  age: number;
  created_at: Date;
  modified_at?: Date;
}

export const userSchema = Joi.object({
  uid: Joi.string().required(),
  handler_name: Joi.string().required(),
  display_name: Joi.string().required(),
  age: Joi.number().required(),
  created_at: Joi.date().required(),
  modified_at: Joi.date(),
});

export interface Post {
  post_id: number;
  created_by: number;
  text_content: string;
  images?: Array<Blob>;
  videos?: Array<Blob>;
  likes_count: number;
  visibility: string;
}

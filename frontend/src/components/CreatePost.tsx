import React from "react";
import { PostKeys, Post, PostSchema } from "../Schema/Schema";
import { addPost } from "../Utils";
import { uid } from "uid";
import { useSelector } from "react-redux";
export default function CreatePost() {
  const defaultPostInfo: Post = {
    [PostKeys.text_content]: "",
    [PostKeys.images]: [],
  };
  const [postInfo, setPostInfo] = React.useState<Post>(() => defaultPostInfo);
  const [previewImgs, setPreviewImgs] = React.useState<Array<string>>([]);
  const { userInfo, accessToken } = useSelector((state) => state.auth);
  const imageHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (file && file?.size > 1048576) {
      alert("Image size is greater than 1 mb . Please chossse anoterh photo");
      return;
    }
    if (file) {
      setPostInfo((prevSt) => {
        return Object.assign({}, prevSt, {
          [PostKeys.images]: [...prevSt[PostKeys.images], file],
        });
      });
      setPreviewImgs((prevSt) => [...prevSt, URL.createObjectURL(file)]);
    }
  };
  const preparePostInfo = (): Post => ({
    [PostKeys.post_id]: uid(5),
    [PostKeys.created_by]: userInfo.uid,
    [PostKeys.text_content]: postInfo?.[PostKeys.text_content],
    [PostKeys.images]: postInfo?.[PostKeys.images],
    [PostKeys.visibility]: "public", // todo : implement , visibility selector
    [PostKeys.created_at]: new Date(),
  });
  const createPostHandler = async () => {
    try {
      const postInfoToProcess: Post = preparePostInfo();
      const { error } = PostSchema.validate(postInfoToProcess);
      if (error) throw error.message;
      const res = await addPost(postInfoToProcess, accessToken);
      if (res) {
        console.log("Post added");
      } else {
        console.log("Post creation failed");
      }
    } catch (err) {
      console.log("createPostHandler", { err });
    }
  };
  console.log({ postInfo, previewImgs });
  return (
    <div>
      <input
        name={PostKeys.text_content}
        value={postInfo.text_content}
        onChange={(ev) =>
          setPostInfo((prevSt) =>
            Object.assign({}, prevSt, {
              [PostKeys.text_content]: ev.target.value,
            })
          )
        }
        type="text"
        placeholder="what's happening?"
      />
      {previewImgs.map((imgSrc) => {
        return (
          <img
            src={imgSrc}
            className="size-20"
            alt="img"
            key={`upload_img_${imgSrc}`}
          />
        );
      })}
      <input
        type="file"
        name={PostKeys.images}
        placeholder=""
        onChange={imageHandler}
      />
      <button onClick={createPostHandler}>Post </button>
    </div>
  );
}

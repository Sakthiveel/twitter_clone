import React from "react";
import { PostKeys, Post } from "../Schema/Schema";
export default function CreatePost() {
  const defaultPostInfo: Post = {
    [PostKeys.text_content]: "",
    [PostKeys.images]: [],
  };
  const [postInfo, setPostInfo] = React.useState<Post>(() => defaultPostInfo);
  const [previewImgs, setPreviewImgs] = React.useState<Array<string>>([]);
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
      <button>Post </button>
    </div>
  );
}

import React from "react";
import { PostKeys, Post, PostSchema } from "../Schema/Schema";
import { addPost } from "../Utils";
import { uid } from "uid";
import { useSelector } from "react-redux";
import ProfileCard from "./UI/ProfileCard";
import ImageUploadIcon from "@mui/icons-material/Image";
import Button from "./UI/Button";
import { useDispatch } from "react-redux";
import { globalLoaderToggle } from "../store/Action";
import { ChevronDown } from "lucide-react";

export default function CreatePost() {
  const defaultPostInfo: Post = {
    [PostKeys.text_content]: "",
    [PostKeys.images]: [],
  };
  const [postInfo, setPostInfo] = React.useState<Post>(() => defaultPostInfo);
  const [previewImgs, setPreviewImgs] = React.useState<Array<string>>([]);
  const { userInfo, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
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
    dispatch(globalLoaderToggle());
    try {
      const postInfoToProcess: Post = preparePostInfo();
      const { error } = PostSchema.validate(postInfoToProcess);
      if (error) throw error;
      const res = await addPost(postInfoToProcess, accessToken);
      if (res) {
        console.log("Post added");
      } else {
        console.log("Post creation failed");
      }
    } catch (err) {
      console.log("createPostHandler", { err });
    } finally {
      dispatch(globalLoaderToggle());
    }
  };
  console.log({ postInfo, previewImgs });
  return (
    <div className="flex w-full p-4">
      <div className="mr-2">
        <ProfileCard />
      </div>
      <div className="flex flex-col w-full gap-1">
        <details className="dropdown">
          <summary className="text-sm flex text-mainBlue border border-grey  rounded-lg text-blue-primary w-fit px-2">
            Everyone can view <ChevronDown className="size-5" />
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li>
              <a>Everyone</a>
            </li>
            <li>
              <a>Only followers</a>
            </li>
            <li>
              <a>private</a>
            </li>
          </ul>
        </details>
        <textarea
          className="font-xl font-normal px-2 rounded-xl"
          placeholder="What's happening ?"
          name={PostKeys.text_content}
          value={postInfo.text_content}
          onChange={(ev) =>
            setPostInfo((prevSt) =>
              Object.assign({}, prevSt, {
                [PostKeys.text_content]: ev.target.value,
              })
            )
          }
        ></textarea>
        <div className="divider"></div>
        {previewImgs.map((imgSrc) => {
          console.log("img", { imgSrc });
          return (
            <img
              src={imgSrc}
              className="size-20"
              alt="img"
              key={`upload_img_${imgSrc}`}
            />
          );
        })}
        <div className="flex justify-between">
          <div
            onClick={() =>
              document.getElementById("create-post-image-upload")?.click()
            }
          >
            <ImageUploadIcon sx={{ fontSize: "30px" }} />
            <input
              type="file"
              id="create-post-image-upload"
              className="hidden"
              name={PostKeys.images}
              placeholder=""
              onChange={imageHandler}
            />
          </div>
          <Button btnText="Post" clickHandler={createPostHandler} />
        </div>
      </div>
    </div>
  );
}

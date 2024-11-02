import React from "react";
import { PostKeys, Post, PostSchema, UserKeys } from "../Schema/Schema";
import { addPost } from "../Utils";
import { uid } from "uid";
import { useSelector } from "react-redux";
import ProfileCard from "./UI/ProfileCard";
import ImageUploadIcon from "@mui/icons-material/Image";
import Button from "./UI/Button";
import { useDispatch } from "react-redux";
import { globalLoaderToggle } from "../store/Action";
import { ChevronDown, ChevronUp } from "lucide-react";
import Dropdown, { DropDownIconProps, DropDownItem } from "./UI/DropDown";

const dropDownOptions: Array<DropDownItem> = [
  { displayText: "Everyone", onClickHandler: () => {} },
  { displayText: "Only Followers", onClickHandler: () => {} },
  { displayText: "Private", onClickHandler: () => {} },
];

export default function CreatePost() {
  const defaultPostInfo: Post = {
    [PostKeys.text_content]: "",
    [PostKeys.images]: [],
    [PostKeys.post_id]: "",
    [PostKeys.created_by]: "",
    [PostKeys.visibility]: "",
    [PostKeys.created_at]: new Date(),
  };
  const [postInfo, setPostInfo] = React.useState<Post>(() =>
    Object.assign({}, defaultPostInfo)
  );
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
        const setVal = [...prevSt[PostKeys.images], file];
        console.log({ setVal });
        return Object.assign({}, prevSt, {
          [PostKeys.images]: setVal,
        });
      });
      setPreviewImgs((prevSt) => [...prevSt, URL.createObjectURL(file)]);
    }
  };
  const preparePostInfo = (): Post => ({
    [PostKeys.post_id]: uid(5),
    [PostKeys.created_by]: userInfo.uid,
    [PostKeys.text_content]: postInfo?.[PostKeys.text_content],
    [PostKeys.images]: postInfo?.[PostKeys.images] ?? [""],
    [PostKeys.visibility]: "public", // todo : implement , visibility selector
    [PostKeys.created_at]: new Date(),
  });
  const createPostHandler = async () => {
    dispatch(globalLoaderToggle());
    try {
      const postInfoToProcess: Post = preparePostInfo();
      console.log({ postInfoToProcess, postInfo });
      const { error } = PostSchema.validate(postInfoToProcess);
      if (error) throw error;
      const res = await addPost(postInfoToProcess, accessToken);
      if (res) {
        console.log("Post added");
        setPostInfo(() => Object.assign({}, defaultPostInfo));
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
        <ProfileCard
          url={userInfo?.[UserKeys.profile_photo] as string | null}
        />
      </div>
      <div className="flex flex-col w-full gap-2">
        <Dropdown Ele={InternalIcon} dropDownItems={dropDownOptions} />
        <textarea
          className="font-xl font-normal p-2 rounded-xl focus:outline-none"
          placeholder="What's happening ?"
          name={PostKeys.text_content}
          value={postInfo.text_content}
          onChange={(ev) =>
            setPostInfo((prevSt) => {
              console.log({ prevSt });
              return Object.assign({}, prevSt, {
                [PostKeys.text_content]: ev.target.value,
              });
            })
          }
        ></textarea>

        <div className="flex flex-col gap-2 ">
          {previewImgs.map((imgSrc) => {
            return (
              <img
                src={imgSrc}
                className="max-h-[300px] object-contain aspect-video"
                alt="img"
                key={`upload_img_${imgSrc}`}
              />
            );
          })}
        </div>
        <div className="divider"></div>

        <div className="flex justify-between">
          <div
            onClick={() =>
              document.getElementById("create-post-image-upload")?.click()
            }
          >
            <ImageUploadIcon
              sx={{ fontSize: "30px", color: "rgb(29, 155, 240)" }}
            />
            <input
              type="file"
              accept="image/*"
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

const InternalIcon = (props: DropDownIconProps) => {
  const { isDropdownVisible, onClickHandler } = props;
  console.log("internalIcon", { isDropdownVisible });
  return (
    <div
      onClick={onClickHandler}
      className="text-sm font-semibold flex text-mainBlue border-2 border-grey  rounded-lg text-blue-primary w-fit px-2 cursor-pointer"
    >
      Everyone can view{" "}
      {isDropdownVisible ? (
        <ChevronUp
          className="size-5"
          onClick={(ev) => {
            ev.stopPropagation();
            onClickHandler();
          }}
        />
      ) : (
        <ChevronDown
          className="size-5"
          onClick={(ev) => {
            ev.stopPropagation();
            onClickHandler();
          }}
        />
      )}
    </div>
  );
};

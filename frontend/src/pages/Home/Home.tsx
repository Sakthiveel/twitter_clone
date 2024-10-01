import React from "react";
import RightSidebar from "../../components/RightSidebar";
import ProfileCard from "../../components/UI/ProfileCard";
import PostCards from "../../components/PostCards";
import CreatePostModal from "./CreatePostModa";
import { useSelector } from "react-redux";
import { Post } from "../../Schema/Schema";
import CreatePost from "../../components/CreatePost";
const HomeContentNavigate = () => {
  return (
    <div className="flex py-2">
      {new Array(5).fill("").map(() => {
        return (
          <div className="text-lg text-gray-700 hover:bg-gray-300 px-2">
            sldfk
          </div>
        );
      })}
    </div>
  );
};

export default function Home() {
  const { auth, main } = useSelector((state) => state);

  const { userInfo } = auth;
  const usersPosts = main.app.usersPosts;
  console.log("home ", { usersPosts });
  const [img, setImage] = React.useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageHandler = (ev: any) => {
    setImage(URL.createObjectURL(ev.target.files[0]));
  };
  console.log(img);
  return (
    <div className="flex">
      <CreatePostModal />
      {/* <Modal id="create_post_modal" children={<div>Hello </div>} /> */}
      <RightSidebar />
      <div className="w-[568px] border" style={{ borderWidth: 1 }}>
        <HomeContentNavigate />
        <CreatePost />
        {usersPosts.postsDataArr.map((postInfo: Post) => (
          <PostCards postInfo={postInfo} />
        ))}
      </div>
    </div>
  );
}

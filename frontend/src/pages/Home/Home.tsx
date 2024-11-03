import React from "react";
import RightSidebar from "../../components/RightSidebar";
import PostCards from "../../components/PostCards";
import CreatePostModal from "./CreatePostModa";
import { useSelector } from "react-redux";
import { Post } from "../../Schema/Schema";
import CreatePost from "../../components/CreatePost";
import ListUsers from "./ListUsers";
const HomeContentNavigate = ({ setNavigateOptions, navigateOptions }) => {
  const selectedClasses = "pb-1 border-b-4 border-blue-primary rounded-t-full";
  return (
    <div className="flex border border-b-grey">
      <div
        onClick={() => setNavigateOptions(1)}
        className={`text-base text-grey delay-100 cursor-pointer px-[16px] py-2 ${
          navigateOptions === 1 ? selectedClasses : ""
        } `}
      >
        For you
      </div>
      <div
        onClick={() => setNavigateOptions(2)}
        className={`text-base text-grey delay-100 cursor-pointer px-[16px] py-2 ${
          navigateOptions === 2 ? selectedClasses : ""
        } `}
      >
        Discover People
      </div>
    </div>
  );
};

export default function Home() {
  const auth = useSelector((state) => state.auth);
  const main = useSelector((state) => state.main);

  const { userInfo } = auth;
  const usersPosts = main.app.usersPosts;
  console.log("home ", { usersPosts });
  const [img, setImage] = React.useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageHandler = (ev: any) => {
    setImage(URL.createObjectURL(ev.target.files[0]));
  };
  const [navigateOptions, setNavigateOptions] = React.useState(2);

  console.log(img);

  const RenderPosts = () => {
    return usersPosts.postsDataArr.map((postInfo: Post) => (
      <PostCards postInfo={postInfo} />
    ));
  };
  return (
    <div className="h-screen flex">
      <div className="flex">
        <div className="w-[700px] border">
          <HomeContentNavigate
            setNavigateOptions={setNavigateOptions}
            navigateOptions={navigateOptions}
          />
          {navigateOptions === 1 && (
            <>
              <CreatePost />
              <RenderPosts />
            </>
          )}
          {navigateOptions === 2 && (
            <>
              <ListUsers />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import React from "react";
import RightSidebar from "../../components/RightSidebar";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import PostCards from "../../components/PostCards";
import { addUser } from "../../Utils";
import Modal from "../../components/UI/Modal";
import CreatePostModal from "./CreatePostModa";
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
      <div className="w-[400px] border border-white">
        <HomeContentNavigate />
        <div className="flex w-full">
          <HomeIcon sx={{ fontSize: "30px" }} />
          <div className="flex flex-col w-full">
            <details className="dropdown">
              <summary className="btn m-1">open or close</summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
              </ul>
            </details>
            <textarea className="textarea" placeholder="Bio"></textarea>
            <div className="divider"></div>
            <button
              className="btn self-end bg-blue-500 text-white w-fit"
              onClick={() =>
                document.getElementById("create_post_modal").showModal()
              }
            >
              Post
            </button>
          </div>
        </div>
        <PostCards />
      </div>
    </div>
  );
}

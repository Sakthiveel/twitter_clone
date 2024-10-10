import ProfileCard from "./UI/ProfileCard";
import VerifiedIcon from "@mui/icons-material/VerifiedSharp";
import HeartIcon from "@mui/icons-material/FavoriteBorder";
import ReplyIcon from "@mui/icons-material/Reply";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import { Post } from "../Schema/Schema";
import { EllipsisVertical } from "lucide-react";
import Modal from "./UI/Modal";
import Button from "./UI/Button";
interface PostCardsProps {
  postInfo: Post;
}
export default function PostCards(props: PostCardsProps) {
  const { images = [], text_content, likes_count, created_by } = props.postInfo;
  console.log("kit", `${import.meta.env.VITE_IMAGE_URL}${created_by}`);
  return (
    <div className="w-[568px] flex px-4 py-4">
      <DeleteModal />
      <div className="mr-2">
        <ProfileCard url={`${import.meta.env.VITE_IMAGE_URL}${created_by}`} />
      </div>
      <div className="w-full">
        <div className="flex gap-1 items-center">
          <div className="text-base font-bold">Name hehre</div>
          <VerifiedIcon className="" />
          <div className="text-base font-normal text-grey">handler name</div>
          <div className="">.</div>
          <div className="text-base font-normal text-grey">14h</div>
          <details className="dropdown">
            <summary className="">
              <EllipsisVertical className="size-4" />
            </summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li>
                <a>Edit Post</a>
              </li>
              <li
                onClick={() =>
                  document.getElementById("post-delete-modal")?.showModal()
                }
              >
                <a>Delete Post</a>
              </li>
            </ul>
          </details>
        </div>
        <div className="text-base font-normal ">{text_content}</div>
        {images.map((imgSrc) => {
          if (typeof imgSrc !== "string")
            throw new Error("Post Image Src formate invalid , not an string");
          return <ImageViewer imgSrc={imgSrc} />;
        })}
        <div className="flex justify-between">
          <HeartIcon sx={{ fontSize: "24px" }} />
          <ReplyIcon sx={{ fontSize: "24px" }} />
          <LocalPostOfficeIcon sx={{ fontSize: "24px" }} />
          <AutoGraphIcon sx={{ fontSize: "24px" }} />
        </div>
      </div>
    </div>
  );
}

function ImageViewer(props) {
  console.log("ImageViewer", { props });
  return (
    <img
      src={props.imgSrc}
      alt="Shoes"
      className="w-full h-fit max-h-96 object-contain rounded-xl my-4"
    />
  );
}

function DeleteModal() {
  return (
    <Modal modal_id="post-delete-modal" classes="">
      <div className="text-2xl">Delete Post ?</div>
      <div className="mt-4">
        This can’t be undone and it will be removed from your profile, the
        timeline of any accounts that follow you, and from search results.
      </div>
      <div>
        <Button
          btnText="Delete"
          clickHandler={() => {}}
          styles={{ width: "100%", marginTop: 12, backgroundColor: "red" }}
        />
      </div>
    </Modal>
  );
}

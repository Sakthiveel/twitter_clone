import ProfileCard from "./UI/ProfileCard";
import VerifiedIcon from "@mui/icons-material/VerifiedSharp";
import HeartIcon from "@mui/icons-material/FavoriteBorder";
import ReplyIcon from "@mui/icons-material/Reply";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import { Post } from "../Schema/Schema";
interface PostCardsProps {
  postInfo: Post;
}
export default function PostCards(props: PostCardsProps) {
  const { images = [], text_content, likes_count } = props.postInfo;
  return (
    <div className="w-[568px] flex px-4 py-4">
      <div className="mr-2">
        <ProfileCard />
      </div>
      <div className="w-full">
        <div className="flex gap-1">
          <div className="text-base font-bold">Name hehre</div>
          <VerifiedIcon className="" />
          <div className="text-base font-normal text-grey">handler name</div>
          <div className="">.</div>
          <div className="text-base font-normal text-grey">14h</div>
        </div>
        <div className="text-base font-normal ">
          Post content here , can be text and video , contetne will be added
          soon. ok cool
        </div>
        {images.map((imgSrc) => {
          if (typeof imgSrc !== "string") {
            throw new Error("lkdfj");
          }
          return <ImageViewer img={imgSrc} />;
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

function ImageViewer(img: string) {
  return (
    <img src={img} alt="Shoes" className="w-full h-fit  rounded-xl my-4" />
  );
}

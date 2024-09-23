import HomeIcon from "@mui/icons-material/HomeOutlined";
export default function PostCards() {
  return (
    <div className="w-full flex">
      <HomeIcon sx={{ fontSize: "34px" }} />
      <div className="w-full">
        <div className="">Name hehre</div>
        <div>
          Post content here , can be text and video , contetne will be added
          soon. ok cool
        </div>
        <div className="flex justify-between">
          <HomeIcon sx={{ fontSize: "24px" }} />
          <HomeIcon sx={{ fontSize: "24px" }} />
          <HomeIcon sx={{ fontSize: "24px" }} />
          <HomeIcon sx={{ fontSize: "24px" }} />
        </div>
      </div>
    </div>
  );
}

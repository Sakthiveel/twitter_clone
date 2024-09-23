import HomeIcon from "@mui/icons-material/HomeOutlined";
import XIcon from "@mui/icons-material/X";
import DefautlPersonIcon from "@mui/icons-material/AccountBox";

export default function RightSidebar() {
  return (
    <div className="border flex flex-col w-[180px] gap-4">
      <div>
        <HomeIcon sx={{ fontSize: "50px" }} />
      </div>
      {new Array(8).fill("dummy").map(() => {
        return (
          <div className="flex items-center">
            <HomeIcon sx={{ fontSize: "34px" }} />
            <div>Home</div>
          </div>
        );
      })}
      <button className="btn bg-blue-500 text-white">Post</button>
      <div className="flex justify-between border border-white">
        <div className="flex">
          <img src="" alt="kj" className="size-10" />
          <div>
            <div>Sakthi vel</div>
            <div>@shakthi_v2</div>
          </div>
        </div>
        <div className="w-fit border border-white ">....</div>
      </div>
    </div>
  );
}

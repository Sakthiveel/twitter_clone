import HomeIcon from "@mui/icons-material/HomeOutlined";
import XIcon from "@mui/icons-material/X";
import DefautlPersonIcon from "@mui/icons-material/AccountBox";

export default function RightSidebar() {
  return (
    <div className="border flex flex-col w-fit gap-4">
      {new Array(10).fill("dummy").map(() => {
        return (
          <div>
            <HomeIcon sx={{ fontSize: "30px" }} />
            <span>Home</span>
          </div>
        );
      })}
    </div>
  );
}

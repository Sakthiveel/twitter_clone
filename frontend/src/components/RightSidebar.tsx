import HomeIcon from "@mui/icons-material/HomeOutlined";
import { logoutHandler } from "../Utils";
import Button from "./UI/Button";
import { EllipsisVertical, User } from "lucide-react";
import { useDispatch } from "react-redux";
import { logOut } from "../store/AuthAction";
import { globalLoaderToggle } from "../store/Action";
import { useNavigate } from "react-router-dom";

export default function RightSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogOut = async () => {
    dispatch(globalLoaderToggle());
    try {
      const res = await logoutHandler();
      console.log({ res });
      if (res) {
        dispatch(logOut());
      }
    } catch (_err) {
      alert("Something went wrong !");
    } finally {
      dispatch(globalLoaderToggle());
    }
  };
  return (
    <div
      className="border flex flex-col w-[180px] gap-4"
      style={{ position: "sticky", left: 0 }}
    >
      <div>
        <HomeIcon sx={{ fontSize: "50px" }} />
      </div>
      {new Array(7).fill("dummy").map(() => {
        return (
          <div className="flex items-center">
            <HomeIcon sx={{ fontSize: "34px" }} />
            <div>Home</div>
          </div>
        );
      })}
      <div
        className="flex items-end cursor-pointer"
        onClick={() => navigate("/sdf")}
      >
        <User className="size-7 " />
        <div>Profile</div>
      </div>
      <Button btnText="Post" clickHandler={() => {}} styles={{ padding: 8 }} />
      <div className="flex justify-between border border-white ">
        <div className="flex">
          <img src="" alt="kj" className="size-10" />
          <div>
            <div>Sakthi vel</div>
            <div>@shakthi_v2</div>
          </div>
        </div>
        <details className="dropdown">
          <summary className="">
            <EllipsisVertical className="size-4" />
          </summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li onClick={handleLogOut}>
              <a>logout</a>
            </li>
            <li onClick={() => navigate("/settings/user-info")}>
              <a>Go to User Profile</a>
            </li>
          </ul>
        </details>
      </div>
    </div>
  );
}

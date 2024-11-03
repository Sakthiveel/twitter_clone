import HomeIcon from "@mui/icons-material/HomeOutlined";
import { logoutHandler } from "../Utils";
import Button from "./UI/Button";
import { EllipsisVertical, User as ProfileIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { logOut } from "../store/AuthAction";
import { globalLoaderToggle } from "../store/Action";
import { useNavigate } from "react-router-dom";
import Dropdown, { DropDownIconProps, DropDownItem } from "./UI/DropDown";
import { useSelector } from "react-redux";
import { User, UserKeys } from "../Schema/Schema";
import PostCards from "./UI/ProfileCard";

export default function RightSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo: User = useSelector((state) => state.auth.userInfo);
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

  const items: Array<DropDownItem> = [
    {
      displayText: "Logout",
      onClickHandler: handleLogOut,
    },
    {
      displayText: "Go to User Profile",
      onClickHandler: () => navigate("/settings/user-info"),
    },
  ];
  return (
    <div
      className="border-x border-grey py-2 flex flex-col w-[280px] sticky"
      style={{ position: "sticky", left: 0 }}
    >
      <div className="pl-1">
        <HomeIcon sx={{ fontSize: "44px" }} />
      </div>
      {new Array(7).fill("dummy").map((val, index) => {
        return (
          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-grey hover:delay-75 py-4 pl-2 "
            key={`right_sidebar_${index}`}
          >
            <HomeIcon sx={{ fontSize: "34px" }} />
            <div>Home</div>
          </div>
        );
      })}
      <div
        className="flex items-center gap-2 cursor-pointer py-4 pl-2 hover:bg-grey delay-75"
        onClick={() => navigate("/sdf")}
      >
        <ProfileIcon className="size-[34px] " />
        <div>Profile</div>
      </div>
      <div className="flex justify-center pt-6">
        <Button
          btnText="Post"
          clickHandler={() => {}}
          styles={{ padding: 8 }}
          classes="w-[90%] cursor-not-allowed"
        />
      </div>
      <div className="flex justify-between p-2 pr-0">
        <div className="flex gap-2">
          <PostCards
            url={userInfo?.[UserKeys.profile_photo] as string | undefined}
          />
          <div className="">
            <div className="text-norml font-normal leading-5">
              {userInfo?.[UserKeys.display_name]}
            </div>
            <div className="text-sm text-grey font-normal leading-4">
              {"@" + userInfo?.[UserKeys.handler_name]}
            </div>
          </div>
        </div>
        <Dropdown
          dropDownItems={items}
          Ele={EllipsisIcon}
          dropDownWrapperClasses="top-[-60px] left-5"
        />
      </div>
    </div>
  );
}

const EllipsisIcon = (props: DropDownIconProps) => {
  const { onClickHandler } = props;
  return <EllipsisVertical className="size-[22px]" onClick={onClickHandler} />;
};

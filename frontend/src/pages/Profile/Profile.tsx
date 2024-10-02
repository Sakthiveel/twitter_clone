import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProfileCard from "../../components/UI/ProfileCard";
import Button from "../../components/UI/Button";
import { CalendarDays, CircleCheck, MoveLeft } from "lucide-react";
import { getUser } from "../../Utils";
import { UserKeys, User } from "../../Schema/Schema";
export default function Profile() {
  const params = useParams();
  const navigate = useNavigate();
  const defaultUserInfo: User = {
    [UserKeys.uid]: "demo uid",
    // [UserKeys.handler_name]: "demo handler name",
    [UserKeys.display_name]: "demo display name",
    [UserKeys.created_at]: new Date(),
  };
  const [userInfo, setUserInfo] = React.useState<User>(() => defaultUserInfo);
  React.useEffect(() => {
    const getUserHandler = async () => {
      const { status, userInfo } = await getUser(params.handler_name as string);
      console.log("profile page", { userInfo, query: params.handler_name });
      if (status) {
        console.log("oh my god");
        setUserInfo(userInfo);
      }
      // if (!user) {
      //   alert("Something Went wrong");
      // }
      // setUserInfo(user);
    };
    getUserHandler();
  }, []);
  const profileCardClasses = "size-28 absolute bottom-[30px]";
  const editBtnClasses = "border-8 border-red-400";
  return (
    <div className="border w-[570px]">
      <div
        className="flex 
Among the Wildflowers
@deaflibertarian
·
3h
￼
It’s not good to be friends with school shooters. Just sayingpx-4 gap-6 items-center"
      >
        <MoveLeft
          className="size-6 hover:cursor-pointer"
          onClick={() => navigate("/home")}
        />
        <div>
          <div className="text-xl font-bold">
            {userInfo?.[UserKeys.display_name]}
          </div>
          <div className="text-sm text-grey">45 posts</div>
        </div>
      </div>
      <div className="size-44 w-full bg-defaultBC"></div>
      <div className="p-4 pt-0">
        <div className="flex w-full h-[100px] justify-between">
          <div className="relative">
            <ProfileCard classes={profileCardClasses} />
          </div>
          <Button
            btnText="Edit Profile"
            btnVariant={"outline"}
            styles={{ marginTop: 12 }}
          />
        </div>
        <div className="">
          <div className="flex flex-col">
            <div className="flex gap-2">
              <div className="text-xl font-extrabold">
                {userInfo?.[UserKeys.display_name]}
              </div>
              <div className="border rounded-3xl flex py-1 px-2 items-center gap-1">
                <CircleCheck className="size-5" />
                <div className="text-sm font-bold border-grey">
                  Get Verified
                </div>
              </div>
            </div>
            <div className="text-sm text-grey">
              {`@${userInfo?.[UserKeys.handler_name]}`}
            </div>
          </div>
          <div className="flex items-center  gap-1 mt-3">
            <CalendarDays className="text-grey size-4" />
            <div className="text-sm text-grey ">Joined February 2023</div>
          </div>
          <div className="flex gap-2 mt-1">
            <div className="text-sm">
              64 <span className="text-sm text-grey">Following</span>
            </div>
            <div className="text-sm">
              85 <span className="text-sm text-grey">Followers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "../../components/UI/ProfileCard";
import Button from "../../components/UI/Button";
import { CircleCheck, MoveLeft } from "lucide-react";
import { useDispatch } from "react-redux";
import { globalLoaderToggle } from "../../store/Action";
export default function Profile() {
  const params = useParams();
  const dispatch = useDispatch();
  React.useEffect(() => {}, []);
  const profileCardClasses = "size-28 absolute bottom-[30px]";
  const editBtnClasses = "border-8 border-red-400";
  return (
    <div className="border w-[570px]">
      <div className="flex px-4 gap-6 items-center">
        <MoveLeft className="size-6" />
        <div>
          <div className="text-xl font-bold">Sakthivel</div>
          <div className="text-sm text-grey">45 posts</div>
        </div>
      </div>
      <div className="size-44 w-full bg-defaultBC"></div>
      <div className="p-4 pt-0">
        <div className="flex w-full h-[100px] justify-between">
          <div className="relative">
            <ProfileCard classes={profileCardClasses} />
          </div>
          <Button btnText="I am fucked already" classes={editBtnClasses} />
        </div>
        <div className="">
          <div className="flex flex-col">
            <div className="flex gap-2">
              <div className="text-xl font-extrabold">Sakthi vel</div>
              <div className="border rounded-3xl flex py-1 px-2 items-center gap-1">
                <CircleCheck className="size-5" />
                <div className="text-sm font-bold border-grey">
                  Get Verified
                </div>
              </div>
            </div>
            <div className="text-sm text-grey">@shakthivel</div>
          </div>
          <div className="text-sm text-grey mt-3">Joined February 2023</div>
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

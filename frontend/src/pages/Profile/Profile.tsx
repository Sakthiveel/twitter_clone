import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProfileCard from "../../components/UI/ProfileCard";
import Button from "../../components/UI/Button";
import { CalendarDays, CircleCheck, MoveLeft } from "lucide-react";
import { getUser } from "../../Utils";
import { UserKeys, User, Post, PostKeys } from "../../Schema/Schema";
import PostCards from "../../components/PostCards";
import { useSelector } from "react-redux";

export default function Profile() {
  const params = useParams();
  const navigate = useNavigate();
  const {
    auth,
    main: {
      app: {
        usersPosts: { postsDataArr: userPosts },
      },
    },
  } = useSelector((state) => state);
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
      }
    };
    getUserHandler();
  }, []);
  console.log("profile", { userInfo, userPosts });
  return (
    <div>
      <div className="w-[700px]">
        <div className="flex px-4 gap-6 items-center">
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
        {!userInfo?.[UserKeys.bg_photo] && (
          <div
            className={`size-44 w-full bg-[url('${
              userInfo?.[UserKeys.bg_photo]
            }')]`}
          ></div>
        )}
        {userInfo?.[UserKeys.bg_photo] && (
          <img
            className="size-44 w-full aspect-video object-cover"
            src={userInfo?.[UserKeys.bg_photo] as string}
            alt="user_bg_photo"
          />
        )}
        <div className="p-4 pt-0">
          <div className="flex w-full h-[100px] justify-between">
            <div className="relative">
              <ProfileCard
                classes={"size-28 absolute bottom-[30px]"}
                url={userInfo?.[UserKeys.profile_photo] as string | null}
              />
            </div>
            {auth.userInfo.uid === userInfo.uid && (
              <Button
                clickHandler={() => navigate("/settings/user-info")}
                btnText="Edit Profile"
                btnVariant={"outline"}
                styles={{ marginTop: 12 }}
              />
            )}
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
      <RenderUserPosts userPosts={userPosts} auth={auth} />
    </div>
  );
}
interface RenderUserPosts {
  userPosts: Array<Post>;
  auth: object;
}
function RenderUserPosts(props: RenderUserPosts) {
  return (
    <div>
      {props.userPosts.map((postInfo) => {
        if (postInfo[PostKeys.created_by] === props.auth.userInfo.uid) {
          return (
            <PostCards
              postInfo={postInfo}
              key={`user_poste_${postInfo?.[PostKeys.post_id]}`}
            />
          );
        }
        return null;
      })}
    </div>
  );
}

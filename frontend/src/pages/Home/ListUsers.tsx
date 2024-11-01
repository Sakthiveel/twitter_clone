import React from "react";
import { Ellipsis } from "lucide-react";
import ProfileCard from "../../components/UI/ProfileCard";
import { User, UserKeys } from "../../Schema/Schema";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../Firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/UI/Button";
import { useDispatch } from "react-redux";
import { globalLoaderToggle, updateUsersList } from "../../store/Action";
import { addFollowing, removeFollowing } from "../../Utils";
import isEqual from "lodash/isEqual";
import { StarRateTwoTone } from "@mui/icons-material";

interface UserCard {
  [UserKeys.display_name]: string;
  [UserKeys.handler_name]: string;
  [UserKeys.uid]: string;
  [UserKeys.profile_photo]?: string;
}

// interface ListUsersProps {
//   usersList: Array<UserCard>;
// }
export default function ListUsers() {
  const loggedInUserInfo = useSelector((state) => state.auth.userInfo);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const usersList = useSelector(
    (state) => state.main.app.newUsers.newUsersDataArr
  );
  console.log("ListUsers");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  React.useEffect(() => {
    const listener = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersListToSet: Array<User> = [];
      snapshot.docs.forEach((doc) => usersListToSet.push(doc.data() as User));
      console.log("listUsers", { usersList, usersListToSet });
      if (!isEqual(usersList, usersListToSet)) {
        dispatch(updateUsersList({ usersList: usersListToSet }));
      }
    });
    return () => {
      listener();
    };
  }, []);
  const handleAddFollowing = async (uid: string) => {
    dispatch(globalLoaderToggle());
    try {
      await addFollowing(loggedInUserInfo?.[UserKeys.uid], [uid], accessToken);
    } catch (err) {
      console.log("add followers ", err.message);
    } finally {
      dispatch(updateUsersList({ usersList }));
      dispatch(globalLoaderToggle());
    }
  };

  const handleRemoveFollowing = async (uid: string) => {
    dispatch(globalLoaderToggle());
    try {
      await removeFollowing(
        loggedInUserInfo?.[UserKeys.uid],
        [uid],
        accessToken
      );
    } catch (err) {
      console.log("handleRemoveFollowing", err.message);
    } finally {
      dispatch(globalLoaderToggle());
    }
  };
  console.log("List Users", { usersList });
  return (
    <div>
      {usersList.map((userInfo) => {
        if (userInfo?.[UserKeys.uid] === loggedInUserInfo?.[UserKeys.uid])
          return null;
        return (
          <UserCard
            userInfo={userInfo}
            key={`userCard_${userInfo.uid}`}
            navigate={navigate}
            handleAddFollowing={handleAddFollowing}
            handleRemoveFollowing={handleRemoveFollowing}
            isFollowing={false}
          />
        );
      })}
    </div>
  );
}

interface UserCardProps {
  userInfo: User;
  navigate: unknown;
  handleAddFollowing(uid: string): void;
  handleRemoveFollowing(uid: string): void;
  isFollowing: boolean;
}
function UserCard(props: UserCardProps) {
  const {
    userInfo,
    navigate,
    handleAddFollowing,
    handleRemoveFollowing,
    isFollowing = true,
  } = props;
  console.log("UserCAred", { userInfo });
  const [showUnFollowBtn, setShowUnFollowBtn] = React.useState<boolean>(false);

  return (
    <div className="p-4 pb-0 flex justify-between items-center">
      <div className="flex gap-2 items-start">
        <div>
          <ProfileCard url={userInfo?.[UserKeys.profile_photo]} />
        </div>
        <div onClick={() => navigate(`/${userInfo?.[UserKeys.handler_name]}`)}>
          <div className="text-base font-bold delay-300 hover:underline hover:underline-offset-2">
            {userInfo?.[UserKeys.display_name]}
          </div>
          <div>
            <div className="text-sm font-normal text-grey">
              {userInfo?.[UserKeys.handler_name]}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <div
          className=""
          onMouseEnter={() => isFollowing && setShowUnFollowBtn(true)}
          onMouseLeave={() => isFollowing && setShowUnFollowBtn(false)}
        >
          {!showUnFollowBtn ? (
            <Button
              btnText="follow"
              clickHandler={() => handleAddFollowing(userInfo?.[UserKeys.uid])}
            />
          ) : (
            <Button
              btnText="Unfollow"
              clickHandler={() =>
                handleRemoveFollowing(userInfo?.[UserKeys.uid])
              }
            />
          )}
        </div>
        <Ellipsis className="text-grey" />
      </div>
    </div>
  );
}

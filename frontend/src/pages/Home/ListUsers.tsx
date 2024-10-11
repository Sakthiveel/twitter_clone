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
import { globalLoaderToggle } from "../../store/Action";
import { addFollowers } from "../../Utils";

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
  const { userInfo: loggedInUserInfo, accessToken } = useSelector(
    (state) => state.auth
  );
  const [usersList, setUsersList] = React.useState<Array<User>>(() => []);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  React.useEffect(() => {
    const listener = onSnapshot(collection(db, "users"), (snapshot) => {
      const users: Array<User> = [];
      snapshot.docs.forEach((doc) => users.push(doc.data() as User));
      setUsersList(() => users);
    });
    return () => {
      listener();
    };
  }, []);
  const handleAddFollowers = async (uid: string) => {
    dispatch(globalLoaderToggle());
    try {
      await addFollowers(loggedInUserInfo?.[UserKeys.uid], [uid], accessToken);
    } catch (err) {
      console.log("add followers ", err.message);
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
            handleAddFollowers={handleAddFollowers}
          />
        );
      })}
    </div>
  );
}

interface UserCardProps {
  userInfo: User;
  navigate: unknown;
  handleAddFollowers: unknown;
}
function UserCard(props: UserCardProps) {
  const { userInfo, navigate, handleAddFollowers } = props;
  console.log("UserCAred", { userInfo });
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
        <Button
          btnText="follow"
          clickHandler={() => handleAddFollowers(userInfo?.[UserKeys.uid])}
        />
        <Ellipsis className="text-grey" />
      </div>
    </div>
  );
}

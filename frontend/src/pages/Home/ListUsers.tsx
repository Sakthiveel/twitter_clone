import React from "react";
import { Ellipsis } from "lucide-react";
import ProfileCard from "../../components/UI/ProfileCard";
import { User, UserKeys } from "../../Schema/Schema";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../Firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
  const [usersList, setUsersList] = React.useState<Array<User>>(() => []);
  const navigate = useNavigate();
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

  return (
    <div>
      {usersList.map((userInfo: UserCard) => {
        if (userInfo?.[UserKeys.uid] === loggedInUserInfo?.[UserKeys.uid])
          return null;
        return (
          <UserCard
            userInfo={userInfo}
            key={`userCard_${userInfo.uid}`}
            navigate={navigate}
          />
        );
      })}
    </div>
  );
}

function UserCard({ userInfo, navigate }) {
  return (
    <div
      className="p-4 pb-0 flex justify-between items-center"
      onClick={() => navigate(`/${userInfo?.[UserKeys.handler_name]}`)}
    >
      <div className="flex gap-2 items-start">
        <div>
          <ProfileCard classes="" />
        </div>
        <div>
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
      <Ellipsis className="text-grey" />
    </div>
  );
}

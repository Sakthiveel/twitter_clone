import React from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import SignIn from "./pages/SignIn/SignIn";
import { useDispatch, useSelector } from "react-redux";
import { db, auth as firebaseAuth } from "./Firebase";
import { globalLoaderToggle, updateUserPosts } from "./store/Action";
import { checkUserExist } from "./Utils";
import { setTempUserInfo, setUserInfo, signIn } from "./store/AuthAction";
import { Post, tempUser, UserKeys } from "./Schema/Schema";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import UserInfo from "./pages/settings/UserInfo";
import Profile from "./pages/Profile/Profile";

function App() {
  const {
    auth,
    auth: {
      userInfo: { uid },
    },
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log({ auth });

  React.useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (res) => {
      console.log("onAuthState change", { res });
      if (res && !auth.isAuthenticated) {
        const { accessToken, uid } = res;
        console.log("Auto Log in ", { res });

        dispatch(globalLoaderToggle());
        try {
          const userInfo = await checkUserExist(uid);
          console.log("App.tsx", { userInfo, uid });
          if (Object.keys(userInfo ?? {}).length) {
            dispatch(signIn({ accessToken, userInfo }));
            navigate("/home");
          } else {
            const { displayName, email, photoURL } = res.providerData[0];
            const { uid, accessToken } = res;
            const tempUserInfo: tempUser = {
              [UserKeys.uid]: uid,
              [UserKeys.display_name]: displayName,
              [UserKeys.email]: email,
              [UserKeys.profile_photo]: photoURL,
              accessToken,
            };
            dispatch(setTempUserInfo({ tempUserInfo }));
            navigate("/sign-in");
          }
        } catch (err) {
          console.log({ err });
          alert("Something went wrong , Please try again");
        }
        dispatch(globalLoaderToggle());
        console.log("logged in", { res });
      } else if (!res && auth.isAuthenticated) {
        // dispatch(logOut());
      }
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    let userListener = () => {};
    let postListener = () => {};
    if (auth.isAuthenticated) {
      userListener = onSnapshot(doc(db, "users", uid), (doc) => {
        dispatch(setUserInfo({ userInfo: doc.data() }));
        console.log("Current data: ", doc.data());
      });
      const userPostQuery = query(
        collection(db, "posts"),
        where("created_by", "==", auth.userInfo.uid)
      );
      postListener = onSnapshot(userPostQuery, (querySnapshot) => {
        const userPosts: Array<Post> = [];
        querySnapshot.forEach((doc) => {
          userPosts.push(doc.data() as Post);
        });
        dispatch(updateUserPosts({ postsData: userPosts }));
        console.log("Current cities in CA: ", { userPosts });
      });
    }

    return () => {
      // removing listeners
      userListener();
      postListener();
    };
  }, [auth.isAuthenticated]);

  const ProtectRoutes = ({ element }) => {
    return auth.isAuthenticated ? element : <Navigate to={"/sign-in"} />;
  };
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<ProtectRoutes element={<Home />} />} />
        <Route path="/home" element={<ProtectRoutes element={<Home />} />} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="settings/user-info" element={<UserInfo />} />
        <Route
          path="/:handler_name"
          element={<ProtectRoutes element={<Profile />} />}
        />
      </Routes>
    </div>
  );
}
export default App;

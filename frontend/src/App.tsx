import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import UserProfile from "./pages/UserProfile";
import SignIn from "./pages/SignIn/SignIn";
import { useDispatch, useSelector } from "react-redux";
import { auth as firebaseAuth } from "./Firebase";
import { globalLoaderToggle } from "./store/Action";
import { checkUserExist } from "./actions/actions";
import { setTempUserInfo, signIn } from "./store/AuthAction";
import { tempUser, UserKeys, userSchema } from "./Schema/Schema";
import { object } from "joi";

function App() {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log({ auth });

  React.useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (res) => {
      if (res && !auth.isAuthenticated) {
        const { accessToken, uid } = res;
        console.log("Auto Log in ", { res });

        dispatch(globalLoaderToggle());
        try {
          const userInfo = await checkUserExist(uid);
          console.log("App.tsx", { userInfo });
          if (Object.keys(userInfo ?? {}).length) {
            dispatch(signIn({ accessToken, userInfo }));
            navigate("/");
          } else {
            const { displayName, email, photoURL } = res.providerData[0];
            const { uid } = res;
            const tempUserInfo: tempUser = {
              [UserKeys.uid]: uid,
              [UserKeys.display_name]: displayName,
              [UserKeys.email]: email,
              [UserKeys.profile_photo]: photoURL,
            };
            dispatch(setTempUserInfo({ tempUserInfo }));
            dispatch(signIn({ accessToken }));
            navigate("/sign-in");
          }
        } catch (err) {
          console.log({ err });
          alert("Something went wrong , Please try again");
        }
        dispatch(globalLoaderToggle());
        console.log("logged in", { res });
      } else {
        console.log("logout happned");
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/:handler_name" element={<UserProfile />} />
      </Routes>
    </div>
  );
}
export default App;

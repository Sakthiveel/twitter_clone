import React from "react";
import { signInWithPopup, UserCredential } from "firebase/auth";
import { auth as firebaseAuth, googleAuthProvider } from "../../Firebase";
import { useDispatch, useSelector } from "react-redux";
import { setTempUserInfo, setUserInfo, signIn } from "../../store/AuthAction";
import { useNavigate } from "react-router-dom";
import { globalLoaderToggle } from "../../store/Action";
import { addUser } from "../../actions/actions";
import { tempUser, User, UserKeys, userSchema } from "../../Schema/Schema";
import { uid } from "uid";

export default function SignIn() {
  const [handle_name, setHandleName] = React.useState<string>("");
  const {
    auth,
    auth: { tempUserInfo },
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signInHandler = async () => {
    try {
      const userRes: UserCredential = await signInWithPopup(
        firebaseAuth,
        googleAuthProvider
      );
      const { displayName, email, photoURL } = userRes.user.providerData[0];
      const { uid } = userRes.user;
      const accessToken = userRes.user.accessToken;
      const tempUserToProcess = {
        [UserKeys.display_name]: displayName,
        [UserKeys.uid]: uid,
        [UserKeys.email]: email,
        [UserKeys.profile_photo]: photoURL,
      };
      dispatch(setTempUserInfo(tempUserToProcess));
      dispatch(signIn({ accessToken }));
    } catch (err) {
      console.log({ err });
    }
  };

  const clickHandler = async () => {
    dispatch(globalLoaderToggle());
  };

  const getUserInfoToProcess = (): User => {
    const user: User = { [UserKeys.uid]: tempUserInfo?.[UserKeys.uid] };
    if (
      !tempUserInfo?.[UserKeys.display_name] &&
      tempUserInfo?.[UserKeys.email]
    ) {
      Object.assign(user, {
        [UserKeys.display_name]: tempUserInfo?.[UserKeys.email],
      });
    } else if (tempUserInfo?.[UserKeys.display_name]) {
      Object.assign(user, {
        [UserKeys.display_name]: tempUserInfo?.[UserKeys.display_name],
      });
    }
    if (tempUserInfo?.[UserKeys.profile_photo]) {
      Object.assign(user, {
        [UserKeys.profile_photo]: tempUserInfo?.[UserKeys.profile_photo],
      });
    }
    return {
      ...user,
      [UserKeys.handler_name]: handle_name,
      [UserKeys.created_at]: new Date(),
    };
  };

  const submitHandlerName = async () => {
    let networkRes: Response;

    try {
      networkRes = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/handler_name_exist`
      );
      if (!networkRes.ok) {
        throw new Error("Request Failed");
      }
      const data = await networkRes.json();
      if (true) {
        const userInfo = getUserInfoToProcess();
        const { error } = userSchema.validate(userInfo);
        if (error) throw new Error(error.message);
        const isUserAdded = await addUser(getUserInfoToProcess());
        if (!isUserAdded) {
          alert("Something went wrong , Please try again");
          return;
        }
        if (isUserAdded) {
          dispatch(setUserInfo({ userInfo }));
          navigate("/");
        }
      }
    } catch (err) {
      console.log("submitHandlerName", { err, networkRes });
    }
  };

  //   React.useEffect(() => {
  //     const unsubscribe = auth.onAuthStateChanged((user) => {
  //       if (user) {
  //         console.log("auth change", { user });
  //       }
  //     });
  //     return () => unsubscribe();
  //   });

  return (
    <div>
      {!auth.isAuthenticated ? (
        <>
          <button onClick={signInHandler}>SignIn page</button>
          <button onClick={clickHandler}>click here</button>
        </>
      ) : (
        <div>
          <div>
            Hi {tempUserInfo?.[UserKeys.display_name]} , Please provide an
            handler name to complete account creation process
          </div>
          <input
            type="text"
            value={handle_name}
            onChange={(ev) => setHandleName(ev.target.value)}
          />
          <button onClick={submitHandlerName}>Create Twitter Account</button>
        </div>
      )}
    </div>
  );
}

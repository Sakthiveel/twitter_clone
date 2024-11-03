import React from "react";
import { signInWithPopup, UserCredential } from "firebase/auth";
import { auth as firebaseAuth, googleAuthProvider } from "../../Firebase";
import { useDispatch, useSelector } from "react-redux";
import { setTempUserInfo, signIn } from "../../store/AuthAction";
import { useNavigate } from "react-router-dom";
import {
  addUser,
  checkHandlerNameAvailable,
  checkUserExist,
} from "../../Utils";
import { tempUser, User, UserKeys, userSchema } from "../../Schema/Schema";

export default function SignIn() {
  const [handle_name, setHandleName] = React.useState<string>("");
  const [tempAccessToken, setTempAccessToken] = React.useState<string | null>(
    null
  );
  const auth = useSelector((state) => state.auth);
  const tempUserInfo = useSelector((state) => state.auth.tempUserInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signInHandler = async () => {
    try {
      const userRes: UserCredential = await signInWithPopup(
        firebaseAuth,
        googleAuthProvider
      );
      const { displayName, email, photoURL } = userRes.user.providerData[0];
      const { uid, accessToken } = userRes.user;
      const tempUserToProcess = {
        [UserKeys.display_name]: displayName,
        [UserKeys.uid]: uid,
        [UserKeys.email]: email,
        [UserKeys.profile_photo]: photoURL,
      };
      setTempAccessToken(accessToken);
      const userInfo: User | null = await checkUserExist(uid);
      console.log("signINHandler", { userInfo });
      if (userInfo) {
        dispatch(signIn({ userInfo, accessToken }));
        navigate("/home");
      } else {
        dispatch(setTempUserInfo(tempUserToProcess));
      }
    } catch (err) {
      console.log({ err });
    }
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
    try {
      const ishandlerNameAvailable: boolean = await checkHandlerNameAvailable(
        handle_name
      );
      console.log({ ishandlerNameAvailable });
      if (ishandlerNameAvailable) {
        const userInfo = getUserInfoToProcess();
        const { error } = userSchema.validate(userInfo);
        if (error) throw new Error(error.message);
        const isUserAdded = await addUser(
          getUserInfoToProcess(),
          auth.accessToken
        );
        if (!isUserAdded) {
          alert("Something went wrong , Please try again");
          return;
        }
        if (isUserAdded) {
          dispatch(signIn({ userInfo, accessToken: tempUserInfo.accessToken }));
          navigate("/home");
        }
      }
    } catch (err) {
      console.log("submitHandlerName", { err });
    }
  };
  console.debug({ tempUserInfo });
  return (
    <div>
      {!tempUserInfo?.[UserKeys.uid] ? (
        <>
          <button onClick={signInHandler}>Sign In With Google </button>
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

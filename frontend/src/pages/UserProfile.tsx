import React from "react";
import { addUser, defaultuser } from "../Utils";
import { User, UserKeys, userSchema } from "../Schema/Schema";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "../store/userAction";
import { useParams } from "react-router-dom";
import { globalLoaderToggle } from "../store/Action";
import Button from "../components/UI/Button";

export default function UserProfile() {
  const auth = useSelector((state) => state.auth);
  const [userInfo, setUserInfo] = React.useState<User>(() => auth.userInfo);
  const [previewProfilePhot, setPreviewProifilePhoto] = React.useState<
    string | null
  >(null);
  const [previewBgPhoto, setPreviewBgPhoto] = React.useState<string | null>(
    null
  );

  const { handler_name } = useParams();
  const {
    main: { globalLoader },
  } = useSelector((state) => state);
  console.log("userProfile", { handler_name, globalLoader });
  const dispatch = useDispatch();

  const imageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size > 1048576) {
      alert("Image size is greater than 1mb . Please choose another photo");
      return;
    }
    if (file) {
      setUserInfo((prevSt) =>
        Object.assign({}, prevSt, {
          [event.target.name]: file,
        })
      );

      if (UserKeys.profile_photo === event.target.name) {
        setPreviewProifilePhoto(URL.createObjectURL(file));
      }
      if (UserKeys.bg_photo === event.target.name) {
        setPreviewBgPhoto(URL.createObjectURL(file));
      }
    }
  };

  const editUserInfo = async () => {
    dispatch(globalLoaderToggle());
    const { error } = userSchema.validate(userInfo);
    if (error) {
      alert(error.message);
      return;
    }
    try {
      const response = await editUserInfo(userInfo);
      console.log({ response });
    } catch (err) {
      alert(err);
    } finally {
      dispatch(globalLoaderToggle());
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center border">
      <div className="border w-fit rounded-xl border-grey p-4">
        <div className="text-xl font-medium mb-2">User Information:</div>
        <div className="flex flex-col w-[500px] gap-2">
          {previewProfilePhot && (
            <img
              src={previewProfilePhot}
              alt="profile_photo"
              className="size-40"
            />
          )}
          {previewBgPhoto && (
            <img
              src={previewBgPhoto}
              alt="background-photo"
              className="size-40"
            />
          )}
          <input
            type="file"
            name={UserKeys.bg_photo}
            accept="image/*"
            className="file-input file-input-bordered file-input-md w-full max-w-xs"
            onChange={imageHandler}
          />
          <button onClick={() => dispatch(globalLoaderToggle())}>
            click here{" "}
          </button>
          <span>{globalLoader ? "Loading" : "Not Loading"}</span>
          <input
            type="file"
            name={UserKeys.profile_photo}
            accept="image/*"
            className="file-input file-input-bordered file-input-md w-full max-w-xs"
            onChange={imageHandler}
          />

          <input
            type="text"
            name={UserKeys.display_name}
            placeholder="Name"
            className="input input-bordered w-full max-w-xs"
            value={userInfo.display_name}
            onChange={(ev) =>
              setUserInfo((prevSt) =>
                Object.assign({}, prevSt, { display_name: ev.target.value })
              )
            }
          />
          <input
            type="text"
            name={UserKeys.handler_name}
            placeholder="handler_name"
            className="input input-bordered w-full max-w-xs"
            value={userInfo.handler_name}
            onChange={(ev) =>
              setUserInfo((prevSt) =>
                Object.assign({}, prevSt, { display_name: ev.target.value })
              )
            }
          />
          <input
            type="number"
            name={UserKeys.age}
            placeholder="age"
            className="input input-bordered w-full max-w-xs"
            value={userInfo.age}
            onChange={(ev) =>
              setUserInfo((prevSt) =>
                Object.assign({}, prevSt, { age: ev.target.value })
              )
            }
          />
          <textarea
            className="textarea"
            placeholder="Bio"
            name={UserKeys.bio}
            value={userInfo.bio}
            onChange={(ev) =>
              setUserInfo((prevSt) =>
                Object.assign({}, prevSt, { bio: ev.target.value })
              )
            }
          ></textarea>
          <div className="flex justify-between">
            <Button btnText="Back" clickHandler={() => {}} />
            <Button btnText="Edit" clickHandler={editUserInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}

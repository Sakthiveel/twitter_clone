import React from "react";
import { addUser, defaultuser } from "../Utils";
import { User, UserKeys, userSchema } from "../Schema/Schema";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "../store/userAction";
import { useParams } from "react-router-dom";
import { globalLoaderToggle } from "../store/Action";
import Button from "../components/UI/Button";
import ProfileCard from "../components/UI/ProfileCard";

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
        <div className="flex flex-col w-[500px] gap-2">
          <div
            onClick={() => document.getElementById(UserKeys.bg_photo)?.click()}
            className="w-full border border-grey h-20"
          >
            {previewBgPhoto ? (
              <img
                src={previewBgPhoto ?? ""}
                alt={UserKeys.bg_photo}
                className="w-full h-full object-contain"
              />
            ) : (
              <div>Click Here to add Background Image</div>
            )}
            <input
              type="file"
              name={UserKeys.bg_photo}
              id={UserKeys.bg_photo}
              accept="image/*"
              className="hidden"
              onChange={imageHandler}
            />
          </div>
          <div
            onClick={() =>
              document.getElementById(UserKeys.profile_photo)?.click()
            }
          >
            <ProfileCard url={previewProfilePhot} />
            <input
              type="file"
              name={UserKeys.profile_photo}
              id={UserKeys.profile_photo}
              accept="image/*"
              className="hidden"
              onChange={imageHandler}
            />
          </div>

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

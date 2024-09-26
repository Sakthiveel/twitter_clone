import React from "react";
import { addUser, defaultuser } from "../actions/actions";
import { User, UserKeys, userSchema } from "../Schema/Schema";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "../store/userAction";
import { useParams } from "react-router-dom";
import { globalLoaderToggle } from "../store/Action";

export default function UserProfile() {
  const [userInfo, setUserInfo] = React.useState<User>(() => defaultuser);
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
    dispatch(increment());
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

  const saveHandler = async () => {
    //edit hadling here

    const { error } = userSchema.validate(userInfo);
    if (error) {
      alert(error.message);
      return;
    }
    try {
      const response = await addUser(userInfo);
      console.log({ response });
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="flex flex-col w-[500px] gap-2">
      {previewProfilePhot && (
        <img src={previewProfilePhot} alt="profile_photo" className="size-40" />
      )}
      {previewBgPhoto && (
        <img src={previewBgPhoto} alt="background-photo" className="size-40" />
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
      <button className="btn bg-blue-500 text-white" onClick={saveHandler}>
        Save changes
      </button>
    </div>
  );
}

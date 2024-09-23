import React from "react";
import { defaultuser } from "../actions/actions";
import { User } from "../Schema/Schema";

export default function UserProfile() {
  const [userInfo, setUserInfo] = React.useState<User>(() => defaultuser);
  const [previewImg, setPreviewImg] = React.useState<string | null>(null);
  const fileHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size > 1048576) {
      alert("Image size is greater than 1mb . Please choose another photo");
      return;
    }
    if (file) {
      console.log({ file });
      const imageUrl = URL.createObjectURL(file);
      setPreviewImg(imageUrl);
    }
  };
  return (
    <div className="flex flex-col w-[500px] gap-2">
      {previewImg && (
        <img src={previewImg} alt="profile_photo" className="size-40" />
      )}
      <input
        type="file"
        accept="image/*"
        className="file-input file-input-bordered file-input-md w-full max-w-xs"
        onChange={fileHandler}
      />
      <input
        type="text"
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
        type="number"
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
        value={userInfo.bio}
        onChange={(ev) =>
          setUserInfo((prevSt) =>
            Object.assign({}, prevSt, { bio: ev.target.value })
          )
        }
      ></textarea>
      <button className="btn bg-blue-500 text-white">Save changes</button>
    </div>
  );
}

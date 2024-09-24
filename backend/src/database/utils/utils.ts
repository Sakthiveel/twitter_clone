import { imagekit } from "../../..";
import { UploadedFile } from "express-fileupload";

export const imageUploader = async (
  file: UploadedFile
): Promise<string | null> => {
  try {
    const uploadRes = await imagekit.upload({
      file: file.data,
      fileName: file.name, //required
      extensions: [
        {
          name: "google-auto-tagging",
          maxTags: 5,
          minConfidence: 95,
        },
      ],
      transformation: {
        pre: "l-text,i-Imagekit,fs-50,l-end",
        post: [
          {
            type: "transformation",
            value: "w-100",
          },
        ],
      },
    });
    return uploadRes.url;
  } catch (err) {
    console.log("image upload", err);
    return null;
  }
};

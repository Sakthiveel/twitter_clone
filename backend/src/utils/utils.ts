import { imagekit } from "../..";
import { UploadedFile } from "express-fileupload";

export const imageUploader = async (
  file: UploadedFile,
  fileName: string,
  folder: string
): Promise<string> => {
  try {
    const uploadRes = await imagekit.upload({
      file: file.data,
      fileName: fileName, //required
      useUniqueFileName: false,
      overwriteFile: true,
      folder,
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
    console.log({ uploadRes });
    return uploadRes.url;
  } catch (err) {
    console.log("image upload", err);
    throw new Error("Impage Upload Failed");
  }
};

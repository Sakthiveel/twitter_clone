import express, { Request, Response, NextFunction } from "express";
import {
  addFollowers,
  addFollowing,
  addUser,
  getUser,
  handlerExists,
  removeFollowers,
  removeFollowing,
  updateUser,
} from "./src/database/User";
import { addPost, updatePost } from "./src/database/Post";
import { authHandler } from "./src/database/auth";
import cors from "cors";
import fileUpload, { UploadedFile } from "express-fileupload";
import ImageKit from "imagekit";
import { imageUploader } from "./src/utils/utils";
import { json } from "stream/consumers";
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
//Midddle for processing file upload
app.use(fileUpload());

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const corsOptions = {
  origin: "http://localhost:3000", //(https://your-client-app.com)
};
app.use(cors(corsOptions));

// Extend the Express Request interface to include the files property
interface FileUploadRequest extends Request {
  files?: { [key: string]: UploadedFile };
}
app.get("/", (req: Request, res: Response) => {
  res.send("Server running all good");
});

app.get("/handler_name_exist", async (req, res) => {
  try {
    const check_name = req.query.check_name as string;
    if (!check_name?.length) {
      throw new Error("Check name is not valid to perform checking");
    }
    console.log({ check_name, values: req.query.check_name });
    const isAlreadyExist: boolean = await handlerExists(check_name);
    res.send(JSON.stringify({ status: isAlreadyExist }));
  } catch (err) {
    console.log("handler name exist route", { err });
    res.send(JSON.stringify({ status: false, res: err?.message }));
  }
});

app.get("/check_user_exists", async (req: Request, res) => {
  try {
    const uid = req.query.uid as string;
    const userInfo = await getUser(uid, null);
    res.send(JSON.stringify({ isUserExist: Boolean(userInfo), userInfo }));
  } catch (err) {
    res.send({ status: false, res: err.message });
  }
});

app.get("/getUser", async (req: Request, res) => {
  try {
    const handler_name = req.query.handler_name as string;
    console.log("getUser end point", { handler_name });
    const userInfo = await getUser(null, handler_name);
    res.send(JSON.stringify({ status: Boolean(userInfo), userInfo }));
  } catch (err) {
    res.send({ status: false, res: err.message });
  }
});

app.post("/v1/addUser", async (req: FileUploadRequest, res: Response) => {
  try {
    const userInfo = req.body;
    let { profile_photo = "", bg_photo = "" } = req.files ?? {};
    console.log("end point", { files: req.files });
    if (typeof profile_photo === "object") {
      profile_photo = await imageUploader(
        profile_photo,
        userInfo.uid,
        "/profile_photos"
      );
      if (!profile_photo) {
        throw new Error("Image Upload Failed");
      }
      Object.assign(userInfo, { profile_photo });
    }
    if (typeof bg_photo === "object") {
      bg_photo = await imageUploader(bg_photo, userInfo.uid, "/bg_photos");
      if (!bg_photo) {
        throw new Error("Image Upload Failed");
      }
      Object.assign(userInfo, { bg_photo });
    }
    await addUser(userInfo);
    res.send({ status: true });
  } catch (err) {
    res.send({ status: false, res: err.message });
  }
});

app.post("/addFollowing", authHandler, async (req: Request, res: Response) => {
  try {
    const { addFollowingUids = [], currentUserUid } = req.body;
    console.log("addFolloers route", {
      addFollowingUids,
      currentUserUid,
      body: req.body,
    });
    await addFollowing({
      currentUserId: currentUserUid,
      followingUIds: addFollowingUids,
    });
    res.send({ status: true });
  } catch (err) {
    res.send({ status: false, res: err.message });
  }
});

app.post(
  "/removeFollowing",
  authHandler,
  async (req: Request, res: Response) => {
    try {
      const { removeFollowingUids = [], currentUserUid } = req.body;
      console.log("removeFollowing route", {
        removeFollowingUids,
        currentUserUid,
        body: req.body,
      });
      await removeFollowing({
        currentUserUid,
        removeFollowingUids,
      });
      res.send({ status: true });
    } catch (err) {
      res.send({ status: false, res: err.message });
    }
  }
);

app.post(
  "/removeFollowers",
  authHandler,
  async (req: Request, res: Response) => {
    try {
      const { removeFollowersUids = [], currentUserUid } = req.body;
      console.log("removeFollowers route", {
        removeFollowersUids,
        currentUserUid,
        body: req.body,
      });
      await removeFollowers(currentUserUid, removeFollowersUids);
      res.send({ status: true });
    } catch (err) {
      res.send({ status: false, res: err.message });
    }
  }
);

// app.post("/upload", (req: Request, res: Response) => {
//   // Check if files were uploaded
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).send("No files were uploaded.");
//   }

//   // Access the uploaded file
//   const file = req.files.myFile as UploadedFile;

//   // Move the file to the desired location
//   file.mv("/path/to/destination/filename.ext", (err) => {
//     if (err) {
//       return res.status(500).send(err);
//     }

//     res.send("File uploaded successfully");
//   });
// });

app.post("/v1/updateUser", authHandler, async (req: Request, res: Response) => {
  try {
    const userInfo = req.body;
    console.log("update user", { userInfo });
    await updateUser(userInfo);
    res.send({ status: true });
  } catch (err) {
    res.send({ status: false, res: err });
  }
});

app.post(
  "/v1/addPost",
  authHandler,
  async (req: FileUploadRequest, res: Response) => {
    try {
      const postInfo = req.body;
      let images = req.files?.["images[]"];
      let imagesToStore: Array<string> = [];
      console.log("psf", { images });
      if (images) {
        images = Array.isArray(images) ? images : [images];
        imagesToStore = await Promise.all(
          images.map(async (img: File, index: number) => {
            return await imageUploader(img, `post_image_${index}`, "posts");
          })
        );
      }

      Object.assign(postInfo, { images: imagesToStore });
      console.log("add post endpoint", { postInfo });
      await addPost(postInfo);
      res.send({ status: true });
    } catch (err) {
      console.log({ err });
      res.send({ staus: false, res: err });
    }
  }
);

app.post("/v1/updatePost", authHandler, async (req: Request, res: Response) => {
  try {
    const postInfo = req.body;
    console.log("udpate post", { postInfo });
    await updatePost(postInfo);
    res.send({ status: true });
  } catch (err) {
    res.send({ staus: false, res: err });
  }
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running at ${process.env.SERVER_PORT}`);
});

import express, { Request, Response, NextFunction } from "express";
import { addUser, getUser, updateUser } from "./src/database/User";
import { addPost, updatePost } from "./src/database/Post";
import { authHandler } from "./src/database/auth";
import cors from "cors";
import fileUpload, { UploadedFile } from "express-fileupload";
import ImageKit from "imagekit";
import { imageUploader } from "./src/utils/utils";
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

app.get("/handler_name_exist", (req, res) => {
  res.send(JSON.stringify("Selena Gomez"));
});

app.get("/v1/check_user_exists", async (req: Request, res) => {
  try {
    const userInfo = await getUser(req.query.uid);
    res.send(JSON.stringify({ isUserExist: Boolean(userInfo), userInfo }));
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
      profile_photo = await imageUploader(profile_photo);
      if (!profile_photo) {
        throw new Error("Image Upload Failed");
      }
      Object.assign(userInfo, { profile_photo });
    }
    if (typeof bg_photo === "object") {
      bg_photo = await imageUploader(bg_photo);
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

app.post("/v1/addPost", authHandler, async (req: Request, res: Response) => {
  try {
    const postInfo = req.body;
    console.log("add post", { postInfo });
    await addPost(postInfo);
    res.send({ status: true });
  } catch (err) {
    res.send({ staus: false, res: err });
  }
});

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

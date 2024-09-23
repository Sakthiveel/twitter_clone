import express, { Request, Response, NextFunction } from "express";
import { addUser, updateUser } from "./src/database/User";
import { addPost, updatePost } from "./src/database/Post";
import { authHandler } from "./src/database/auth";
import cors from "cors";
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:3000", //(https://your-client-app.com)
};
app.use(cors(corsOptions));
app.get("/", (req: Request, res: Response) => {
  res.send("Server running all good");
});
app.post("/v1/addUser", async (req: Request, res: Response) => {
  try {
    const userInfo = req.body;
    console.log("add user", { userInfo });
    await addUser(userInfo);
    res.send({ status: true });
  } catch (err) {
    res.send({ status: false, res: err });
  }
});

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

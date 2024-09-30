import { NextFunction, Request, Response } from "express";
import { firebaseAdmin } from ".";
export const authHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.header("Authorization");
  console.log("authHandler", { accessToken });
  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(accessToken);
    const uid = decodedToken.uid;
    console.log({ uid });
    next();
  } catch (error) {
    res.status(401);
    return next("Unauthorized");
  }
};

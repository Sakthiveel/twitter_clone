import { NextFunction, Request, Response } from "express";
import { firebaseAdmin } from ".";
export const authHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const idToken = req.header("X-Firebase-AppCheck");
  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    console.log({ uid });
    next();
  } catch (error) {
    res.status(401);
    return next("Unauthorized");
  }
};

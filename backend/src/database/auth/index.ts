import { NextFunction, Request, Response } from "express";
import { getAppCheck } from "firebase-admin/app-check";

export const authHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const appCheckToken = req.header("X-Firebase-AppCheck");

  if (!appCheckToken) {
    res.status(401);
    return next("Unauthorized");
  }

  try {
    const appCheckClaims = await getAppCheck().verifyToken(appCheckToken);
    console.log("auth", { appCheckClaims });
    return next();
  } catch (err) {
    res.status(401);
    return next("Unauthorized");
  }
};

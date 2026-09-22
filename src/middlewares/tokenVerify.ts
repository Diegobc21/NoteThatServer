import { NextFunction, Request, Response } from "express";
import { jwt } from "../helpers/tokens.js";

export interface AuthenticatedRequest extends Request {
  user?: { username: string };
}

/**
 * Accept both the RFC-standard "Bearer <token>" format and the legacy raw
 * token format while clients migrate. Controllers must use req.user rather
 * than a user identifier sent in the request body.
 */
const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authorization = req.header("authorization");
  const token = authorization?.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    res.status(401).json({ error: "Authentication token is required." });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ?? "token",
    ) as { username?: string };

    if (!decoded.username) {
      res.status(401).json({ error: "Invalid authentication token." });
      return;
    }

    req.user = { username: decoded.username };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired authentication token." });
  }
};

export {
  verifyToken
};


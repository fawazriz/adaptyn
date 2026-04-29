import { Request, Response, NextFunction } from "express";
import type { User } from "@supabase/supabase-js";
import supabase from "../db/supabase-client";

interface AuthenticatedRequest extends Request {
  user: User;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  // const authHeader : string | undefined = req.headers.authorization;
  // const token = authHeader?.replace("Bearer ", "");
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  (req as AuthenticatedRequest).user = data.user;
  next();
}
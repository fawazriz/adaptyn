import { Request, Response, NextFunction } from "express";
import supabase from "../db/supabase-client";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader : string | undefined = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.user = data.user;
  next();
}
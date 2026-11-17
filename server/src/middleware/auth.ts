import { Request, Response, NextFunction } from "express";
import type { User } from "@supabase/supabase-js";
import { createSupabaseClient } from "../db/supabase-client";
import { sessionCookieName } from "../lib/session-cookie";

export interface AuthenticatedRequest extends Request {
  user: User;
  supabase: ReturnType<typeof createSupabaseClient>;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies[sessionCookieName];

  if (typeof token !== "string" || !token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const { data, error } = await createSupabaseClient().auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const authenticatedRequest = req as AuthenticatedRequest;
    authenticatedRequest.user = data.user;
    authenticatedRequest.supabase = createSupabaseClient(token);
    next();
  } catch (error) {
    next(error);
  }
}

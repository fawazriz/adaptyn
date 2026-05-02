import supabase from "../db/supabase-client";
import { Request, Response } from "express";
import { User } from "@supabase/auth-js/dist/module/lib/types";

interface AuthenticatedRequest extends Request {
    user: User;
}

export async function getMyProfile(req: Request, res: Response) {
    const id = (req as AuthenticatedRequest).user.id;

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
}

export async function updateMyProfile(req: Request, res: Response) {
    const id = (req as AuthenticatedRequest).user.id;
    const { name, headline, location, bio } = req.body;

    const updates: any = {};
    if (name) updates.name = name;
    if (headline) updates.headline = headline;
    if (location) updates.location = location;
    if (bio) updates.bio = bio;

    const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", id)
        .maybeSingle();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    if (!data) {
        return res.status(404).json({ error: "Profile not found" });
    }

    return res.status(200).json(data);
}

export async function deleteMyProfile(req: Request, res: Response) {
    const id = (req as AuthenticatedRequest).user.id;

    const { data, error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", id)
        .maybeSingle();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    if (!data) {
        return res.status(404).json({ error: "Profile not found" });
    }

    return res.status(200).json({ message: "Profile deleted successfully" });
}
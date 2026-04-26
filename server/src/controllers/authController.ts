import { Request, Response } from "express";
import supabase from "../db/supabase-client";

export async function register(
    req: Request<{}, any, { email: string; password: string; fullName: string }>,
    res: Response
) {
    const { email, password, fullName } = req.body;

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    });

    if (error) {
        // 400 Bad Request for invalid input or failed registration
        return res.status(400).json({ error: error.message });
    }

    // 201 Created for successful registration
    res.status(201).json({ message: "User registered successfully" });
}

export async function login(
    req: Request<{}, any, { email: string; password: string }>,
    res: Response
) {
    const { email, password } = req.body;

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
        // 401 Unauthorized for failed login
        return res.status(401).json({ error: error.message });
    }

    // 200 OK for successful login
    res.status(200).json({ message: "User logged in successfully" });
}
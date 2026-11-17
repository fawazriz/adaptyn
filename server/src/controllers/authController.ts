import { Request, Response } from "express";
import { createSupabaseClient } from "../db/supabase-client";
import { sessionCookieName, sessionCookieOptions } from "../lib/session-cookie";

export async function register(
    req: Request<Record<string, never>, unknown, { email: string; password: string; fullName: string }>,
    res: Response
) {
    const { email, password, fullName } = req.body ?? {};
    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }

    const { error } = await createSupabaseClient().auth.signUp({
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
    req: Request<Record<string, never>, unknown, { email: string; password: string }>,
    res: Response
) {
    const { email, password } = req.body ?? {};
    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const { data, error } = await createSupabaseClient().auth.signInWithPassword({ email, password });

    if (error || !data.session) {
        // 401 Unauthorized for failed login
        return res.status(401).json({ error: error?.message ?? "Login failed" });
    }

    const { access_token, expires_at, expires_in } = data.session;
    const remainingSeconds = expires_at === undefined ? expires_in : expires_at - Date.now() / 1000;
    const maxAge = Math.floor(Math.max(0, Math.min(3600, remainingSeconds))) * 1000;
    res.cookie(sessionCookieName, access_token, { ...sessionCookieOptions, maxAge });
    return res.status(204).end();
}

export async function logout(req: Request, res: Response) {
    const token = req.cookies[sessionCookieName];
    res.clearCookie(sessionCookieName, sessionCookieOptions);

    if (typeof token === "string" && token) {
        try {
            const { error } = await createSupabaseClient().auth.admin.signOut(token, "local");
            if (error && ![401, 403, 404].includes(error.status ?? 0)) {
                console.warn("Supabase session revocation failed", error.status);
            }
        } catch {
            console.warn("Supabase session revocation failed");
        }
    }

    return res.redirect(303, "/login");
}

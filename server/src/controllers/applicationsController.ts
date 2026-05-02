import { Request, Response } from "express";
import supabase from "../db/supabase-client";
import type { User } from "@supabase/supabase-js";

interface AuthenticatedRequest extends Request {
    user: User;
}

export async function getAllApplications(req: Request, res: Response) {
    const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", (req as AuthenticatedRequest).user.id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
}

export async function getApplicationById(req: Request, res: Response) {
    const { id } = req.params;

    const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        return res.status(404).json({ error: "Application not found" });
    }

    res.status(200).json(data);
}

export async function getApplicationByCategory(req: Request, res: Response) {
    const { category } = req.params;

    const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("category", category);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
}

export async function createApplication(req: Request, res: Response) {
    const {
        company,
        role,
        job_url,
        status,
        applied_date,
        salary_min,
        salary_max,
        location,
        source,
        resume_version_id,
        notes,
    } = req.body;

    if (!company || !role) {
        return res.status(400).json({
            error: "Company and role are required",
        });
    }

    const application = {
        user_id: (req as AuthenticatedRequest).user.id,
        company,
        role,
        job_url: job_url || null,
        status: status || "saved",
        applied_date: applied_date || null,
        salary_min: salary_min || null,
        salary_max: salary_max || null,
        location: location || null,
        source: source || "other",
        resume_version_id: resume_version_id || null,
        notes: notes || null,
    };

    const { data, error } = await supabase
        .from("applications")
        .insert(application)
        .select("*")
        .single();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(data);
}

export async function updateApplication(req: Request, res: Response) {
    const { id } = req.params;
    const {
        company,
        role,
        job_url,
        status,
        applied_date,
        salary_min,
        salary_max,
        location,
        source,
        resume_version_id,
        notes,
    } = req.body;

    const updates: any = {};
    if (company) updates.company = company;
    if (role) updates.role = role;
    if (job_url) updates.job_url = job_url;
    if (status) updates.status = status;
    if (applied_date) updates.applied_date = applied_date;

    console.log(updates);

    const { data, error } = await supabase
        .from("applications")
        .update(updates)
        .eq("id", id)
        .eq("user_id", (req as AuthenticatedRequest).user.id)
        .select("*")
        .maybeSingle();
    
    console.log("params id:", id);
    console.log("user id:", (req as AuthenticatedRequest).user.id);
    console.log("updates:", updates);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    if (!data) {
        return res.status(404).json({ error: "Application not found" });
    }
    return res.status(200).json(data);

}

export async function deleteApplication(req: Request, res: Response) {
    const { id } = req.params;

    const { error } = await supabase.from("applications").delete().eq("id", id).eq("user_id", (req as AuthenticatedRequest).user.id);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    return res.status(204).send();
}
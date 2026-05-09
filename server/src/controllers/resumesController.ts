
import { Request, Response } from "express";
import supabase from "../db/supabase-client";
import type { User } from "@supabase/supabase-js";

interface AuthenticatedRequest extends Request {
    user: User;
}

export async function getAllResumes(req: Request, res: Response) {
    const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", (req as AuthenticatedRequest).user.id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
}

export async function getResumeById(req: Request, res: Response) {
    const { id } = req.params;

    const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        return res.status(404).json({ error: "Application not found" });
    }

    res.status(200).json(data);
}

export async function createResume(req: Request, res: Response) {
    const {
        name,
        target_role,
        content,
        latex_source,
        pdf_url,
        status,
    } = req.body;

    if (!name) {
        return res.status(400).json({
            error: "Name is required",
        });
    }

    const resume = {
        user_id: (req as AuthenticatedRequest).user.id,
        name,
        target_role,
        content,
        latex_source,
        pdf_url,
        status,
    };

    const { data, error } = await supabase
        .from("resumes")
        .insert(resume)
        .select("*")
        .single();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(data);
}

export async function updateResume(req: Request, res: Response) {
    const { id } = req.params;
    const {
        name,
        target_role,
        content,
        latex_source,
        pdf_url,
        status,
    } = req.body;

    const updates: any = {};
    if (name) updates.name = name;
    if (target_role) updates.target_role = target_role;
    if (content) updates.content = content;
    if (latex_source) updates.latex_source = latex_source;
    if (pdf_url) updates.pdf_url = pdf_url;
    if (status) updates.status = status;


    const { data, error } = await supabase
        .from("resumes")
        .update(updates)
        .eq("id", id)
        .eq("user_id", (req as AuthenticatedRequest).user.id)
        .select("*")
        .maybeSingle();


    if (error) {
        return res.status(400).json({ error: error.message });
    }

    if (!data) {
        return res.status(404).json({ error: "Resume not found" });
    }
    return res.status(200).json(data);

}

export async function deleteResume(req: Request, res: Response) {
    const { id } = req.params;

    const { error } = await supabase.from("resumes").delete().eq("id", id).eq("user_id", (req as AuthenticatedRequest).user.id);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    return res.status(204).send();
}

import { compileLatexToPdf } from "../lib/latex/compileLatex";
import { generateResumeLatex } from "../lib/latex/generateResumeLatex";
import fs from "fs/promises"
import path from "path"

export async function compileResume(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const userId = (req as AuthenticatedRequest).user.id;

        const { data: resume, error } = await supabase
            .from("resumes")
            .select("*")
            .eq("id", id)
            .eq("user_id", userId)
            .single();

        if (error || !resume) {
            return res.status(404).json({ error: "Resume not found" });
        }

        const contentToCompile = req.body.content ?? resume.content
        const latexSource = generateResumeLatex(contentToCompile);

        console.log("Generated LaTeX length:", latexSource.length);

        const pdfPath = await compileLatexToPdf(latexSource);

        console.log("Generated PDF path:", pdfPath);

        return res.sendFile(pdfPath, async (err) => {
            const buildDir = path.dirname(pdfPath);

            try {
                await fs.rm(buildDir, { recursive: true, force: true });
            } catch (cleanupError) {
                console.error("Failed to clean up PDF build folder:", cleanupError);
            }

            if (err) {
                console.error("Failed to send PDF:", err);
            }
        });
    } catch (err) {
        console.error("Compile resume error:", err);

        return res.status(500).json({
            error: err instanceof Error ? err.message : "Failed to compile resume",
        });
    }
}
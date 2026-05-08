"use client";

import React from "react";
import { ResumeEditorShell } from "@/components/resumes/editor/ResumeEditorShell";

export default function ResumeEditorRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  return <ResumeEditorShell resumeId={id} />;
}
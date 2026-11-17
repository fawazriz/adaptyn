export type ResumeData = {
  header: {
    fullName?: string;
    email?: string;
    phone?: string;
    linkedIn?: string;
    githubOrPortfolio?: string;
  };

  education?: {
    school: string;
    degree: string;
    location?: string;
    graduationDate: string;
    coursework?: string;
  }[];

  experience?: {
    company: string;
    role: string;
    dates: string;
    location?: string;
    bullets?: string[];
  }[];

  projects?: {
    projectName: string;
    techStack: string;
    dates?: string;
    bullets?: string[];
  }[];

  skills?: {
    languages?: string[];
    frameworks?: string[];
    databases?: string[];
    tools?: string[];
    concepts?: string[];
  };
};

const latexEscapes: Record<string, string> = {
  "\\": "\\textbackslash{}",
  "&": "\\&",
  "%": "\\%",
  "$": "\\$",
  "#": "\\#",
  "_": "\\_",
  "{": "\\{",
  "}": "\\}",
  "~": "\\textasciitilde{}",
  "^": "\\textasciicircum{}",
};

function escapeLatex(value: unknown = ""): string {
  const text = Array.isArray(value)
    ? value.join(", ")
    : value == null
      ? ""
      : String(value)

  return text.replace(/[\\&%$#_{}~^]/g, (character) => latexEscapes[character]);
}

function linkDestination(value: string, email: boolean) {
  if (/[{}\\\s]/.test(value)) return;
  try {
    if (email) {
      const separator = value.indexOf("@");
      if (separator <= 0 || separator !== value.lastIndexOf("@") || separator === value.length - 1) return;
      return `mailto:${encodeURIComponent(value.slice(0, separator))}@${encodeURIComponent(value.slice(separator + 1))}`;
    }

    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(value) ? value : "https://" + value);
    if (url.protocol === "https:" || url.protocol === "http:") return url.href.replace(/\^/g, "%5E");
  } catch {
    return;
  }
}

function href(value: string | undefined, email = false) {
  const label = value?.trim();
  if (!label) return "";
  const destination = linkDestination(label, email);
  const display = !email && destination ? label.replace(/^https?:\/\//i, "") : label;
  const text = `\\underline{${escapeLatex(display)}}`;
  return destination ? `\\href{${destination}}{${text}}` : text;
}

function renderBulletText(bullet: string) {
  let rendered = "";
  let cursor = 0;
  // Match pairs of exactly two asterisks. Keep unmatched delimiters as text.
  const boldSpans = /(?<!\*)\*\*(?!\*)((?:[^*\r\n]|\*(?!\*))+?)(?<!\*)\*\*(?!\*)/g;
  for (const match of bullet.matchAll(boldSpans)) {
    if (!match[1].trim()) continue;
    rendered += escapeLatex(bullet.slice(cursor, match.index));
    rendered += `\\textbf{${escapeLatex(match[1])}}`;
    cursor = match.index + match[0].length;
  }
  return rendered + escapeLatex(bullet.slice(cursor));
}

function renderBulletList(bullets: string[] = []) {
  const items = bullets
    .filter((bullet) => bullet.trim())
    .map((bullet) => `\\resumeItem{${renderBulletText(bullet)}}`);
  if (!items.length) return "";
  return ["\\resumeItemListStart", ...items, "\\resumeItemListEnd"].join("\n");
}

export function generateResumeLatex(resume: ResumeData): string {
  const { header, skills } = resume;
  const name = header.fullName?.trim();
  const contact = [
    escapeLatex(header.phone?.trim()),
    href(header.email, true),
    href(header.linkedIn),
    href(header.githubOrPortfolio),
  ].filter(Boolean).join(" $|$ ");

  const skillLines = ([
    ["Languages", skills?.languages],
    ["Frameworks", skills?.frameworks],
    ["Databases", skills?.databases],
    ["Tools", skills?.tools],
    ["Concepts", skills?.concepts],
  ] as const).flatMap(([label, values]) => {
    const items = values?.map((value) => value.trim()).filter(Boolean);
    return items?.length ? [`\\textbf{${label}:} ${escapeLatex(items)}`] : [];
  });

  const education = (resume.education ?? []).filter(({ degree, school, location, graduationDate, coursework }) =>
    [degree, school, location, graduationDate, coursework].some((value) => value?.trim()),
  );
  const experience = (resume.experience ?? []).filter(({ role, company, location, dates, bullets }) =>
    [role, company, location, dates, ...(bullets ?? [])].some((value) => value?.trim()),
  );
  const projects = (resume.projects ?? []).filter(({ projectName, techStack, dates, bullets }) =>
    [projectName, techStack, dates, ...(bullets ?? [])].some((value) => value?.trim()),
  );

  return `
\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{pdfpages}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\item\\small{{#1 \\vspace{0pt}}}
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

${name || contact ? `
\\begin{center}
    ${name ? `\\textbf{\\Huge \\scshape ${escapeLatex(name)}}${contact ? " \\\\ \\vspace{1pt}" : ""}` : ""}
    ${contact ? `\\large ${contact}` : ""}
\\end{center}
` : ""}

${
  education.length
    ? `
\\section{Education}
\\resumeSubHeadingListStart
${education
  .map(
    (edu) => `
  \\resumeSubheading
    {${escapeLatex(edu.degree)}}{${escapeLatex(edu.location ?? "")}}
    {${escapeLatex(edu.school)}}{${escapeLatex(edu.graduationDate ?? "")}}
    ${
      edu.coursework?.trim()
        ? `\\resumeItemListStart
      \\resumeItem{\\textbf{Relevant Coursework}: ${renderBulletText(edu.coursework.trim())}}
    \\resumeItemListEnd`
        : ""
    }
`
  )
  .join("\n")}
\\resumeSubHeadingListEnd
`
    : ""
}

${
  skillLines.length
    ? `
\\section{Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
\\small{\\item{
${skillLines.join(" \\\\\n")}
}}
\\end{itemize}
`
    : ""
}

${
  experience.length
    ? `
\\section{Experience}
\\resumeSubHeadingListStart
${experience
  .map(
    (exp) => `
\\resumeSubheading
  {${escapeLatex(exp.role)}}{${escapeLatex(exp.dates ?? "")}}
  {${escapeLatex(exp.company)}}{${escapeLatex(exp.location ?? "")}}
${renderBulletList(exp.bullets)}
`
  )
  .join("\n")}
\\resumeSubHeadingListEnd
`
    : ""
}

${
  projects.length
    ? `
\\section{Projects}
\\resumeSubHeadingListStart
${projects
  .map(
    (project) => `
\\resumeProjectHeading
  {\\textbf{${escapeLatex(project.projectName)}}${
      project.techStack?.trim() ? ` $|$ \\emph{${escapeLatex(project.techStack.trim())}}` : ""
    }}{${escapeLatex(project.dates?.trim())}}
${renderBulletList(project.bullets)}
`
  )
  .join("\n")}
\\resumeSubHeadingListEnd
`
    : ""
}

${name || contact || education.length || skillLines.length || experience.length || projects.length ? "" : "\\null"}
\\end{document}
`;
}

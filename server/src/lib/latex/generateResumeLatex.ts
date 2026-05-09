type ResumeData = {
  id: string;

  header: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
    githubOrPortfolio: string;
  };

  education: {
    id: string;
    school: string;
    degree: string;
    location?: string;
    graduationDate: string;
    gpa?: string;
    coursework?: string;
  }[];

  experience: {
    id: string;
    company: string;
    role: string;
    dates: string;
    location?: string;
    bullets: string[];
  }[];

  projects: {
    id: string;
    projectName: string;
    techStack: string;
    link?: string;
    bullets: string[];
  }[];

  skills: {
    languages: string[];
    frameworks: string[];
    databases: string[];
    tools: string[];
    concepts?: string[];
    dataAnalytics?: string[];
  };

  metadata?: {
    template?: string;
    notes?: string;
    targetRole?: string;
  };
};

function escapeLatex(value: unknown = ""): string {
  const text = Array.isArray(value)
    ? value.join(", ")
    : value == null
      ? ""
      : String(value)

  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}")
}

function href(url?: unknown, label?: unknown) {
  if (!url) return ""
  const safeUrl = String(url)
  return `\\href{${safeUrl}}{\\underline{${escapeLatex(label ?? safeUrl)}}}`
}

function renderBullets(bullets: string[] = []) {
  return bullets
    .map((b) => `\\resumeItem{${escapeLatex(b)}}`)
    .join("\n");
}

export function generateResumeLatex(resume: ResumeData): string {
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

\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(resume.header.fullName)}} \\\\ \\vspace{1pt}
    \\large
    ${[
      resume.header.phone ? escapeLatex(resume.header.phone) : "",
      resume.header.email ? `\\href{mailto:${resume.header.email}}{\\underline{${escapeLatex(resume.header.email)}}}` : "",
      href(resume.header.linkedIn, resume.header.linkedIn),
      href(resume.header.githubOrPortfolio, resume.header.githubOrPortfolio),
    ]
      .filter(Boolean)
      .join(" $|$ ")}
\\end{center}

${
  resume.education?.length
    ? `
\\section{Education}
\\resumeSubHeadingListStart
${resume.education
  .map(
    (edu) => `
  \\resumeSubheading
    {${escapeLatex(edu.degree)}}{${escapeLatex(edu.location ?? "")}}
    {${escapeLatex(edu.school)}}{${escapeLatex(edu.graduationDate ?? "")}}
    ${
      edu.coursework
        ? `\\resumeItemListStart
      \\resumeItem{\\textbf{Relevant Coursework}: ${escapeLatex(edu.coursework)}}
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
  resume.skills
    ? `
\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
\\small{\\item{
  ${resume.skills.languages ? `\\textbf{Languages}: ${escapeLatex(resume.skills.languages)} \\\\` : ""}
  ${resume.skills.frameworks ? `\\textbf{Frameworks}: ${escapeLatex(resume.skills.frameworks)} \\\\` : ""}
  ${resume.skills.databases ? `\\textbf{Databases}: ${escapeLatex(resume.skills.databases)} \\\\` : ""}
  ${resume.skills.tools ? `\\textbf{Tools}: ${escapeLatex(resume.skills.tools)} \\\\` : ""}
  ${resume.skills.concepts ? `\\textbf{Concepts}: ${escapeLatex(resume.skills.concepts)}` : ""}
}}
\\end{itemize}
`
    : ""
}

${
  resume.experience?.length
    ? `
\\section{Experience}
\\resumeSubHeadingListStart
${resume.experience
  .map(
    (exp) => `
\\resumeSubheading
  {${escapeLatex(exp.role)}}{${escapeLatex(exp.dates ?? "")}}
  {${escapeLatex(exp.company)}}{${escapeLatex(exp.location ?? "")}}
  \\resumeItemListStart
    ${renderBullets(exp.bullets)}
  \\resumeItemListEnd
`
  )
  .join("\n")}
\\resumeSubHeadingListEnd
`
    : ""
}

${
  resume.projects?.length
    ? `
\\section{Projects}
\\resumeSubHeadingListStart
${resume.projects
  .map(
    (project) => `
\\resumeProjectHeading
  {\\textbf{${escapeLatex(project.projectName)}} ${
      project.techStack ? `$|$ \\emph{${escapeLatex(project.techStack)}}` : ""
    }}{}
  \\resumeItemListStart
    ${renderBullets(project.bullets)}
  \\resumeItemListEnd
`
  )
  .join("\n")}
\\resumeSubHeadingListEnd
`
    : ""
}

\\end{document}
`;
}
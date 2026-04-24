import { Separator } from "@/components/ui/separator"
import { IconBrandGithub, IconBrandTwitter } from "@tabler/icons-react"

const LINKS = {
  Product: ["Tracker", "Resume Editor", "Analytics", "Recruiter Finder"],
  Company: ["About", "Privacy", "Terms"],
  Resources: ["Docs", "Changelog", "Status"],
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-semibold text-sm text-foreground">Adaptyn</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The job search OS for CS students and new grads.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="#"
                aria-label="GitHub"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <IconBrandGithub size={15} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <IconBrandTwitter size={15} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="text-xs font-semibold text-foreground mb-3">{section}</p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator />

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">
            © 2025 Adaptyn. Built for engineers, by engineers.
          </p>
          <p className="text-[11px] text-muted-foreground">
            Free for students during beta.
          </p>
        </div>
      </div>
    </footer>
  )
}

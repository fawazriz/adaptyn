"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import {
  IconLayoutKanban,
  IconFileText,
  IconChartBar,
  IconUsersGroup,
  IconMenu2,
  IconArrowRight,
  IconHome,
} from "@tabler/icons-react"



const PRODUCT_LINKS = [
  {
    icon: IconLayoutKanban,
    label: "Application Tracker",
    description: "Kanban board for every role you're chasing",
    href: "#walkthrough",
  },
  {
    icon: IconFileText,
    label: "Resume Editor",
    description: "Click your PDF to edit — no LaTeX needed",
    href: "#walkthrough",
  },
  {
    icon: IconChartBar,
    label: "Version Analytics",
    description: "See which resume version gets callbacks",
    href: "#versioning",
  },
  {
    icon: IconUsersGroup,
    label: "Recruiter Finder",
    description: "AI surfaces contacts at your target companies",
    href: "#walkthrough",
  },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/signup"

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className={`h-14 flex items-center justify-between gap-4 px-5 ${!isAuthPage ? "max-w-6xl mx-auto" : ""}`}>
        {/* Logo */}
        {isAuthPage ? (
          <a
            href="/"
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Back to home"
          >
            <IconHome size={16} />
          </a>
        ) : (
          <a href="/" className="flex items-center gap-2 shrink-0">
            <span className="font-semibold text-foreground tracking-tight text-sm">Adaptyn</span>
          </a>
        )}

        {/* Desktop nav */}
        {!isAuthPage && (
          <NavigationMenu viewport={false} className="hidden md:flex">
            <NavigationMenuList className="gap-0">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60 text-sm h-8 px-3">
                  Product
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid grid-cols-2 gap-1 p-2 w-96">
                    {PRODUCT_LINKS.map(({ icon: Icon, label, description, href }) => (
                      <li key={label}>
                        <NavigationMenuLink
                          href={href}
                          className="flex items-start gap-2.5 rounded-md p-2.5 hover:bg-muted transition-colors"
                        >
                          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Icon size={13} className="text-primary" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-foreground mb-0.5">{label}</div>
                            <div className="text-[11px] text-muted-foreground leading-relaxed">{description}</div>
                          </div>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#walkthrough"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/60 px-3 py-1.5 rounded-md text-sm transition-colors"
                >
                  Walkthrough
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#versioning"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/60 px-3 py-1.5 rounded-md text-sm transition-colors"
                >
                  Pricing
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {!isAuthPage && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex text-muted-foreground hover:text-foreground text-sm h-8"
                asChild
              >
                <a href="/login">Log in</a>
              </Button>

              <a href="/signup">
                <Button
                  size="sm"
                  className="hidden md:flex gap-1.5 h-8 text-sm bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Sign up
                  <IconArrowRight size={13} />
                </Button>
              </a>

              {/* Mobile hamburger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
                    <IconMenu2 size={16} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-sm font-semibold">
                      <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground text-[10px] font-bold">A</span>
                      </div>
                      Adaptyn
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 flex flex-col gap-1">
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-2 mb-1">
                      Product
                    </p>
                    {PRODUCT_LINKS.map(({ icon: Icon, label, href }) => (
                      <a
                        key={label}
                        href={href}
                        className="flex items-center gap-2.5 px-2 py-2 rounded-md text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <Icon size={14} className="text-muted-foreground" />
                        {label}
                      </a>
                    ))}
                    <Separator className="my-3" />
                    <a href="#" className="px-2 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors">
                      Walkthrough
                    </a>
                    <a href="#" className="px-2 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors">
                      Pricing
                    </a>
                    <a href="/login" className="px-2 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors">
                      Log in
                    </a>
                    <Separator className="my-3" />
                    <Button size="sm" className="w-full gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                      Get early access
                      <IconArrowRight size={13} />
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

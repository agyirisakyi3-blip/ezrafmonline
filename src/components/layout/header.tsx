"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MobileMenu from "./mobile-menu";
import DateTimeDisplay from "./date-time";
import { useTheme } from "@/components/theme-provider";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "News", href: "/categories/news" },
  { label: "Politics", href: "/categories/politics" },
  { label: "Entertainment", href: "/categories/entertainment" },
  { label: "Sports", href: "/categories/sports" },
  { label: "Business", href: "/categories/business" },
  { label: "Opinion", href: "/categories/opinion" },
  { label: "Videos", href: "/categories/videos" },
  { label: "Elections", href: "/categories/elections" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-primary/95 backdrop-blur-md shadow-md"
          : "bg-primary shadow-xs"
      }`}
    >
      <DateTimeDisplay />
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Desktop */}
        <div
          className={`hidden md:flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-14" : "h-[72px]"
          }`}
        >
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.png"
              alt="Ezrafmonline"
              width={160}
              height={40}
              className={`w-auto transition-all duration-300 ${
                scrolled ? "h-8" : "h-10"
              }`}
              priority
            />
          </Link>

          <nav className="flex items-center justify-end ml-auto space-x-0.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                active={pathname === link.href || pathname.startsWith(link.href + "/")}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="relative group">
              <button className="relative text-white/90 hover:text-white font-medium text-sm px-2.5 py-1.5 transition-colors flex items-center gap-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-all group-hover:after:w-full">
                Live
                <svg className="h-3 w-3 transition-transform group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <div className="absolute top-full right-0 mt-1 w-48 rounded-lg border border-zinc-200 bg-white py-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-1 group-hover:translate-y-0">
                <a
                  href="/live/tv"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-primary transition-colors"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6 3 20 12 6 21 6 3" />
                    </svg>
                  </span>
                  <span className="font-medium">Live TV</span>
                </a>
                <a
                  href="/live/radio"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-primary transition-colors"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6 3 20 12 6 21 6 3" />
                    </svg>
                  </span>
                  <span className="font-medium">Live Radio</span>
                </a>
              </div>
            </div>
          </nav>

          <div className="flex items-center space-x-3 shrink-0">
            <Link
              href="/search"
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Search"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </Link>
            <button
              onClick={toggleTheme}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile */}
        <div
          className={`md:hidden flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-14" : "h-[72px]"
          }`}
        >
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.png"
              alt="Ezrafmonline"
              width={120}
              height={32}
              className={`w-auto transition-all duration-300 ${
                scrolled ? "h-6" : "h-8"
              }`}
            />
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`relative font-medium text-sm px-2.5 py-1.5 transition-colors ${
        active
          ? "text-white after:absolute after:bottom-0 after:left-2.5 after:right-2.5 after:h-0.5 after:bg-white"
          : "text-white/80 hover:text-white after:absolute after:bottom-0 after:left-2.5 after:right-2.5 after:h-0.5 after:bg-white/60 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
      }`}
    >
      {children}
    </Link>
  );
}

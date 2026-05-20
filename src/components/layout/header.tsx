"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [liveOpen, setLiveOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (liveRef.current && !liveRef.current.contains(e.target as Node)) {
        setLiveOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setLiveOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
              className={`w-auto transition-all duration-300 animate-logo ${
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
            <div className="relative" ref={liveRef}>
              <button
                onClick={() => setLiveOpen(!liveOpen)}
                className="relative text-white/90 hover:text-white font-medium text-sm px-2.5 py-1.5 transition-colors flex items-center gap-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-all hover:after:w-full"
              >
                Live
                <svg className={`h-3 w-3 transition-transform ${liveOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <div className={`absolute top-full right-0 mt-1 w-48 rounded-lg border border-zinc-200 bg-white py-2 shadow-lg transition-all ${liveOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-1 pointer-events-none"}`}>
                <a
                  href="/live/tv"
                  onClick={() => setLiveOpen(false)}
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
                  onClick={() => setLiveOpen(false)}
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
            <button
              onClick={() => setSearchOpen(true)}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Search"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
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
      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-20 backdrop-blur-sm">
          <div className="w-full max-w-xl mx-4 bg-white rounded-xl shadow-2xl overflow-hidden dark:bg-zinc-900">
            <div className="flex items-center border-b border-zinc-200 dark:border-zinc-800">
              <svg className="ml-4 h-5 w-5 shrink-0 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchOpen(false);
                    setSearchQuery("");
                  }
                }}
                placeholder="Search articles..."
                className="flex-1 border-0 bg-transparent px-3 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none dark:text-white"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="mr-3 flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-white"
                aria-label="Close search"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-4 py-2 text-xs text-zinc-400 flex items-center justify-between">
              <span>Press Enter to search</span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-zinc-300 px-1.5 py-0.5 text-[10px] font-mono dark:border-zinc-700">ESC</kbd>
                <span>to close</span>
              </span>
            </div>
          </div>
        </div>
      )}

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

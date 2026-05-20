"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  { label: "Live TV", href: "/live/tv" },
  { label: "Live Radio", href: "/live/radio" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-white/80 hover:text-white"
        aria-label="Toggle menu"
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 top-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300 dark:bg-zinc-900 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
          <span className="text-sm font-bold text-zinc-900 dark:text-white">Menu</span>
          <button
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-white"
            aria-label="Close menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="overflow-y-auto p-4 pb-20">
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <div className="flex items-center justify-between px-4">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Dark Mode</span>
              <button
                onClick={toggleTheme}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  theme === "dark" ? "bg-primary" : "bg-zinc-300"
                }`}
                aria-label="Toggle dark mode"
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    theme === "dark" ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-4 px-4">
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              Search
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}

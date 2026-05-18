"use client";

import { useState } from "react";
import Link from "next/link";

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

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [liveOpen, setLiveOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-white/80 hover:text-white"
        aria-label="Open menu"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-72 max-w-full bg-white shadow-xl">
            <div className="flex items-center justify-between bg-primary px-4 h-[72px]">
              <img src="/logo.png" alt="Ezrafmonline" className="h-7 w-auto" />
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-white/80 hover:text-white"
                aria-label="Close menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {navLinks.map((link) => (
                <MobileNavLink
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </MobileNavLink>
              ))}

              {/* Live section */}
              <div>
                <button
                  onClick={() => setLiveOpen(!liveOpen)}
                  className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-primary transition-colors"
                >
                  <span>Live</span>
                  <svg
                    className={`h-4 w-4 transition-transform ${liveOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {liveOpen && (
                  <div className="ml-4 space-y-1 border-l-2 border-primary/20 pl-3">
                    <MobileNavLink href="/live/tv" onClick={() => setOpen(false)}>
                      <span className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                          <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="6 3 20 12 6 21 6 3" />
                          </svg>
                        </span>
                        Live TV
                      </span>
                    </MobileNavLink>
                    <MobileNavLink href="/live/radio" onClick={() => setOpen(false)}>
                      <span className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                          <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="6 3 20 12 6 21 6 3" />
                          </svg>
                        </span>
                        Live Radio
                      </span>
                    </MobileNavLink>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-primary transition-colors"
    >
      {children}
    </Link>
  );
}

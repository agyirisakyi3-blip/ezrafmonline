"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MobileMenu from "./mobile-menu";
import DateTimeDisplay from "./date-time";

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
  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          setScrolled(y > 60);
          setHidden(y > 300 && y > lastScroll);
          setLastScroll(y);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScroll]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-primary/95 backdrop-blur-md shadow-md"
          : "bg-primary shadow-xs"
      } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
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

          <nav className="flex items-center justify-center flex-1 mx-6 space-x-0.5">
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

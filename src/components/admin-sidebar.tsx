"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Articles",
    href: "/admin/articles",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    label: "New Article",
    href: "/admin/articles/new",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
];

const adminNavItems = [
  {
    label: "Ads",
    href: "/admin/ads",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
  },
];

export default function AdminSidebar({
  user,
  signOutUrl,
}: {
  user: { name: string; role: string; initial: string };
  signOutUrl: string;
}) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col shrink-0">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary shrink-0" />

      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-100">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="relative">
            <img src="/logo.png" alt="Ezrafmonline" className="h-7 w-auto" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-800 group-hover:text-primary transition-colors leading-tight">Ezrafmonline</span>
            <span className="text-[10px] font-medium text-accent uppercase tracking-widest">CMS</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Main</p>
        {navItems.map((item) => (
          <NavLink key={item.href} href={item.href} icon={item.icon} active={isActive(item.href)}>
            {item.label}
          </NavLink>
        ))}

        {user.role === "ADMIN" && (
          <>
            <div className="pt-5 mt-3 border-t border-zinc-100">
              <p className="px-3 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Administration</p>
              {adminNavItems.map((item) => (
                <NavLink key={item.href} href={item.href} icon={item.icon} active={isActive(item.href)}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </>
        )}

        <div className="pt-5 mt-3 border-t border-zinc-100">
          <p className="px-3 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Site</p>
          <NavLink
            href="/"
            active={false}
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            }
          >
            View Site
          </NavLink>
        </div>
      </div>

      {/* User footer */}
      <div className="border-t border-zinc-200 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold shadow-xs">
            {user.initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-900 truncate leading-tight">
              {user.name}
            </p>
            <p className="text-[11px] text-zinc-400 capitalize font-medium">{user.role.toLowerCase()}</p>
          </div>
          <a
            href={signOutUrl}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all"
            title="Sign out"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </a>
        </div>
      </div>
    </aside>
  );
}

function NavLink({
  href,
  icon,
  active,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
        active
          ? "bg-primary-light text-primary shadow-xs"
          : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
      }`}
    >
      <span className={`transition-colors duration-200 ${
        active ? "text-primary" : "text-zinc-400 group-hover:text-zinc-600"
      }`}>
        {icon}
      </span>
      <span>{children}</span>
      {active && (
        <span className="ml-auto h-2 w-2 rounded-full bg-accent" />
      )}
    </Link>
  );
}

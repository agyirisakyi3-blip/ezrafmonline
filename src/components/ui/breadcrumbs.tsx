import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-zinc-500">
        <li>
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        </li>
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-2">
            <svg className="h-3 w-3 shrink-0 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
            </svg>
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-primary transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-zinc-800 font-medium truncate max-w-[200px]">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

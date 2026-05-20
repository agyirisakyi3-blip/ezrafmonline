import Image from "next/image";
import Link from "next/link";
import NewsletterForm from "@/components/newsletter-form";

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "#",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.91 7.811-7.541.45-1.26.603-2.607.155-3.986" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm2.062 6.25h-1.88c-1.493 0-2.005.741-2.005 1.824v1.634h3.75l-.488 3.75h-3.262v8.542a10.1 10.1 0 01-1.25-.104V15.46H6.438v-3.75h2.489V9.846c0-2.474 1.502-3.846 3.718-3.846 1.075 0 2.086.08 2.395.116l.022.003z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.61 6.34c1.07 0 1.93.86 1.93 1.93 0 1.07-.86 1.93-1.93 1.93s-1.93-.86-1.93-1.93c-.01-1.07.86-1.93 1.93-1.93zm-3.61 1.38c1.07 0 1.93.86 1.93 1.93s-.86 1.93-1.93 1.93-1.93-.86-1.93-1.93.86-1.93 1.93-1.93zm-3.61 1.38c1.07 0 1.93.86 1.93 1.93s-.86 1.93-1.93 1.93-1.93-.86-1.93-1.93.86-1.93 1.93-1.93z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
      </svg>
    ),
  },
];

const bottomLinks = [
  { label: "About Us", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Contact Us", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400">
      {/* Newsletter section */}
      <div className="border-b border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-10">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-xl font-bold text-white mb-2">Subscribe to Our Newsletter</h2>
            <p className="text-sm text-zinc-400 mb-5">Get the latest news delivered straight to your inbox.</p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand / About */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="Ezrafmonline"
                width={160}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm leading-relaxed text-zinc-400">
              Your trusted source for the latest news, breaking stories, and updates from Ghana and around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Latest News
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/live/tv" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Live TV
                </Link>
              </li>
              <li>
                <Link href="/live/radio" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Live Radio
                </Link>
              </li>
              <li>
                <Link href="/submit-story" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Submit a Story
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/categories/news" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link href="/categories/politics" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Politics
                </Link>
              </li>
              <li>
                <Link href="/categories/business" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Business
                </Link>
              </li>
              <li>
                <Link href="/categories/sports" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Sports
                </Link>
              </li>
              <li>
                <Link href="/categories/entertainment" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Entertainment
                </Link>
              </li>
              <li>
                <Link href="/categories/opinion" className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Opinion
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & App */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Follow Us
            </h3>
            <div className="flex flex-wrap gap-3 mb-6">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-primary hover:text-white transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Download App
            </h3>
            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg bg-white/10 text-white px-4 py-3 text-sm font-medium hover:bg-white/20 transition-colors"
              >
                <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 20.688L3.609 3.312C3.609 2.872 3.976 2.519 4.429 2.519L4.429 2.519L12.643 11.821L4.429 21.123C4.398 21.158 4.363 21.188 4.325 21.213C4.182 21.34 3.982 21.399 3.798 21.337C3.669 21.295 3.558 21.208 3.488 21.093C3.451 21.029 3.427 20.957 3.416 20.881C3.61 20.841 3.676 20.663 3.609 20.688Z" />
                  <path d="M14.845 13.359L17.47 16.236L5.703 21.855C5.684 21.864 5.664 21.871 5.644 21.877C5.339 21.97 4.981 21.862 4.793 21.607C4.697 21.478 4.646 21.321 4.648 21.162L4.648 21.162L4.648 20.304L14.845 13.359Z" />
                  <path d="M14.845 10.281L4.648 3.336L4.648 2.49C4.648 2.03 5.039 1.657 5.518 1.657C5.807 1.657 6.073 1.791 6.242 2.016C6.288 2.078 6.324 2.148 6.35 2.224L6.35 2.224L17.883 8.134L14.845 10.281Z" />
                  <path d="M18.611 9.138L21.526 10.784C22.138 11.113 22.138 12.18 21.526 12.509L18.611 14.156C18.375 14.288 18.087 14.288 17.851 14.156L14.001 12.073C13.615 11.862 13.615 11.493 14.001 11.283L17.851 9.2C18.087 9.068 18.375 9.068 18.611 9.2Z" />
                </svg>
                <div>
                  <div className="text-[10px] text-zinc-400">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg bg-white/10 text-white px-4 py-3 text-sm font-medium hover:bg-white/20 transition-colors"
              >
                <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <div>
                  <div className="text-[10px] text-zinc-400">DOWNLOAD ON</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm">
            {bottomLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} Ezrafmonline. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

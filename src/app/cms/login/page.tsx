export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Decorative side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-sidebar via-sidebar to-primary-dark items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
        </div>

        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative text-center px-16">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark shadow-2xl shadow-primary/30 mb-8">
            <span className="text-2xl font-bold text-white">EZ</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Ezrafmonline</h1>
          <p className="text-white/60 text-lg max-w-md mx-auto leading-relaxed">
            Your trusted source for the latest news, breaking stories, and updates.
          </p>
          <div className="mt-12 flex items-center justify-center gap-4 text-white/30 text-sm">
            <span className="h-px w-16 bg-white/10" />
            <span className="tracking-wider uppercase text-xs font-medium">Content Management System</span>
            <span className="h-px w-16 bg-white/10" />
          </div>
        </div>
      </div>

      {/* Login form */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-lg shadow-primary/20 mb-4">
              <span className="text-lg font-bold text-white">EZ</span>
            </div>
            <h1 className="text-xl font-bold text-zinc-900">Ezrafmonline CMS</h1>
            <p className="text-sm text-zinc-500 mt-1">Sign in to your account</p>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200/80 p-8 shadow-sm shadow-zinc-200/50">
            <div className="hidden lg:block text-center mb-8">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-lg shadow-primary/20 mb-5">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-zinc-900">Welcome back</h2>
              <p className="text-sm text-zinc-500 mt-1">Sign in to manage your content</p>
            </div>

            <form
              action={async (formData) => {
                "use server";
                const { signIn } = await import("@/lib/auth");
                await signIn("credentials", {
                  email: formData.get("email"),
                  password: formData.get("password"),
                  redirectTo: "/cms",
                });
              }}
              className="space-y-5"
            >
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-zinc-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    className="block w-full rounded-xl border border-zinc-300 pl-10 pr-3.5 py-2.5 text-sm shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-zinc-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    className="block w-full rounded-xl border border-zinc-300 pl-10 pr-3.5 py-2.5 text-sm shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-2.5 text-sm font-semibold text-white hover:shadow-xl hover:from-primary-dark hover:to-primary-dark transition-all duration-200 shadow-lg shadow-primary/25"
              >
                Sign in
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-zinc-400 mt-8">
            &copy; {new Date().getFullYear()} Ezrafmonline. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

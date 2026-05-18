export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-50 via-white to-primary-light/30">
      {/* Decorative side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-zinc-900 items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="relative text-center px-12">
          <img src="/logo.png" alt="Ezrafmonline" className="h-16 w-auto mx-auto mb-6 brightness-0 invert" />
          <h1 className="text-4xl font-bold text-white mb-3">Ezrafmonline</h1>
          <p className="text-white/70 text-lg max-w-md mx-auto">
            Your trusted source for the latest news, breaking stories, and updates.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3 text-white/40 text-sm">
            <span className="h-px w-12 bg-white/20" />
            Content Management System
            <span className="h-px w-12 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Login form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img src="/logo.png" alt="Ezrafmonline" className="h-12 w-auto mx-auto mb-3" />
            <h1 className="text-xl font-bold text-zinc-900">Ezrafmonline CMS</h1>
            <p className="text-sm text-zinc-500">Sign in to your account</p>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm">
            <div className="hidden lg:block text-center mb-6">
              <div className="h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-primary to-accent mb-4" />
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
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    className="block w-full rounded-lg border border-zinc-300 pl-10 pr-3 py-2.5 text-sm shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-zinc-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    className="block w-full rounded-lg border border-zinc-300 pl-10 pr-3 py-2.5 text-sm shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-primary to-primary-dark px-4 py-2.5 text-sm font-semibold text-white hover:shadow-md hover:from-primary-dark hover:to-primary-dark transition-all duration-200"
              >
                Sign in
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-zinc-400 mt-6">
            &copy; {new Date().getFullYear()} Ezrafmonline. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

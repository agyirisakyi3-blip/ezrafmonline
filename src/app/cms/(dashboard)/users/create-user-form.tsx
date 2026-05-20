"use client";

import { useActionState } from "react";
import { createUser } from "./actions";

export function CreateUserForm() {
  const [state, formAction, pending] = useActionState(createUser, null);

  if (state?.success) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">Account Created</h2>
            <p className="text-xs text-zinc-400">Share these credentials with the user</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
            <p className="text-xs text-zinc-500 mb-0.5">Email</p>
            <p className="text-sm font-medium text-zinc-900">{state.email}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-xs text-amber-600 mb-0.5">Temporary Password</p>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-mono font-bold text-zinc-900">{state.generatedPassword}</p>
              <button
                onClick={() => navigator.clipboard.writeText(state.generatedPassword ?? "")}
                className="shrink-0 h-7 px-2.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-xs font-medium text-amber-700 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        <a
          href="/cms/users"
          className="block w-full text-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-all"
        >
          Create Another
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sticky top-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center">
          <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
          </svg>
        </div>
        <div>
          <h2 className="font-semibold text-zinc-900">Create User</h2>
          <p className="text-xs text-zinc-400">Add a new team member</p>
        </div>
      </div>

      {state?.error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
          <svg className="h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1.5">Name</label>
          <input type="text" id="name" name="name" required placeholder="Full name"
            className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-zinc-400"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1.5">Email</label>
          <input type="email" id="email" name="email" required placeholder="you@example.com"
            className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-zinc-400"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-zinc-700 mb-1.5">Role</label>
          <select id="role" name="role" required
            className="block w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <option value="EDITOR">Editor</option>
            <option value="ADMIN">Admin</option>
          </select>
          <p className="mt-1.5 text-xs text-zinc-400">
            Editors can write and publish articles. Admins have full access including user management.
          </p>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create Account
            </span>
          )}
        </button>
      </form>
    </div>
  );
}

import type { Metadata } from "next";
import SubmitStoryForm from "@/components/submit-story-form";

export const metadata: Metadata = {
  title: "Submit a Story - Ezrafmonline",
  description: "Share your news, opinions, or story ideas with our editorial team. Citizen journalism submissions welcome.",
};

export default function SubmitStoryPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary-light mb-4">
          <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Submit a Story</h1>
        <p className="text-zinc-500 mt-2 max-w-md mx-auto">
          Have a news tip, eyewitness account, or story idea? Share it with us. Our team reviews every submission.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8">
        <SubmitStoryForm />
      </div>
    </div>
  );
}

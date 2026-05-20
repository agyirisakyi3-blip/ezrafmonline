import type { Metadata } from "next";
import RadioSchedule from "@/components/radio-schedule";

export const metadata: Metadata = {
  title: "Live Radio - Ezrafmonline",
  description: "Listen to Ezrafmonline Radio live. Check our program schedule for shows like Ezra Adekyee, Makosem, Live Worship, Ezra Sports Drive, and more.",
};

export default function LiveRadioPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-light mb-5">
          <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Ezrafmonline Radio</h1>
        <p className="text-zinc-500 mt-2 max-w-lg mx-auto">
          Tune in to your favorite shows. Live streaming coming soon — check the schedule below.
        </p>
      </div>

      <RadioSchedule />
    </div>
  );
}

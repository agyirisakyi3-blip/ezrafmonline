"use client";

import { useEffect, useState } from "react";

type Program = {
  id: string;
  title: string;
  host: string | null;
  startTime: string;
  endTime: string;
  days: string;
  description: string | null;
};

function formatTime(time: string) {
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "pm" : "am";
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12}:${m} ${ampm}`;
}

function isActive(program: Program): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const today = dayNames[now.getDay()];

  const dayMatch =
    program.days === "daily" ||
    program.days === "weekdays" ||
    program.days === "weekends" ||
    program.days === today ||
    (program.days === "weekdays" && today !== "saturday" && today !== "sunday") ||
    (program.days === "weekends" && (today === "saturday" || today === "sunday"));

  if (!dayMatch) return false;

  const [startH, startM] = program.startTime.split(":").map(Number);
  const [endH, endM] = program.endTime.split(":").map(Number);
  const start = startH * 60 + startM;
  const end = endH * 60 + endM;

  return currentMinutes >= start && currentMinutes < end;
}

function formatDays(days: string) {
  const map: Record<string, string> = {
    weekdays: "Mon–Fri",
    weekends: "Sat–Sun",
    daily: "Daily",
    monday: "Mon", tuesday: "Tue", wednesday: "Wed",
    thursday: "Thu", friday: "Fri", saturday: "Sat", sunday: "Sun",
  };
  return map[days] || days;
}

export default function RadioSchedule() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    fetch("/api/radio-programs")
      .then((r) => r.json())
      .then((data) => {
        setPrograms(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 bg-zinc-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (programs.length === 0) return null;

  const currentProgram = programs.find(isActive);
  const activeIndex = programs.findIndex(isActive);

  return (
    <div>
      {currentProgram && (
        <div className="bg-primary text-white rounded-2xl p-5 mb-5 flex items-center gap-4 shadow-lg shadow-primary/20">
          <span className="h-3 w-3 rounded-full bg-red-400 animate-pulse shrink-0 shadow-lg shadow-red-400/50" />
          <div>
            <p className="text-xs text-primary/80 font-semibold uppercase tracking-wider">On Air Now</p>
            <p className="font-bold text-lg">{currentProgram.title}</p>
            {currentProgram.host && <p className="text-sm text-primary/90">{currentProgram.host}</p>}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center gap-3">
          <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
          <span className="font-semibold text-zinc-900 text-sm">Weekly Schedule</span>
        </div>

        <div className="divide-y divide-zinc-100">
          {programs.map((p, i) => {
            const active = i === activeIndex;
            return (
              <div
                key={p.id}
                className={`px-5 py-4 flex items-center gap-4 transition-colors ${
                  active ? "bg-primary/5" : "hover:bg-zinc-50"
                }`}
              >
                <div className="flex flex-col items-center min-w-[72px]">
                  <span className="text-xs font-bold text-zinc-900 tabular-nums">{formatTime(p.startTime)}</span>
                  <span className="text-[10px] text-zinc-400">–</span>
                  <span className="text-[10px] text-zinc-500 tabular-nums">{formatTime(p.endTime)}</span>
                </div>

                {active && (
                  <div className="h-8 w-1 rounded-full bg-primary shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold text-sm ${active ? "text-primary" : "text-zinc-900"}`}>
                      {p.title}
                    </p>
                    {active && (
                      <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider bg-red-50 px-1.5 py-0.5 rounded animate-pulse">
                        Live
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded font-medium ml-auto">
                      {formatDays(p.days)}
                    </span>
                  </div>
                  {p.host && (
                    <p className="text-xs text-zinc-500 mt-0.5">{p.host}</p>
                  )}
                  {p.description && (
                    <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{p.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

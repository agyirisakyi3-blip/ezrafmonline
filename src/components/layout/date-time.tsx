"use client";

import { useEffect, useState } from "react";
import WeatherWidget from "../weather";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatDateTime(now: Date) {
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${day}, ${month} ${date}, ${year} | ${h12}:${m} ${ampm}`;
}

export default function DateTimeDisplay() {
  const [dateTime, setDateTime] = useState<Date | null>(null);

  useEffect(() => {
    setDateTime(new Date());
    const id = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!dateTime) return null;

  return (
    <div className="bg-amber-600 text-white text-[11px] leading-none py-1.5">
      <div className="mx-auto max-w-7xl px-4 md:px-8 flex items-center justify-between">
        <span className="flex items-center gap-3">
          <span>{formatDateTime(dateTime)}</span>
          <span className="w-px h-3 bg-white/30" />
          <WeatherWidget />
        </span>
        <span className="hidden sm:inline">Welcome to Ezrafmonline</span>
      </div>
    </div>
  );
}

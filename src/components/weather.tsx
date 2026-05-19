"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type WeatherData = {
  city: string;
  temp: number;
  feelsLike: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  wind: number;
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchWeather() {
      try {
        const res = await fetch("/api/weather");
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data.temp != null) setWeather(data);
          else setError(true);
        } else {
          if (!cancelled) setError(true);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }
    fetchWeather();
    const id = setInterval(fetchWeather, 300_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (error || !weather) return null;

  return (
    <span className="flex items-center gap-1">
      <Image src={weather.icon} alt="" width={20} height={20} className="h-5 w-5" />
      <span>{weather.temp}°C</span>
      <span className="hidden lg:inline text-white/70">{weather.city}</span>
    </span>
  );
}

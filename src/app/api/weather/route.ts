import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const config = await prisma.siteConfig.findUnique({ where: { id: "default" } });
  if (!config?.weatherApiKey || !config?.weatherCity) {
    return NextResponse.json({ error: "Weather not configured" }, { status: 503 });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(config.weatherCity)}&units=metric&appid=${config.weatherApiKey}`;

  const res = await fetch(url, { next: { revalidate: 300 } });

  if (!res.ok) {
    return NextResponse.json({ error: "Weather fetch failed" }, { status: 502 });
  }

  const data = await res.json();

  return NextResponse.json({
    city: data.name,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    humidity: data.main.humidity,
    wind: Math.round(data.wind.speed),
  });
}

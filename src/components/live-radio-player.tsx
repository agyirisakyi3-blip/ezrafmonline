"use client";

import { useEffect, useState, useRef } from "react";

export default function LiveRadioPlayer() {
  const [streamInfo, setStreamInfo] = useState<{ url: string | null; active: boolean }>({ url: null, active: false });
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch("/api/live-stream")
      .then((r) => r.json())
      .then((data) => {
        setStreamInfo(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function togglePlay() {
    if (!audioRef.current) {
      if (!streamInfo.url) return;
      audioRef.current = new Audio(streamInfo.url);
      audioRef.current.preload = "auto";

      audioRef.current.addEventListener("play", () => setPlaying(true));
      audioRef.current.addEventListener("pause", () => setPlaying(false));
      audioRef.current.addEventListener("ended", () => setPlaying(false));
      audioRef.current.addEventListener("error", () => {
        setPlaying(false);
        setError("Unable to play stream. The station may be offline.");
      });
    }

    if (playing) {
      audioRef.current.pause();
    } else {
      setError("");
      audioRef.current.play().catch(() => {
        setError("Unable to play stream. Click play to try again.");
      });
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
        <div className="h-16 bg-zinc-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-6 transition-all ${streamInfo.active ? "bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/20" : "bg-white border border-zinc-200/80"}`}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${streamInfo.active ? "bg-white/15" : "bg-primary-light"}`}>
            <svg className={`h-7 w-7 ${streamInfo.active ? "text-white" : "text-primary"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
          </div>
          {streamInfo.active && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 animate-pulse ring-2 ring-white" />
          )}
        </div>

        <div className="flex-1">
          <p className={`text-xs font-semibold uppercase tracking-wider ${streamInfo.active ? "text-white/70" : "text-zinc-400"}`}>
            {streamInfo.active ? "Live" : "Offline"}
          </p>
          <p className={`font-bold text-lg ${streamInfo.active ? "text-white" : "text-zinc-900"}`}>
            {streamInfo.active ? "Ezrafmonline Radio" : "Stream Offline"}
          </p>
          {streamInfo.active && (
            <p className={`text-sm ${streamInfo.active ? "text-white/80" : "text-zinc-500"}`}>
              Tune in live
            </p>
          )}
        </div>

        {streamInfo.active && (
          <button
            onClick={togglePlay}
            className={`h-12 w-12 rounded-full flex items-center justify-center transition-all shrink-0 ${
              playing
                ? "bg-white/20 hover:bg-white/30"
                : "bg-white hover:bg-white/90 text-primary"
            }`}
          >
            {playing ? (
              <div className="flex items-end gap-0.5 h-4 px-1">
                <span className="w-0.5 bg-white rounded-full h-3 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-0.5 bg-white rounded-full h-4 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-0.5 bg-white rounded-full h-2 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            ) : (
              <svg className="h-5 w-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs mt-3 text-red-300 bg-white/10 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {streamInfo.active && playing && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            defaultValue="1"
            onChange={(e) => {
              if (audioRef.current) {
                audioRef.current.volume = parseFloat(e.target.value);
              }
            }}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/20 accent-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
        </div>
      )}
    </div>
  );
}

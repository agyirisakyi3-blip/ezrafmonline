"use client";

type TrafficRow = { label: string; value: number; color: string; icon: string };

function Bar({ label, value, total, color, icon }: TrafficRow & { total: number }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 group">
      <span className="text-lg shrink-0 w-6 text-center">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">{value.toLocaleString()}</span>
        </div>
        <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
      </div>
      <span className="text-[10px] font-medium text-zinc-400 w-10 text-right tabular-nums">{Math.round(pct)}%</span>
    </div>
  );
}

export function DeviceBreakdown({
  mobile,
  desktop,
  tablet,
}: {
  mobile: number;
  desktop: number;
  tablet: number;
}) {
  const total = mobile + desktop + tablet;
  const items: TrafficRow[] = [
    { label: "Mobile", value: mobile, color: "#256b12", icon: "📱" },
    { label: "Desktop", value: desktop, color: "#0f172a", icon: "💻" },
    { label: "Tablet", value: tablet, color: "#d97706", icon: "📟" },
  ];
  return (
    <div className="cms-animate-fade-in-up cms-delay-8 bg-white dark:bg-[#18181b] rounded-xl border border-zinc-200/70 dark:border-zinc-800 p-5">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm">
          📊
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Devices</h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Traffic by device type</p>
        </div>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <Bar key={item.label} {...item} total={total} />
        ))}
      </div>
    </div>
  );
}

export function SourceBreakdown({
  direct,
  google,
  facebook,
  twitter,
  other,
}: {
  direct: number;
  google: number;
  facebook: number;
  twitter: number;
  other: number;
}) {
  const total = direct + google + facebook + twitter + other;
  const items: TrafficRow[] = [
    { label: "Direct", value: direct, color: "#71717a", icon: "🔗" },
    { label: "Google", value: google, color: "#ea4335", icon: "🔍" },
    { label: "Facebook", value: facebook, color: "#1877f2", icon: "👍" },
    { label: "X (Twitter)", value: twitter, color: "#000000", icon: "🐦" },
    { label: "Other", value: other, color: "#a1a1aa", icon: "🌐" },
  ];
  return (
    <div className="cms-animate-fade-in-up cms-delay-9 bg-white dark:bg-[#18181b] rounded-xl border border-zinc-200/70 dark:border-zinc-800 p-5">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm">
          📈
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Traffic Sources</h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Where visitors come from</p>
        </div>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <Bar key={item.label} {...item} total={total} />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

interface Tab {
  label: string;
  content: React.ReactNode;
}

export default function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex border-b border-zinc-200 overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`shrink-0 px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              i === active
                ? "border-primary text-primary"
                : "border-transparent text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-4">{tabs[active]?.content}</div>
    </div>
  );
}

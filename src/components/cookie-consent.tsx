"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 text-white p-4 shadow-lg">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-300">
          This site uses cookies to improve your experience. By continuing, you agree to our use of cookies.
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={accept}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

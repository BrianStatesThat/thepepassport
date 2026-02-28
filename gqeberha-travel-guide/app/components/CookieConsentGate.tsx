"use client";

import Link from "next/link";
import { Compass, Cookie, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

type ConsentState = "unknown" | "accepted" | "rejected";

const STORAGE_KEY = "pepassport-cookie-consent";
const COOKIE_KEY = "pepassport-cookie-consent";

interface CookieConsentGateProps {
  initialConsent?: ConsentState;
}

export function CookieConsentGate({ initialConsent = "unknown" }: CookieConsentGateProps) {
  const [consent, setConsent] = useState<ConsentState>(initialConsent);

  useEffect(() => {
    if (consent === "accepted") {
      document.body.style.removeProperty("overflow");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [consent]);

  const persistConsent = (value: "accepted" | "rejected") => {
    document.cookie = `${COOKIE_KEY}=${value}; path=/; max-age=31536000; samesite=lax`;

    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Ignore storage errors and continue with in-memory state.
    }
  };

  const handleAccept = () => {
    try {
      persistConsent("accepted");
    } catch {
      // Ignore persistence errors and still allow access after explicit acceptance.
    }
    setConsent("accepted");
  };

  const handleReject = () => {
    try {
      persistConsent("rejected");
    } catch {
      // Ignore persistence errors; keep the gate active via state.
    }
    setConsent("rejected");
  };

  if (consent === "accepted") {
    return null;
  }

  const rejected = consent === "rejected";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/65 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-consent-title"
        className="w-full max-w-lg rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl p-6 md:p-7"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">The PE Passport</p>
            <h2 id="cookie-consent-title" className="font-bold text-dark-gray dark:text-white text-lg">
              Cookie Preferences
            </h2>
          </div>
        </div>

        <p className="text-sm md:text-base text-gray-600 dark:text-slate-300 leading-relaxed mb-5">
          We use cookies to keep core features running and to improve your experience. You must accept cookies to
          continue using this website.
        </p>

        {rejected && (
          <div className="mb-5 rounded-xl border border-orange-200 dark:border-orange-400/30 bg-orange-50 dark:bg-orange-500/10 p-3 text-sm text-orange-800 dark:text-orange-200">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
              <p>
                Cookies were rejected. Access stays locked until cookies are accepted.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mb-5 text-xs text-gray-500 dark:text-slate-400">
          <Cookie className="w-4 h-4 shrink-0" />
          <span>Stored locally on this device. You can update this later in browser settings.</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Accept Cookies
          </button>
          <button
            type="button"
            onClick={handleReject}
            className="flex-1 border border-gray-300 dark:border-slate-600 text-dark-gray dark:text-slate-200 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          >
            Reject
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-500 dark:text-slate-400">
          Read more in our{" "}
          <Link href="/privacy" className="underline hover:text-blue-600 dark:hover:text-blue-400">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

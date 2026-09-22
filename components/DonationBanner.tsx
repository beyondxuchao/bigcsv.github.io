'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Heart, X } from 'lucide-react';

const DISMISSED_KEY = 'csvfilters-donation-banner-dismissed';
const DONATION_URL = 'https://www.paypal.com/paypalme/csvfilters';

function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function DonationBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(window.localStorage.getItem(DISMISSED_KEY) !== getLocalDateKey());
  }, []);

  function dismissBanner() {
    window.localStorage.setItem(DISMISSED_KEY, getLocalDateKey());
    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      aria-label="Support CSVFilters"
      className="border-b border-emerald-200 bg-emerald-50 text-emerald-950"
    >
      <div className="mx-auto flex max-w-[1600px] items-start gap-3 px-4 py-3 sm:items-center">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm sm:mt-0">
          <Heart className="h-4 w-4" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <p className="text-sm leading-6">
            <span className="font-semibold">Help keep CSVFilters running.</span>{' '}
            Your support goes directly toward server costs and infrastructure upgrades.
          </p>
          <a
            href={DONATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:mt-0"
          >
            Support via PayPal
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        <button
          type="button"
          onClick={dismissBanner}
          aria-label="Dismiss support message"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-emerald-700 transition-colors hover:bg-emerald-100 hover:text-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}

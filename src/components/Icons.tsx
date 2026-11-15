import React from 'react';

export function GaushalaEmblem({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="10" fill="#245C43" />
      {/* Minimalist sanctuary arch and sacred leaf/horn motif */}
      <path
        d="M11 28V19.5C11 14.2533 15.0294 10 20 10C24.9706 10 29 14.2533 29 19.5V28"
        stroke="#FFFFFF"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M14.5 19.5C15.5 22.2 17.5 23.5 20 23.5C22.5 23.5 24.5 22.2 25.5 19.5"
        stroke="#8FAF91"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M20 23.5V28.5"
        stroke="#FFFFFF"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M16 28.5H24"
        stroke="#FFFFFF"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="20" cy="16.5" r="2" fill="#FFFFFF" />
    </svg>
  );
}

export function CowLineIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Clean minimalist line silhouette of cow head & horns */}
      <path d="M5 5c0 2.5 1.8 4 3.5 4.2" />
      <path d="M19 5c0 2.5-1.8 4-3.5 4.2" />
      <path d="M7.5 9.2h9l1.2 4.5a5.5 5.5 0 0 1-1.4 5.3 5.8 5.8 0 0 1-8.6 0 5.5 5.5 0 0 1-1.4-5.3l1.2-4.5Z" />
      <path d="M9.5 13h.01" />
      <path d="M14.5 13h.01" />
      <path d="M9.5 17.2c.7.5 1.6.8 2.5.8s1.8-.3 2.5-.8" />
    </svg>
  );
}

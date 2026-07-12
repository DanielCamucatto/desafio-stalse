"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/tickets", label: "Tickets" },
  { href: "/dashboard", label: "Dashboard" },
];

function Logo() {
  return (
    <Link href="/" className="flex min-w-0 items-center">
      {/* eslint-disable-next-line @next/next/no-img-element -- static logo, evita bug do otimizador servindo Content-Disposition: attachment */}
      <img
        src="/logo-stalse.png"
        alt="Stalse"
        className="h-8 w-auto object-contain sm:h-10 md:h-12 lg:h-14"
      />
    </Link>
  );
}

function ChallengeBadge() {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-3 py-1.5 shadow-sm ring-1 ring-black/25 md:px-4 md:py-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-600 md:h-7 md:w-7">
        S
      </span>
      <span className="text-xs font-semibold leading-tight text-gray-600">
        Desafio Técnico
        <br />
        Stalse
      </span>
    </span>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 md:h-28 md:px-6">
        <div className="flex min-w-0 items-center gap-3 py-2 md:gap-4 md:py-3">
          <Logo />
          <ChallengeBadge />
        </div>

        <nav className="hidden items-center gap-1 rounded-full bg-gray-100/60 p-1.5 shadow-sm ring-1 ring-inset ring-black/5 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-500 text-white shadow-sm"
                    : "text-brand-900 hover:text-brand-500"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label="Abrir menu"
          className="flex h-10 w-10 items-center justify-center rounded-md text-brand-900 hover:bg-brand-50 md:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" d="M4 12h16M4 6h16M4 18h16" />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <nav className="flex flex-col gap-1 border-t border-gray-100 px-4 py-3 md:hidden">
          {NAV_LINKS.map((link) => {
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-brand-500 text-white shadow-sm"
                    : "text-brand-900 hover:bg-brand-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}

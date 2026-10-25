"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type NavItem = { href: string; label: string };

/**
 * Mobile menu: a native disclosure, so it still opens before hydration. The
 * header stays mounted across client navigations, so it's closed explicitly
 * when a link is chosen, on Escape, and on a tap outside.
 */
export function MobileMenu({ nav }: { nav: NavItem[] }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = () => {
      if (ref.current) ref.current.open = false;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      close();
      ref.current?.querySelector("summary")?.focus();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <details
      ref={ref}
      className="group lg:hidden"
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary className="type-label flex h-11 cursor-pointer list-none items-center [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">Menu</span>
        <span className="hidden group-open:inline">Close</span>
      </summary>
      <nav aria-label="Primary" className="absolute inset-x-0 top-full border-b border-line bg-canvas">
        <ul className="page-container divide-hairline">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="type-label block py-4"
                onClick={() => {
                  if (ref.current) ref.current.open = false;
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}

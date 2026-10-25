import Link from "next/link";

import { BagLink } from "@/components/bag/bag-link";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { getCategories } from "@/lib/catalog";

export async function SiteHeader() {
  const categories = await getCategories();
  const nav = [
    { href: "/shop", label: "Shop all" },
    ...categories.map((c) => ({ href: `/shop/${c.slug}`, label: c.name })),
  ];

  return (
    <header className="site-header">
      <div className="page-container grid grid-cols-[1fr_auto_1fr] items-center">
        <MobileMenu nav={nav} />

        <nav aria-label="Primary" className="hidden gap-6 lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="type-label tracking-wide-label">
          Luxe Store
        </Link>

        <div className="flex justify-end gap-5">
          <Link href="/shop" className="nav-link max-sm:hidden">
            Search
          </Link>
          {/* Static on purpose: no session read in the shell. Guests are sent to sign-in. */}
          <Link href="/account" className="nav-link">
            Account
          </Link>
          <BagLink />
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";

import { Button, ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";

// Temporary design-system preview. Replace with the real storefront home page.

const nav = ["New In", "Women", "Men", "Bags", "Shoes", "Jewelry"];
const products = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: `Product name ${i + 1}`,
  price: `$${(1200 + i * 150).toLocaleString("en-US")}`,
}));

export default function Home() {
  return (
    <>
      <header className="site-header">
        <Container className="flex items-center justify-between">
          <nav aria-label="Primary" className="hidden gap-6 lg:flex">
            {nav.map((item, i) => (
              <Link
                key={item}
                href="/"
                className="nav-link"
                aria-current={i === 0 ? "page" : undefined}
              >
                {item}
              </Link>
            ))}
          </nav>
          <Button variant="ghost" size="icon" className="lg:hidden">
            Menu
          </Button>
          <Link href="/" className="type-label tracking-wide-label">
            Luxe Store
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="nav-link">
              Search
            </Link>
            <Link href="/" className="nav-link">
              Bag (0)
            </Link>
          </div>
        </Container>
      </header>

      <main className="flex-1">
        <div className="relative flex aspect-[4/5] items-end bg-surface-strong md:aspect-hero">
          <Container className="pb-12 text-center md:pb-20">
            <p className="type-eyebrow">Autumn collection</p>
            <h1 className="type-display mt-4">Quiet materials</h1>
            <div className="mt-8 flex justify-center gap-3">
              <ButtonLink href="/">Shop women</ButtonLink>
              <ButtonLink href="/" variant="secondary">
                Shop men
              </ButtonLink>
            </div>
          </Container>
        </div>

        <Section>
          <Container>
            <div className="mb-8 flex items-baseline justify-between">
              <h2 className="type-headline">New in</h2>
              <Link href="/" className="link type-label">
                View all
              </Link>
            </div>
            <ul className="product-grid">
              {products.map((p) => (
                <li key={p.id}>
                  <Link href="/" className="group block">
                    <div className="media-frame" />
                    <div className="mt-3 space-y-1 px-1 text-center">
                      <p className="text-body-sm">{p.name}</p>
                      <p className="type-price text-ink-muted">{p.price}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>

        <Section className="border-t">
          <Container width="prose" className="space-y-6 text-center">
            <p className="type-eyebrow">Services</p>
            <h2 className="type-headline">Complimentary shipping and returns</h2>
            <p className="text-body-lg text-ink-muted">
              Placeholder copy for an editorial block. Body text runs at 16px
              for reading; interface text runs at 14px.{" "}
              <Link href="/" className="link text-ink">
                Read more
              </Link>
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="accent">Accent</Button>
              <Button disabled>Disabled</Button>
            </div>
          </Container>
        </Section>
      </main>

      <Section as="footer" inverse>
        <Container className="grid gap-8 md:grid-cols-3">
          {["Client services", "The company", "Legal"].map((heading) => (
            <div key={heading} className="space-y-3">
              <p className="type-label">{heading}</p>
              <p className="text-caption text-ink-muted">Footer links</p>
            </div>
          ))}
        </Container>
      </Section>
    </>
  );
}

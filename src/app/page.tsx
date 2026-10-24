import Link from "next/link";

import { ProductArt } from "@/components/product/product-art";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import {
  colorBySlug,
  getProducts,
  type ColorSlug,
  type ProductKind,
} from "@/lib/catalog";

const tiles: { href: string; label: string; kind: ProductKind; color: ColorSlug }[] = [
  { href: "/shop/bags", label: "Bags", kind: "tote", color: "cognac" },
  { href: "/shop/shoes", label: "Shoes", kind: "loafer", color: "black" },
];

export default async function Home() {
  const { items: newIn } = await getProducts({ sort: "newest" });

  return (
    <>
      <div className="relative flex aspect-[4/5] items-end bg-surface-strong md:aspect-hero">
        <Container className="pb-12 text-center md:pb-20">
          <p className="type-eyebrow">Autumn collection</p>
          <h1 className="type-display mt-4">Quiet materials</h1>
          <div className="mt-8 flex justify-center gap-3">
            <ButtonLink href="/shop/ready-to-wear">Ready-to-wear</ButtonLink>
            <ButtonLink href="/shop/bags" variant="secondary">
              Bags
            </ButtonLink>
          </div>
        </Container>
      </div>

      <Section>
        <Container>
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="type-headline">New in</h2>
            <Link href="/shop?sort=newest" className="link type-label">
              View all
            </Link>
          </div>
          <ul className="product-grid">
            {newIn.slice(0, 4).map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <div className="split">
        {tiles.map((tile) => (
          <Link key={tile.href} href={tile.href} className="group relative block">
            <div className="media-frame aspect-portrait">
              <ProductArt
                kind={tile.kind}
                tone={colorBySlug[tile.color].hex}
                className="transition-transform duration-(--duration-slow) ease-luxe group-hover:scale-[1.03]"
              />
            </div>
            <span className="type-label absolute inset-x-0 bottom-8 text-center">
              Shop {tile.label}
            </span>
          </Link>
        ))}
      </div>

      <Section className="border-t">
        <Container width="prose" className="space-y-4 text-center">
          <p className="type-eyebrow">Services</p>
          <h2 className="type-headline">Complimentary shipping and returns</h2>
          <p className="text-body-lg text-ink-muted">
            Every order arrives gift-wrapped, with free returns within 30 days.
          </p>
        </Container>
      </Section>
    </>
  );
}

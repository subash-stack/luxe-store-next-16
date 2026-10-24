import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { getProducts } from "@/lib/catalog";
import { featuredCollections, photos } from "@/lib/editorial";

const GIFT_LIMIT = 50000; // cents

const services = [
  {
    title: "Complimentary shipping",
    body: "Free express delivery on every order, gift-wrapped as standard.",
  },
  {
    title: "Returns within 30 days",
    body: "Send it back unworn for a full refund, collected from your door.",
  },
  {
    title: "Book an appointment",
    body: "Private styling sessions in store or by video call.",
  },
  {
    title: "Care and repairs",
    body: "Leather conditioning and repairs for the life of the piece.",
  },
];

export default async function Home() {
  const [{ items: newIn }, { items: byPrice }] = await Promise.all([
    getProducts({ sort: "newest" }),
    getProducts({ sort: "price-asc" }),
  ]);
  const gifts = byPrice.filter((p) => p.price <= GIFT_LIMIT).slice(0, 4);

  return (
    <>
      {/* Hero: campaign image with copy in its own column, never over the photo. */}
      <section className="grid md:h-[calc(100svh-var(--header-height))] md:min-h-[36rem] md:max-h-[60rem] md:grid-cols-[7fr_5fr]">
        <div className="relative aspect-[4/5] overflow-hidden bg-canvas md:aspect-auto">
          <Image
            src={photos.hero.src}
            alt={photos.hero.alt}
            fill
            preload
            sizes="(min-width: 48rem) 60vw, 100vw"
            className="object-cover object-[30%_center]"
          />
        </div>
        <div className="px-gutter py-10 text-center md:flex md:flex-col md:items-start md:justify-end md:pb-20 md:text-left lg:px-16">
          <p className="type-eyebrow">Autumn–Winter 2026</p>
          <h1 className="type-display mt-4">Quiet materials</h1>
          <p className="mt-4 max-w-sm text-body-lg text-ink-muted max-md:mx-auto">
            Oversized tailoring, brushed wool and leather softened by hand.
          </p>
          <div className="mt-8 flex justify-center gap-3 md:justify-start">
            <ButtonLink href="/shop?sort=newest">Discover</ButtonLink>
            <ButtonLink href="/shop/ready-to-wear" variant="secondary">
              Ready-to-wear
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Featured collections */}
      <Section>
        <Container>
          <div className="mb-8 text-center md:mb-12">
            <p className="type-eyebrow">Collections</p>
            <h2 className="type-headline mt-3">Shop by category</h2>
          </div>
          <ul className="grid grid-cols-2 gap-px gap-y-8 lg:grid-cols-4">
            {featuredCollections.map(({ category, title, photo }) => (
              <li key={category}>
                <Link href={`/shop/${category}`} className="group block">
                  <div className="media-frame aspect-portrait">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 64rem) 25vw, 50vw"
                      className="object-cover transition-transform duration-(--duration-slow) ease-luxe group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="type-label">{title}</p>
                    <p className="mt-1 text-caption text-ink-muted underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-current">
                      Shop now
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* New arrivals: swipeable rail on small screens, four-up on desktop. */}
      <Section className="border-t">
        <Container>
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <div>
              <p className="type-eyebrow">Just in</p>
              <h2 className="type-headline mt-3">New arrivals</h2>
            </div>
            <Link href="/shop?sort=newest" className="link type-label shrink-0">
              View all
            </Link>
          </div>
          <ul className="rail -mx-gutter px-gutter scroll-px-gutter">
            {newIn.slice(0, 8).map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Editorial two-up */}
      <section className="split">
        {[
          {
            photo: photos.camelCoat,
            eyebrow: "The edit",
            title: "The camel coat",
            href: "/shop/ready-to-wear?color=camel",
          },
          {
            photo: photos.tailoring,
            eyebrow: "Tailoring",
            title: "Soft structure",
            href: "/shop/ready-to-wear",
          },
        ].map((story) => (
          <Link
            key={story.title}
            href={story.href}
            className="group relative block aspect-[4/5] overflow-hidden bg-surface"
          >
            <Image
              src={story.photo.src}
              alt={story.photo.alt}
              fill
              sizes="(min-width: 48rem) 50vw, 100vw"
              className="object-cover transition-transform duration-(--duration-slow) ease-luxe group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/55 to-transparent px-gutter pt-24 pb-10 text-white">
              <p className="type-eyebrow text-white/80">{story.eyebrow}</p>
              <p className="type-headline mt-2">{story.title}</p>
              <span className="type-label mt-4 inline-block underline underline-offset-4">
                Shop the edit
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* Brand story */}
      <Section>
        <div className="content-container grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="media-frame aspect-portrait">
            <Image
              src={photos.story.src}
              alt={photos.story.alt}
              fill
              sizes="(min-width: 48rem) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-md md:justify-self-center">
            <p className="type-eyebrow">The atelier</p>
            <h2 className="type-headline mt-3">Made slowly, meant to last</h2>
            <p className="mt-6 text-body-lg text-ink-muted">
              Each piece starts with the material: wool woven in small mills,
              leather tanned with vegetable extracts, silk printed by hand. We
              make fewer things, and we make them to be worn for years.
            </p>
            <ButtonLink href="/shop" variant="secondary" className="mt-8">
              Explore the collection
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* Gift edit: product-focused grid */}
      <Section className="border-t">
        <Container>
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <div>
              <p className="type-eyebrow">Gifts</p>
              <h2 className="type-headline mt-3">Under $500</h2>
            </div>
            <Link href="/shop?sort=price-asc" className="link type-label shrink-0">
              View all
            </Link>
          </div>
          <ul className="product-grid">
            {gifts.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Services */}
      <section className="grid border-t md:grid-cols-[2fr_3fr]">
        <div className="relative aspect-[4/3] bg-surface md:aspect-auto">
          <Image
            src={photos.atelier.src}
            alt={photos.atelier.alt}
            fill
            sizes="(min-width: 48rem) 40vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="section px-gutter md:px-16">
          <p className="type-eyebrow">Client services</p>
          <h2 className="type-headline mt-3">At your service</h2>
          <ul className="mt-10 grid gap-x-10 sm:grid-cols-2">
            {services.map((service) => (
              <li key={service.title} className="border-t py-6">
                <p className="type-label">{service.title}</p>
                <p className="mt-2 text-body text-ink-muted">{service.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

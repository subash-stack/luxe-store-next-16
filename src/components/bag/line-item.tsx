import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { ProductArt } from "@/components/product/product-art";
import { colorBySlug, formatPrice, type ColorSlug, type ProductKind } from "@/lib/catalog";
import { cn } from "@/lib/cn";

type LineItemProps = {
  slug: string;
  name: string;
  color: ColorSlug;
  material: string;
  imageUrl: string | null;
  /** Placeholder art when there's no photo (order snapshots don't keep it). */
  kind?: ProductKind;
  quantity: number;
  lineTotal: number;
  size?: "md" | "sm";
  /** Extra controls under the description (bag quantity stepper, remove). */
  children?: ReactNode;
};

/** One product row: bag, checkout summary and order confirmation. */
export function LineItem({
  slug,
  name,
  color,
  material,
  imageUrl,
  kind,
  quantity,
  lineTotal,
  size = "md",
  children,
}: LineItemProps) {
  const colorInfo = colorBySlug[color];
  const href = `/products/${slug}`;

  return (
    <div className="flex gap-4 py-5">
      <Link
        href={href}
        className={cn("media-frame shrink-0", size === "md" ? "w-24 md:w-28" : "w-16")}
        tabIndex={-1}
        aria-hidden="true"
      >
        {imageUrl ? (
          <Image src={imageUrl} alt="" fill sizes="112px" className="object-cover" />
        ) : (
          kind && <ProductArt kind={kind} tone={colorInfo.hex} />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-4">
          <Link href={href} className="text-body-sm hover:text-ink-muted">
            {name}
          </Link>
          <p className="type-price shrink-0">{formatPrice(lineTotal)}</p>
        </div>
        <p className="mt-1 text-caption text-ink-subtle">
          {colorInfo.name} · {material}
        </p>
        {children ?? (
          <p className="mt-1 text-caption text-ink-subtle">Qty {quantity}</p>
        )}
      </div>
    </div>
  );
}

/** Subtotal / shipping / total block shared by bag, checkout and order pages. */
export function Totals({ subtotal, shipping = 0 }: { subtotal: number; shipping?: number }) {
  return (
    <dl className="space-y-3 text-body-sm">
      <div className="flex justify-between">
        <dt className="text-ink-muted">Subtotal</dt>
        <dd className="type-price">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-ink-muted">Shipping</dt>
        <dd>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</dd>
      </div>
      <div className="flex justify-between border-t border-line pt-3 text-body">
        <dt>Total</dt>
        <dd className="type-price text-body">{formatPrice(subtotal + shipping)}</dd>
      </div>
    </dl>
  );
}

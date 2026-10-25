"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { MAX_QUANTITY, getBag, readBagEntries, writeBagEntries } from "@/lib/bag";
import { getProduct } from "@/lib/catalog";
import { TEST_CARDS } from "@/lib/card";
import { DELIVERY_NOTE_MAX, emailError, phoneError } from "@/lib/checkout";
import { OutOfStockError, createOrder } from "@/lib/orders";
import { clientIp, consumeRateLimit, retryMessage } from "@/lib/rate-limit";
import { requireUser } from "@/lib/session";

export type AddToBagState = { status: "idle" | "added" | "error"; message?: string };

/** Product page "Add to bag". Bound with the product slug. */
export async function addToBag(slug: string): Promise<AddToBagState> {
  const product = await getProduct(slug);
  if (!product || product.stock <= 0) {
    return { status: "error", message: "This piece is sold out." };
  }

  const entries = await readBagEntries();
  const existing = entries.find((e) => e.slug === slug);
  const cap = Math.min(MAX_QUANTITY, product.stock);
  if (existing && existing.quantity >= cap) {
    return { status: "error", message: `You already have the maximum of ${cap} in your bag.` };
  }

  await writeBagEntries(
    existing
      ? entries.map((e) => (e.slug === slug ? { ...e, quantity: e.quantity + 1 } : e))
      : [...entries, { slug, quantity: 1 }],
  );
  return { status: "added" };
}

/** Bag page quantity stepper. 0 removes the line. */
export async function setQuantity(slug: string, quantity: number) {
  const product = await getProduct(slug);
  const cap = Math.min(MAX_QUANTITY, product?.stock ?? 0);
  const next = Math.max(0, Math.min(Math.trunc(quantity), cap));

  const entries = await readBagEntries();
  await writeBagEntries(
    next === 0
      ? entries.filter((e) => e.slug !== slug)
      : entries.map((e) => (e.slug === slug ? { ...e, quantity: next } : e)),
  );
}

export async function removeFromBag(slug: string) {
  const entries = await readBagEntries();
  await writeBagEntries(entries.filter((e) => e.slug !== slug));
}

// --- Checkout ---------------------------------------------------------------

export type CheckoutState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof checkoutSchema>, string>>;
};

const required = (label: string) => z.string().trim().min(1, `Enter your ${label}.`);

const checkoutSchema = z.object({
  // Same rules the form applies as the shopper types (src/lib/checkout.ts).
  email: z
    .string()
    .trim()
    .superRefine((v, ctx) => {
      const message = emailError(v);
      if (message) ctx.addIssue({ code: "custom", message });
    })
    .transform((v) => v.toLowerCase()),
  phone: z
    .string()
    .trim()
    .superRefine((v, ctx) => {
      const message = phoneError(v);
      if (message) ctx.addIssue({ code: "custom", message });
    }),
  // Form submission sends textarea newlines as CRLF, but the textarea's
  // maxLength counts them as one character; normalise so the limits agree.
  deliveryNote: z
    .string()
    .transform((v) => v.replace(/\r\n?/g, "\n"))
    .pipe(
      z
        .string()
        .trim()
        .max(DELIVERY_NOTE_MAX, `Keep your note under ${DELIVERY_NOTE_MAX} characters.`),
    )
    .optional(),
  shippingName: required("full name"),
  addressLine1: required("address"),
  addressLine2: z.string().trim().optional(),
  city: required("city"),
  postalCode: required("postcode"),
  country: required("country"),
  // Demo payment: the browser validates the card and sends only these two.
  cardBrand: z.enum(["Visa", "Mastercard", "American Express", "Card"], {
    error: "Enter your card details.",
  }),
  cardLast4: z.string().regex(/^\d{4}$/, "Enter your card details."),
}).refine(
  // Demo store: only the test cards are accepted. The browser checks the full
  // number; this catches requests that skip the form.
  (v) => TEST_CARDS.some((c) => c.brand === v.cardBrand && c.number.endsWith(v.cardLast4)),
  { path: ["cardLast4"], error: "Real cards aren't accepted in this demo store. Use a test card." },
);

/** Checkout "Confirm payment": validates, creates the order, empties the bag. */
export async function placeOrder(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  // Orders always belong to an account, so they show in its order history. A
  // signed-out request (an expired session, or one that skipped the page) is
  // sent to sign-in and comes back to checkout; the bag cookie survives that.
  const user = await requireUser("/checkout");

  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: CheckoutState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<CheckoutState["fieldErrors"]>;
      fieldErrors[key] ??= issue.message;
    }
    return { error: "Check the highlighted fields.", fieldErrors };
  }

  const bag = await getBag();
  const lines = bag.lines.filter((l) => l.quantity > 0);
  if (lines.length === 0) {
    return { error: "Your bag is empty, or everything in it has sold out." };
  }

  // Counted only once the form is valid, so typos don't use up attempts.
  const limits = await Promise.all([
    consumeRateLimit("checkoutIp", await clientIp()),
    consumeRateLimit("checkoutUser", user.id),
  ]);
  for (const limit of limits) {
    if (!limit.allowed) {
      return { error: retryMessage(limit.retryAfterSeconds).replace("attempts", "orders") };
    }
  }

  let orderId: string;
  try {
    orderId = await createOrder(
      lines.map((l) => ({ slug: l.product.slug, quantity: l.quantity })),
      parsed.data,
      user.id,
    );
  } catch (error) {
    if (error instanceof OutOfStockError) {
      return {
        error:
          error.available > 0
            ? `${error.productName} has only ${error.available} left. Update your bag and try again.`
            : `${error.productName} has just sold out. Remove it from your bag and try again.`,
      };
    }
    // Name and code only: database errors can echo the shopper's details.
    console.error("placeOrder failed", {
      name: error instanceof Error ? error.name : typeof error,
      code: (error as { code?: unknown })?.code,
    });
    return { error: "We couldn't place your order. Nothing was charged; please try again." };
  }

  await writeBagEntries([]);
  // Stock changed: catalog reads tagged "stock" must show it on the next request.
  updateTag("stock");
  redirect(`/orders/${orderId}`);
}

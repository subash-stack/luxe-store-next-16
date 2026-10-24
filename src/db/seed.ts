/**
 * Seed the catalog tables from src/db/seed-data.ts.
 *
 *   npm run db:seed
 *
 * Idempotent: categories and products are upserted by slug and stock by
 * product, all in one batch (a single transaction on the Neon HTTP driver).
 * Uses its own client instead of `@/db` so it only needs DATABASE_URL.
 */
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { count, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import { category, product, productStock } from "./schema/catalog";
import { kindCopy, seedCategories, seedProducts } from "./seed-data";

config({ path: ".env.local" });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set. Add it to .env.local.");

  const db = drizzle({ client: neon(url) });

  // Foreign keys are resolved by slug inside the same statement, so the batch
  // doesn't need ids from earlier statements.
  const categoryIdFor = (slug: string) =>
    sql<number>`(select ${category.id} from ${category} where ${category.slug} = ${slug})`;
  const productIdFor = (slug: string) =>
    sql<number>`(select ${product.id} from ${product} where ${product.slug} = ${slug})`;

  await db.batch([
    db
      .insert(category)
      .values(seedCategories.map((c, position) => ({ ...c, position })))
      .onConflictDoUpdate({
        target: category.slug,
        set: {
          name: sql`excluded.name`,
          description: sql`excluded.description`,
          position: sql`excluded.position`,
        },
      }),
    db
      .insert(product)
      .values(
        seedProducts.map((p) => ({
          categoryId: categoryIdFor(p.category),
          slug: p.slug,
          name: p.name,
          description: kindCopy[p.kind].description,
          details: kindCopy[p.kind].details,
          material: p.material,
          color: p.color,
          kind: p.kind,
          imageUrl: p.image,
          priceCents: p.price,
          isNew: p.isNew,
          createdAt: new Date(p.createdAt),
        })),
      )
      .onConflictDoUpdate({
        target: product.slug,
        set: {
          categoryId: sql`excluded.category_id`,
          name: sql`excluded.name`,
          description: sql`excluded.description`,
          details: sql`excluded.details`,
          material: sql`excluded.material`,
          color: sql`excluded.color`,
          kind: sql`excluded.kind`,
          imageUrl: sql`excluded.image_url`,
          priceCents: sql`excluded.price_cents`,
          isNew: sql`excluded.is_new`,
          createdAt: sql`excluded.created_at`,
        },
      }),
    db
      .insert(productStock)
      .values(
        seedProducts.map((p) => ({
          productId: productIdFor(p.slug),
          quantity: p.stock,
        })),
      )
      .onConflictDoUpdate({
        target: productStock.productId,
        set: { quantity: sql`excluded.quantity`, updatedAt: sql`now()` },
      }),
  ]);

  const [[categories], [products], [stock]] = await db.batch([
    db.select({ n: count() }).from(category),
    db.select({ n: count() }).from(product),
    db.select({ n: count() }).from(productStock),
  ]);
  console.log(
    `Seeded: ${categories.n} categories, ${products.n} products, ${stock.n} stock rows`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

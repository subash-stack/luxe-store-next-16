import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
console.log(JSON.stringify({ tote: (await sql`select s.quantity from product p join product_stock s on s.product_id = p.id where p.slug='archive-tote-black'`)[0].quantity, orders: (await sql`select count(*)::int n from "order"`)[0].n }));

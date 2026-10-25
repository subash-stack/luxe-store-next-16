import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
config({ path: ".env.local", quiet: true });
const sql = neon(process.env.DATABASE_URL!);
const rows = await sql`delete from app_rate_limit returning key`;
console.log(`cleared ${rows.length} rate-limit rows`);

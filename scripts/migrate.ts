import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run migrations");
}

const client = postgres(databaseUrl, { max: 1, prepare: false });

try {
  await migrate(drizzle(client), { migrationsFolder: "./drizzle/migrations" });
} finally {
  await client.end({ timeout: 5 });
}

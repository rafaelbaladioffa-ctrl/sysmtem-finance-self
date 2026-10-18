import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { getEnv } from "@/infrastructure/config/env";
import * as schema from "@/infrastructure/db/schema";

let client: ReturnType<typeof postgres> | undefined;

function getClient() {
  client ??= postgres(getEnv().DATABASE_URL, {
    max: 5,
    prepare: false,
  });
  return client;
}

export function getDatabase() {
  return drizzle(getClient(), { schema });
}

export async function closeDatabase() {
  if (client) {
    await client.end({ timeout: 5 });
    client = undefined;
  }
}

export async function checkDatabaseConnection() {
  await getClient()`select 1`;
}

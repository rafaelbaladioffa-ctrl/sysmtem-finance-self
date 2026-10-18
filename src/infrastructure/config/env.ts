import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url(),
  APP_TIMEZONE: z.string().default("America/Sao_Paulo"),
  APP_CURRENCY: z.string().length(3).default("BRL"),
});

export function getEnv() {
  return envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    APP_TIMEZONE: process.env.APP_TIMEZONE,
    APP_CURRENCY: process.env.APP_CURRENCY,
  });
}

import dotenv from "dotenv";

dotenv.config();

/**
 * Central place for all environment variables.
 * Fails fast on startup if a required variable is missing,
 * instead of crashing later inside a random request handler.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${name}. Check your .env file against .env.example`
    );
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000",
  adminOrigin: process.env.ADMIN_ORIGIN ?? "http://localhost:3001",

  supabaseUrl: required("SUPABASE_URL"),
  supabaseServiceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),
  supabaseJwtSecret: required("SUPABASE_JWT_SECRET"),

  receiptSignedUrlTtl: Number(process.env.RECEIPT_SIGNED_URL_TTL ?? 300),
  receiptsBucket: process.env.RECEIPTS_BUCKET ?? "receipts",

  isProduction: process.env.NODE_ENV === "production",
};

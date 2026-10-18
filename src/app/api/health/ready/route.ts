import { checkDatabaseConnection } from "@/infrastructure/db/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await checkDatabaseConnection();
    return Response.json({ status: "ok", checks: { database: "ok" } });
  } catch {
    return Response.json(
      { status: "unavailable", checks: { database: "unavailable" } },
      { status: 503 },
    );
  }
}

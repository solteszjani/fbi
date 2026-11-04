import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ status: "ok", app: "FBI Operations Center", databaseConfigured: Boolean(process.env.DATABASE_URL) });
}

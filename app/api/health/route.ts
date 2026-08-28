import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    service: "dev-nexus-academy-web",
    status: "ok",
  });
}

import { NextResponse } from "next/server";
import { zollfelder } from "@/data/zollfelder";

export function GET() {
  return NextResponse.json({ data: zollfelder });
}


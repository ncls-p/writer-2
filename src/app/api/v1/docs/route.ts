import { NextResponse } from "next/server";

import { generateOpenAPIDocument } from "@/lib/openapi/registry";

import "@/lib/openapi/schemas/routes";

export const dynamic = "force-dynamic";

export async function GET() {
  const document = generateOpenAPIDocument();

  return NextResponse.json(document);
}

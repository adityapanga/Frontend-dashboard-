import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client";

const schema = z.object({
  text_query: z.string().min(1),
});

export async function GET() {
  const queries = await prisma.tracer.findMany();
  return NextResponse.json({ data: queries });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = schema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { errors: validation.error.errors },
      { status: 400 }
    );
  }

  try {
    const result = await prisma.$queryRawUnsafe(body.text_query);
    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

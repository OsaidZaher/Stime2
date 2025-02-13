/*import { AuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";
import { authOptions } from "@/app/auth.config";

async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { target } = await request.json();

    const newTarget = await prisma.goals.create({
      data: {
        target: target,
      },
    });
    return NextResponse.json(newTarget, { status: 201 });
  } catch (error) {

  }
}*/

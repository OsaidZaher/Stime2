import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth.config";
import { cookies } from "next/headers";
import { headers } from "next/headers";
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Invalid subject name" },
        { status: 400 }
      );
    }

    const userId = session.user.id.toString();

    const formattedName = name.charAt(0).toUpperCase() + name.slice(1).trim();

    // Normalize for case-insensitive check
    const normalizedName = formattedName.toLowerCase();

    try {
      const existingSubject = await prisma.subject.findFirst({
        where: {
          userId: userId,
          name: {
            equals: normalizedName,
            mode: "insensitive",
          },
        },
      });

      if (existingSubject) {
        return NextResponse.json(
          { error: "A subject with this name already exists" },
          { status: 409 }
        );
      }

      const newSubject = await prisma.subject.create({
        data: {
          name: formattedName,
          userId: userId,
        },
      });

      return NextResponse.json(newSubject, { status: 201 });
    } catch (prismaError) {
      console.error("Prisma error:", prismaError);
      return NextResponse.json(
        { error: "Error processing subject", details: String(prismaError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to add subject", details: String(error) },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const cookieStore = cookies();
    const headersList = headers();

    const session = await getServerSession(authOptions);

    console.log("Session in GET:", session);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id.toString(); // Use user ID directly as a string

    const subjects = await prisma.subject.findMany({
      where: { userId },
    });
    return NextResponse.json({ subjects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}

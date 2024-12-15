import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth.config";
import { cookies } from "next/headers";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const headersList = headers();

    const session = await getServerSession(authOptions);
    console.log("Session in POST:", session);

    if (!session || !session.user || !session.user.id) {
      console.log("Unauthorized: No valid session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Invalid subject name" },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    console.log("User ID from session:", userId);

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.log("User not found in database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create new subject
    const newSubject = await prisma.subject.create({
      data: { name, userId },
    });

    console.log("New subject created:", newSubject);

    return NextResponse.json(newSubject, { status: 201 });
  } catch (error) {
    console.error("Error adding subject:", error);
    return NextResponse.json(
      { error: "Failed to add subject" },
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

    const userId = session.user.id; // Use user ID directly as a string

    // Fetch all subjects for the current user from the database
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

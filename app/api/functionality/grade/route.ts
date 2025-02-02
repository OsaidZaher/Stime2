import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth.config";
// You can import cookies and headers if needed,
// but in this example they are not used beyond session checks.

export async function POST(request: Request) {
  try {
    // Get session and verify the user is authenticated.
    const session = await getServerSession(authOptions);
    console.log("Session in POST:", session);
    if (!session || !session.user || !session.user.id) {
      console.log("Unauthorized: No valid session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the JSON body.
    const body = await request.json();
    const { subject, grade } = body;

    // Validate input.
    if (!subject || typeof subject !== "string") {
      return NextResponse.json(
        { error: "Invalid subject name" },
        { status: 400 }
      );
    }
    if (!grade || typeof grade !== "string") {
      return NextResponse.json({ error: "Invalid grade" }, { status: 400 });
    }

    const userId = session.user.id.toString();
    console.log("User ID from session:", userId);

    // Verify that the user exists.
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      console.log("User not found in database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Look for an existing subject for the user.
    let subjectRecord = await prisma.subject.findFirst({
      where: {
        name: subject,
        userId,
      },
    });

    // If the subject doesn't exist, create it.
    if (!subjectRecord) {
      subjectRecord = await prisma.subject.create({
        data: {
          name: subject,
          userId,
        },
      });
    }

    // Create a new UserGrade record.
    // Note: We store the grade inside an array (as per your schema).
    const newGrade = await prisma.userGrade.create({
      data: {
        grades: [grade], // grade is wrapped in an array
        userId,
        subjectId: subjectRecord.id,
      },
    });
    console.log("New grade added:", newGrade);

    return NextResponse.json(newGrade, { status: 201 });
  } catch (error) {
    console.error("Error adding grade:", error);
    return NextResponse.json({ error: "Failed to add grade" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session in GET:", session);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id.toString();

    const subjects = await prisma.subject.findMany({
      where: { userId },
      include: {
        userGrades: true,
      },
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

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subjectIdParam = searchParams.get("subjectId");

    if (!subjectIdParam) {
      return NextResponse.json(
        { error: "Subject ID is required" },
        { status: 400 }
      );
    }

    const subjectId = parseInt(subjectIdParam, 10);

    if (isNaN(subjectId)) {
      return NextResponse.json(
        { error: "Invalid subject ID format" },
        { status: 400 }
      );
    }

    const userId = session.user.id.toString();

    const subject = await prisma.subject.findFirst({
      where: {
        id: subjectId,
        userId,
      },
    });

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    await prisma.userGrade.deleteMany({
      where: {
        subjectId,
        userId,
      },
    });

    await prisma.subject.delete({
      where: {
        id: subjectId,
      },
    });

    return NextResponse.json({
      message: "Subject and grades deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting subject:", error);
    return NextResponse.json(
      { error: "Failed to delete subject" },
      { status: 500 }
    );
  }
}

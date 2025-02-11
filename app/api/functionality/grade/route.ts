import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth.config";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, grade } = await request.json();

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

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Case-insensitive subject check
    const existingSubject = await prisma.subject.findFirst({
      where: {
        name: {
          equals: subject,
          mode: "insensitive",
        },
        userId,
      },
    });

    if (existingSubject) {
      const newGrade = await prisma.userGrade.create({
        data: {
          grades: [grade],
          userId,
          subjectId: existingSubject.id,
        },
      });
      return NextResponse.json(newGrade, { status: 201 });
    }

    const newSubject = await prisma.subject.create({
      data: {
        name: subject.toLowerCase(),
        userId,
      },
    });

    const newGrade = await prisma.userGrade.create({
      data: {
        grades: [grade],
        userId,
        subjectId: newSubject.id,
      },
    });

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

    const body = await request.json();
    const { gradeId } = body;

    if (!gradeId) {
      return NextResponse.json(
        { error: "Grade ID is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id.toString();

    const grade = await prisma.userGrade.findFirst({
      where: {
        id: gradeId,
        userId,
      },
    });

    if (!grade) {
      return NextResponse.json(
        { error: "Grade not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.userGrade.delete({
      where: {
        id: gradeId,
      },
    });

    return NextResponse.json({
      message: "Grade deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting grade:", error);
    return NextResponse.json(
      { error: "Failed to delete grade" },
      { status: 500 }
    );
  }
}

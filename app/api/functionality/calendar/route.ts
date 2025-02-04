import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/app/auth.config";

export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { examName, date } = await req.json();
    const userId = session.user.id;

    const examDate = new Date(date);
    if (isNaN(examDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const exam = await prisma.exam.create({
      data: {
        name: examName,
        date: examDate,
        user: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json(exam, { status: 201 });
  } catch (error) {
    console.error("Error creating exam:", error);
    return NextResponse.json(
      { error: "Failed to create exam" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const exams = await prisma.exam.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "asc" },
      include: { user: true },
    });

    return NextResponse.json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    return NextResponse.json(
      { error: "Failed to fetch exams" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "invalid session" }, { status: 404 });
    }

    const body = await request.json();
    const { examId } = body;

    if (!examId) {
      return NextResponse.json(
        { error: "No examId recieved" },
        { status: 404 }
      );
    }

    await prisma.exam.delete({
      where: {
        id: examId,
      },
    });

    return NextResponse.json({ message: "Subject exam deleted successfully" });
  } catch (error) {
    console.error("error deleting exam", error);
    NextResponse.json({ error: "Failed to delete exam" }, { status: 500 });
  }
}

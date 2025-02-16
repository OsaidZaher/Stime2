import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/app/auth.config";

export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subjectId, topic, startTime, endTime } = await req.json();

    const parsedSubjectId = Number(subjectId);

    const userId = session.user.id;

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }
    const duration = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60)
    );

    const subject = await prisma.subject.findFirst({
      where: {
        id: parsedSubjectId,
        userId: userId,
      },
      include: {
        subjectGoal: true,
      },
    });

    if (!subject) {
      return NextResponse.json(
        { error: "Subject not found or doesn't belong to the current user" },
        { status: 404 }
      );
    }

    // Create the study session
    const studySession = await prisma.studySession.create({
      data: {
        subjectId: parsedSubjectId,
        userId: userId,
        topic,
        startTime: startDate,
        endTime: endDate,
        duration,
      },
    });

    if (subject.subjectGoal) {
      const newCompletion = subject.subjectGoal.completion + duration;
      const isCompleted = newCompletion >= subject.subjectGoal.target * 60;

      await prisma.subjectGoal.update({
        where: {
          id: subject.subjectGoal.id,
        },
        data: {
          completion: newCompletion,
          isCompleted: isCompleted,
        },
      });
    }

    return NextResponse.json(studySession, { status: 201 });
  } catch (error) {
    console.error("Error creating study session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const studySessions = await prisma.studySession.findMany({
      where: { userId: userId },
      include: { subject: true },
      orderBy: { startTime: "desc" },
    });

    const formattedSessions = studySessions.map((session) => ({
      id: session.id,
      duration: session.duration,
      topic: session.topic,
      subject: {
        name: session.subject.name,
      },
      startTime: session.startTime.toISOString(),
    }));

    return NextResponse.json(formattedSessions);
  } catch (error) {
    console.error("Error fetching study sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch study sessions" },
      { status: 500 }
    );
  }
}

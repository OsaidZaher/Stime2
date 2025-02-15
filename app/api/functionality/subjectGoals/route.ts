import { authOptions } from "@/app/auth.config";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
      return NextResponse.json({ error: "unathorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const { subject, target, isCompleted, completion } = await request.json();

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
      const newSubjectGoal = await prisma.subjectGoal.create({
        data: {
          isCompleted,
          subjectId: existingSubject.id,
          target,
          completion,
          userId,
        },
      });
      return NextResponse.json(newSubjectGoal, { status: 201 });
    }

    const newSubject = await prisma.subject.create({
      data: {
        userId,
        name: subject,
      },
    });

    const newSubjectGoal = await prisma.subjectGoal.create({
      data: {
        isCompleted,
        subjectId: newSubject.id,
        target,
        completion,
        userId,
      },
    });

    return NextResponse.json(newSubjectGoal, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "faield to post subejct goal" },
      { status: 404 }
    );
  }
}

export async function GET(res: Response) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const subjectGoals = await prisma.subjectGoal.findMany({
      where: { userId },
      include: { subject: true },
    });

    return NextResponse.json({ subjectGoals }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "failed to fetch weekly goals" },
      { status: 500 }
    );
  }
}

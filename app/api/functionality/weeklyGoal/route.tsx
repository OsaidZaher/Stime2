import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { authOptions } from "@/app/auth.config";
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { target, completion } = await request.json();
    const userId = session?.user.id;

    const today = new Date();
    const isMonday = today.getDay() === 1;

    const existingGoal = await prisma.weeklyGoal.findUnique({
      where: {
        userId: userId,
      },
    });

    let weeklyGoal;
    if (existingGoal) {
      weeklyGoal = await prisma.weeklyGoal.update({
        where: {
          userId: userId,
        },
        data: {
          target,
          completion: isMonday ? 1 : completion,
        },
      });
    } else {
      weeklyGoal = await prisma.weeklyGoal.create({
        data: {
          target,
          userId,
          completion: 1,
        },
      });
    }

    return NextResponse.json(weeklyGoal, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "failed to add goal" }, { status: 500 });
  }
}
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.id)
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const userId = session.user.id;

    const weeklyGoal = await prisma.weeklyGoal.findUnique({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json(weeklyGoal, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "failed to fetch weekly goal" },
      { status: 500 }
    );
  }
}

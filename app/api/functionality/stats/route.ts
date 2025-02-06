import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import { authOptions } from "@/app/auth.config";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const monthStart = new Date(now);
    monthStart.setMonth(now.getMonth() - 1);

    const yearStart = new Date(now);
    yearStart.setFullYear(now.getFullYear() - 1);

    const [weekSessions, monthSessions, yearSessions] = await Promise.all([
      prisma.studySession.findMany({
        where: {
          userId,
          startTime: {
            gte: weekStart,
          },
        },
      }),
      prisma.studySession.findMany({
        where: {
          userId,
          startTime: {
            gte: monthStart,
          },
        },
      }),
      prisma.studySession.findMany({
        where: {
          userId,
          startTime: {
            gte: yearStart,
          },
        },
      }),
    ]);

    const averages = (session: any[]) => {
      if (session.length === 0) {
        return "0h 0m";
      }

      const totalDuration = session.reduce((sum, session) => {
        +sum + session.duarion, 0;
      });
      const averageSeconds = Math.round(totalDuration / session.length);
      const hours = Math.floor(averageSeconds / 3600);
      const minutes = Math.floor((averageSeconds % 3600) / 60);

      return `${hours}h ${minutes}m`;
    };

    const stats = {
      weekSessions: weekSessions.length,
      monthSessions: monthSessions.length,
      yearSessions: yearSessions.length,
      weekAverage: averages(weekSessions),
      monthAverage: averages(monthSessions),
      yearAverage: averages(yearSessions),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("failed to fetch stats", error);
    return NextResponse.json(
      { error: "failed to fetch stats" },
      { status: 500 }
    );
  }
}

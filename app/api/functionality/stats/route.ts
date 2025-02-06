import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth.config";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();

    // Calculate date ranges
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const monthStart = new Date(now);
    monthStart.setMonth(now.getMonth() - 1);

    const yearStart = new Date(now);
    yearStart.setFullYear(now.getFullYear() - 1);

    // Get study sessions for each time period
    const [weekSessions, monthSessions, yearSessions] = await Promise.all([
      // Week sessions
      prisma.studySession.findMany({
        where: {
          userId,
          startTime: {
            gte: weekStart,
          },
        },
      }),
      // Month sessions
      prisma.studySession.findMany({
        where: {
          userId,
          startTime: {
            gte: monthStart,
          },
        },
      }),
      // Year sessions
      prisma.studySession.findMany({
        where: {
          userId,
          startTime: {
            gte: yearStart,
          },
        },
      }),
    ]);

    // Calculate averages (duration is stored in seconds)
    const calculateAverage = (sessions: any[]) => {
      if (sessions.length === 0) return "0h 0m";
      const totalDuration = sessions.reduce(
        (sum, session) => sum + session.duration,
        0
      );
      const averageSeconds = Math.round(totalDuration / sessions.length);
      const hours = Math.floor(averageSeconds / 3600);
      const minutes = Math.floor((averageSeconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    };

    const stats = {
      weekSessions: weekSessions.length,
      monthSessions: monthSessions.length,
      yearSessions: yearSessions.length,
      weekAverage: calculateAverage(weekSessions),
      monthAverage: calculateAverage(monthSessions),
      yearAverage: calculateAverage(yearSessions),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching study session stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch study session statistics" },
      { status: 500 }
    );
  }
}

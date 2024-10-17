import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/app/auth.config";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get the start of this week and last week
    const now = new Date();
    const startOfThisWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfLastWeek = new Date(
      new Date(startOfThisWeek).setDate(startOfThisWeek.getDate() - 7)
    );

    // Fetch study sessions for this week and last week
    const studySessions = await prisma.studySession.findMany({
      where: {
        userId: userId,
        startTime: {
          gte: startOfLastWeek,
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    // Process the data
    const weekData = {
      thisWeek: Array(7).fill(0),
      lastWeek: Array(7).fill(0),
    };

    studySessions.forEach((session) => {
      const dayOfWeek = session.startTime.getDay();
      const weekIndex =
        session.startTime < startOfThisWeek ? "lastWeek" : "thisWeek";
      weekData[weekIndex][dayOfWeek] += session.duration / 3600; // Convert seconds to hours
    });

    // Format the data for the chart
    const chartData = weekData.thisWeek.map((value, index) => ({
      day: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][index],
      thisWeek: Number(value.toFixed(2)),
      lastWeek: Number(weekData.lastWeek[index].toFixed(2)),
    }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Error fetching study time data:", error);
    return NextResponse.json(
      { error: "Failed to fetch study time data" },
      { status: 500 }
    );
  }
}

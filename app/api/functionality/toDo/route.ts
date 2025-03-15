import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth.config";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.id;
    const taskToDo = await prisma.toDo.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ taskToDo });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch tasks" }),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { task, isCompleted, isDisplayed } = await request.json();
    const userId = session.user.id;

    const newTask = await prisma.toDo.create({
      data: {
        task,
        isCompleted,
        isDisplayed, // Include the new field
        userId,
      },
    });

    return NextResponse.json({ newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create task" }),
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { id, editedTask, isCompleted, isDisplayed } = await request.json();
    const userId = session.user.id;

    const task = await prisma.toDo.findUnique({
      where: { id },
    });

    if (!task || task.userId !== userId) {
      return new NextResponse(
        JSON.stringify({ error: "Task not found or unauthorized" }),
        { status: 404 }
      );
    }

    const updatedTask = await prisma.toDo.update({
      where: { id },
      data: {
        task: editedTask,
        isCompleted,
        isDisplayed, // Include the new field
      },
    });

    return NextResponse.json({ updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to update task" }),
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { id } = await request.json();
    const userId = session.user.id;

    const task = await prisma.toDo.findUnique({
      where: { id },
    });

    if (!task || task.userId !== userId) {
      return new NextResponse(
        JSON.stringify({ error: "Task not found or unauthorized" }),
        { status: 404 }
      );
    }

    await prisma.toDo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to delete task" }),
      { status: 500 }
    );
  }
}

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
      orderBy: { priority: "desc" },
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

    const { task, isCompleted, priority, dueDate } = await request.json();
    const userId = session.user.id;

    const newTask = await prisma.toDo.create({
      data: {
        task,
        isCompleted,
        priority,
        userId,
        dueDate: dueDate,
      },
    });

    return NextResponse.json({ newTask });
  } catch (error) {
    console.error("Error creating task:", error);
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

    const { id, editedTask, isCompleted, priority, dueDate } =
      await request.json();
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
        priority,
        dueDate: dueDate !== undefined ? dueDate : null,
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

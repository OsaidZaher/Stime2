import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth.config";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.id)
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const userId = session.user.id;

    const { task, isCompleted } = await req.json();

    const toDoTask = await prisma.toDo.create({
      data: {
        userId,
        isCompleted,
        task,
      },
    });

    return NextResponse.json(toDoTask, { status: 200 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "failed to post new task" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.id)
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const userId = session.user.id;

    const taskToDo = await prisma.toDo.findMany({
      where: { userId },
    });

    return NextResponse.json({ taskToDo }, { status: 200 });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.id)
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const userId = session.user.id;

    const { id, editedTask, isCompleted } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const existingTask = await prisma.toDo.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updatedTask = await prisma.toDo.update({
      where: { id },
      data: {
        task: editedTask,
        isCompleted,
      },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error in PATCH handler:", error);
    return NextResponse.json(
      { error: "failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.id)
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const userId = session.user.id;

    const body = await req.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const existingTask = await prisma.toDo.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.toDo.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      { error: "failed to delete task" },
      { status: 500 }
    );
  }
}

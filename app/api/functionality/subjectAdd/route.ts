import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST request to add a new subject
export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    // Validate the name field
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Invalid subject name" },
        { status: 400 }
      );
    }

    // Check if the subject already exists
    const existingSubject = await prisma.subject.findUnique({
      where: { name },
    });

    if (existingSubject) {
      return NextResponse.json(
        { error: "Subject already exists" },
        { status: 400 }
      );
    }

    // Create a new subject
    const newSubject = await prisma.subject.create({
      data: { name },
    });

    return NextResponse.json(newSubject, { status: 201 });
  } catch (error) {
    console.error("Error creating subject:", error);
    return NextResponse.json(
      { error: "Failed to create subject" },
      { status: 500 }
    );
  }
}

// GET request to retrieve the list of subjects
export async function GET() {
  try {
    // Fetch all subjects from the database
    const subjects = await prisma.subject.findMany();

    return NextResponse.json(subjects, { status: 200 });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}

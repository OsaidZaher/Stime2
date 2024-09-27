import { NextResponse } from "next/server"; // utility to return http responsese in api fiels
import { prisma } from "@/lib/prisma"; // ORM for easy querying in database
import bcrypt from "bcryptjs"; // to encrypt passwords

// this function is exectued when a post request is made
export async function POST(request: Request) {
  try {
    // the response.jon function extracts the deconstructed data from the post body in json format
    const { email, password, name, lastname } = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // If the user already exists, return an error response
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash the password before saving it to the database
    const hashPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database (email should not be hashed)
    const newUser = await prisma.user.create({
      data: {
        email, // Store plain email
        password: hashPassword, // Store hashed password
        name,
        lastname,
      },
    });

    // using NextResponse utility we send a response of the user object and successfully created if no errors made
    return NextResponse.json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (err) {
    console.log(err);

    // if errors we send an error message with the status of 500 and the details of the error
    return NextResponse.json(
      { error: "Failed to create user", details: err },
      { status: 500 }
    );
  }
}

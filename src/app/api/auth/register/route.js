import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password, image } = await req.json();

    const db = await connectDB();
    const usersCollection = db.collection("users");

    const isExist = await usersCollection.findOne({ email });
    if (isExist) {
      return NextResponse.json(
        { message: "User already exists with this email!" },
        { status: 400 }
      );
    }

 
    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = {
      name,
      email,
      password: hashedPassword,
      image: image || "https://i.ibb.co/vBR74KV/user.png",
      role: "user",
      createdAt: new Date(),
    };

 
    const result = await usersCollection.insertOne(newUser);

    return NextResponse.json(
      { message: "User registered successfully", userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
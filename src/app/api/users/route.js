import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const db = await connectDB();
    const userCollection = db.collection("users");

    let query = {};
    const email = searchParams.get("email");
    if (email) query.email = email;

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const totalUsers = await userCollection.countDocuments(query);
    const result = await userCollection
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      result,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    return NextResponse.json({ message: "Failed To Fetch Users Data" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, image } = body;

    const db = await connectDB();
    const userCollection = db.collection("users");

    const exist = await userCollection.findOne({ email });
    if (exist) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      image: image || "",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await userCollection.insertOne(newUser);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create user", error: error.message }, { status: 500 });
  }
}
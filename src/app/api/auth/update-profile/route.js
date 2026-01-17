import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, image } = await req.json();
    const db = await connectDB();

    await db.collection("users").updateOne(
      { email: session.user.email },
      { $set: { name, image, updatedAt: new Date() } }
    );

    return NextResponse.json({ message: "Updated" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
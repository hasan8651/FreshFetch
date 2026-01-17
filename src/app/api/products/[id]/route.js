import { NextResponse } from "next/server";
import { connectDB, ObjectId } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = await params; 
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid product id" }, { status: 400 });
    }

    const db = await connectDB();
    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Single Product Fetch Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch product", error: error.message }, 
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const db = await connectDB();

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Product Not Found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated successfully", result });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const db = await connectDB();

    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Product Not Found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully", result });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete product" }, { status: 500 });
  }
}
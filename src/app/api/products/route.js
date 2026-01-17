import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const db = await connectDB();
     if (!db) {
      throw new Error("Could not connect to database");
    }
    const productCollection = db.collection("products");

    const query = {};


    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const rating = searchParams.get("rating");

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (rating) query.rating = { $gte: Number(rating) };


    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;


    const sortBy = searchParams.get("sortBy");
    const order = searchParams.get("order") === "desc" ? -1 : 1;
    let sort = {};
    if (sortBy) {
      sort[sortBy] = order;
    } else {
      sort = { createdAt: -1 };
    }

    const totalProducts = await productCollection.countDocuments(query);
    const products = await productCollection
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ 
      message: "Failed to fetch products", 
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const db = await connectDB();
    
    const product = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("products").insertOne(product);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 });
  }
}
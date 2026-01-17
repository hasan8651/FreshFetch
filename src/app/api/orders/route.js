import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized! Please login." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const emailQuery = searchParams.get("email");
    const userRole = session?.user?.role;
    const userEmail = session?.user?.email;

    let query = {};

    if (userRole === "admin" || userRole === "manager") {
      if (emailQuery) {
        query.email = emailQuery;
      }
    } 
 
    else {
      query.email = userEmail;
    }

    const db = await connectDB();
    const ordersCollection = db.collection("orders");


    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const totalOrder = await ordersCollection.countDocuments(query);
    const orders = await ordersCollection
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      totalOrder,
      currentPage: page,
      totalPages: Math.ceil(totalOrder / limit),
      orders,
    });
  } catch (error) {
    console.error("GET Orders Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders", error: error.message }, 
      { status: 500 }
    );
  }
}


export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Please login to place an order" }, { status: 401 });
    }

    const body = await req.json();
    const { email, products, total, paymentMethod, shippingAddress, transactionId } = body;

 
    if (!email || !products || products.length === 0 || !total) {
      return NextResponse.json({ message: "Invalid order data" }, { status: 400 });
    }

    const db = await connectDB();
    
    const order = {
      userId: session?.user?.id || null,
      email,
      products,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
      transactionId: paymentMethod !== "COD" ? transactionId : null,
      orderStatus: "pending",
      shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(order);

    return NextResponse.json({
      message: "Order created successfully",
      orderId: result.insertedId,
    }, { status: 201 });
  } catch (error) {
    console.error("POST Order Error:", error);
    return NextResponse.json(
      { message: "Failed to create order", error: error.message }, 
      { status: 500 }
    );
  }
}
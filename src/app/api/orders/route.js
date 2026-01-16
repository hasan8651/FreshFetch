import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


const session = await getServerSession(authOptions);

if (!session || (session.user.role !== "admin" && session.user.role !== "manager")) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
}
export async function GET(req) {
  try {
    const db = await getDb();
    const ordersCollection = db.collection("orders");

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    if (email) query.email = email;

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
    return NextResponse.json({ message: "Failed to fetch orders", error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { email, products, total, paymentMethod, shippingAddress, transactionId } = body;

    if (!email || !products || products.length === 0 || !total) {
      return NextResponse.json({ message: "Invalid order data" }, { status: 400 });
    }

    const db = await getDb();
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
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 });
  }
}
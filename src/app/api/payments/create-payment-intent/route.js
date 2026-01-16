import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";

export async function POST(req) {
  try {
    const body = await req.json();
    const { total, currency = "USD", email } = body;

    if (!total || !email) {
      return NextResponse.json(
        { message: "Total amount and email are required" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: currency.toLowerCase(),
      receipt_email: email,
      metadata: { integration_check: "accept_a_payment" },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error("Stripe Error:", error);
    return NextResponse.json(
      { message: "Payment initiation failed", error: error.message },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { appendToSheet } from "@/lib/googleSheets";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, location, referrerName, referrerPhone, referrerEmail } = body;

    if (!firstName || !lastName || !email || !phone || !location || !referrerName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    await appendToSheet([
      firstName,
      lastName,
      email,
      phone,
      location,
      referrerName,
      referrerPhone || "",
      referrerEmail || "",
      timestamp,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting to Google Sheets:", error);
    return NextResponse.json({ error: "Failed to submit form" }, { status: 500 });
  }
}

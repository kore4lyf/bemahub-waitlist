import { NextResponse } from "next/server";
import { getRegisteredUsers } from "@/lib/googleSheets";

export async function GET() {
  try {
    const users = await getRegisteredUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching waitlist data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

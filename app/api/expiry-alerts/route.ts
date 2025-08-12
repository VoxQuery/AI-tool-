import { NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET() {
  try {
    const settings = await db.getSettings()
    const itemsNearExpiry = await db.getItemsNearExpiry(settings.notificationDays)

    return NextResponse.json({
      items: itemsNearExpiry,
      count: itemsNearExpiry.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch expiry alerts" }, { status: 500 })
  }
}

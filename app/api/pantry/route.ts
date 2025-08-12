import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { predictExpiryDate } from "@/lib/expiry-predictor"

export async function GET() {
  try {
    const items = await db.getPantryItems()
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pantry items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category, quantity, unit, storage, notes } = body

    if (!name || !category || !quantity || !storage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const predictedExpiry = predictExpiryDate(category, storage)

    const item = await db.addPantryItem({
      name,
      category,
      quantity: Number.parseFloat(quantity),
      unit: unit || "each",
      storage,
      predictedExpiry,
      notes,
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create pantry item" }, { status: 500 })
  }
}

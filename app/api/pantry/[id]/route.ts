import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const item = await db.updatePantryItem(params.id, body)

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update pantry item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await db.deletePantryItem(params.id)

    if (!success) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Item deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete pantry item" }, { status: 500 })
  }
}

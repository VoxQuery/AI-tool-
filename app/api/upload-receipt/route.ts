import { type NextRequest, NextResponse } from "next/server"
import { extractTextFromImage, parseReceiptText } from "@/lib/ocr-parser"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("receipt") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Extract text from image using OCR
    const extractedText = await extractTextFromImage(file)

    // Parse the extracted text to get grocery items
    const parsedItems = await parseReceiptText(extractedText)

    return NextResponse.json({
      extractedText,
      parsedItems,
    })
  } catch (error) {
    console.error("Receipt processing error:", error)
    return NextResponse.json({ error: "Failed to process receipt" }, { status: 500 })
  }
}

import type { ParsedReceiptItem } from "@/types/pantry"
import { categorizeItem } from "./expiry-predictor"
import { receiptAnalyzer } from "./ai/receipt-analyzer"

// Mock OCR function - in a real app, you'd use pytesseract or similar
export async function parseReceiptText(text: string): Promise<ParsedReceiptItem[]> {
  // Simulate OCR processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Try AI analysis first
    const aiResults = await receiptAnalyzer.analyzeReceipt(text)

    if (aiResults.length > 0) {
      console.log("Using AI analysis results")
      return aiResults.map((item) => ({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
      }))
    }
  } catch (error) {
    console.log("AI analysis failed, falling back to rule-based parsing")
  }

  // Fallback to rule-based parsing
  const lines = text.split("\n").filter((line) => line.trim().length > 0)
  const items: ParsedReceiptItem[] = []

  for (const line of lines) {
    const item = parseReceiptLine(line)
    if (item) {
      items.push(item)
    }
  }

  return items
}

function parseReceiptLine(line: string): ParsedReceiptItem | null {
  // Simple regex patterns to extract items from receipt lines
  const patterns = [
    /^(.+?)\s+(\d+(?:\.\d+)?)\s*x?\s*(\w+)?\s*\$?\d+(?:\.\d+)?$/i,
    /^(.+?)\s+(\d+(?:\.\d+)?)\s*(lb|kg|oz|g|each|ea)?\s*$/i,
    /^(.+?)\s+\$?\d+(?:\.\d+)?$/i,
  ]

  for (const pattern of patterns) {
    const match = line.match(pattern)
    if (match) {
      const name = match[1].trim()
      const quantity = Number.parseFloat(match[2] || "1")
      const unit = match[3] || "each"

      // Skip if it looks like a total or non-food item
      if (
        name.toLowerCase().includes("total") ||
        name.toLowerCase().includes("tax") ||
        name.toLowerCase().includes("change") ||
        name.length < 3
      ) {
        continue
      }

      return {
        name,
        category: categorizeItem(name),
        quantity: isNaN(quantity) ? 1 : quantity,
        unit: unit.toLowerCase(),
      }
    }
  }

  return null
}

// Mock function to simulate OCR from image
export async function extractTextFromImage(file: File): Promise<string> {
  // Simulate OCR processing
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Return mock receipt text for demonstration
  return `GROCERY STORE RECEIPT
Milk 2% 1 gallon $3.99
Bread Whole Wheat $2.49
Chicken Breast 2.5 lb $8.99
Bananas 3 lb $1.99
Spinach Organic $3.49
Cheddar Cheese $4.99
Ground Beef 1 lb $5.99
Apples Gala 2 lb $3.99
Yogurt Greek 32oz $4.99
Carrots Baby 2 lb $2.99
TOTAL: $43.89`
}

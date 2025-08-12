export interface PantryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  storage: "fridge" | "freezer" | "pantry"
  predictedExpiry: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Recipe {
  id: string
  name: string
  description: string
  ingredients: string[]
  instructions: string[]
  prepTime: number
  cookTime: number
}

export interface ParsedReceiptItem {
  name: string
  category: string
  quantity: number
  unit: string
}

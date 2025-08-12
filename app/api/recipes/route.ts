import { NextResponse } from "next/server"
import type { Recipe } from "@/types/pantry"

// Mock recipe suggestions based on ingredients
const MOCK_RECIPES: Recipe[] = [
  {
    id: "1",
    name: "Quick Stir Fry",
    description: "Use up your vegetables before they expire",
    ingredients: ["vegetables", "oil", "soy sauce", "garlic"],
    instructions: ["Heat oil in pan", "Add vegetables", "Stir fry for 5 minutes", "Add sauce"],
    prepTime: 10,
    cookTime: 10,
  },
  {
    id: "2",
    name: "Smoothie Bowl",
    description: "Perfect for overripe fruits",
    ingredients: ["fruits", "yogurt", "honey", "granola"],
    instructions: ["Blend fruits with yogurt", "Pour into bowl", "Top with granola"],
    prepTime: 5,
    cookTime: 0,
  },
  {
    id: "3",
    name: "Soup Special",
    description: "Transform expiring vegetables into hearty soup",
    ingredients: ["vegetables", "broth", "herbs", "onion"],
    instructions: ["Sauté onion", "Add vegetables", "Pour broth", "Simmer 20 minutes"],
    prepTime: 15,
    cookTime: 25,
  },
]

export async function GET() {
  try {
    // In a real app, you'd match recipes to actual expiring ingredients
    return NextResponse.json(MOCK_RECIPES)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 })
  }
}

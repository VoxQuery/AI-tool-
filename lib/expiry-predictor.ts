// Expiry prediction based on product category and storage type
const EXPIRY_RULES: Record<string, Record<string, number>> = {
  dairy: {
    fridge: 7,
    freezer: 90,
    pantry: 1,
  },
  meat: {
    fridge: 3,
    freezer: 180,
    pantry: 1,
  },
  vegetables: {
    fridge: 10,
    freezer: 365,
    pantry: 3,
  },
  fruits: {
    fridge: 7,
    freezer: 365,
    pantry: 3,
  },
  bread: {
    fridge: 7,
    freezer: 90,
    pantry: 3,
  },
  canned: {
    fridge: 365,
    freezer: 365,
    pantry: 730,
  },
  frozen: {
    fridge: 1,
    freezer: 365,
    pantry: 1,
  },
  dry_goods: {
    fridge: 365,
    freezer: 365,
    pantry: 365,
  },
}

export function predictExpiryDate(category: string, storage: "fridge" | "freezer" | "pantry"): string {
  const categoryRules = EXPIRY_RULES[category.toLowerCase()] || EXPIRY_RULES.dry_goods
  const daysToExpiry = categoryRules[storage] || 7

  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + daysToExpiry)

  return expiryDate.toISOString().split("T")[0]
}

export function categorizeItem(itemName: string): string {
  const name = itemName.toLowerCase()

  if (name.includes("milk") || name.includes("cheese") || name.includes("yogurt") || name.includes("butter")) {
    return "dairy"
  }
  if (
    name.includes("chicken") ||
    name.includes("beef") ||
    name.includes("pork") ||
    name.includes("fish") ||
    name.includes("meat")
  ) {
    return "meat"
  }
  if (
    name.includes("lettuce") ||
    name.includes("spinach") ||
    name.includes("carrot") ||
    name.includes("broccoli") ||
    name.includes("tomato")
  ) {
    return "vegetables"
  }
  if (name.includes("apple") || name.includes("banana") || name.includes("orange") || name.includes("berry")) {
    return "fruits"
  }
  if (name.includes("bread") || name.includes("bagel") || name.includes("roll")) {
    return "bread"
  }
  if (name.includes("can") || name.includes("jar") || name.includes("bottle")) {
    return "canned"
  }
  if (name.includes("frozen")) {
    return "frozen"
  }

  return "dry_goods"
}

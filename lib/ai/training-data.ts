import type { TrainingData } from "./receipt-analyzer"

export const SAMPLE_TRAINING_DATA: TrainingData[] = [
  {
    text: `GROCERY STORE RECEIPT
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
TOTAL: $43.89`,
    items: [
      { name: "Milk 2%", category: "dairy", quantity: 1, unit: "gallon" },
      { name: "Bread Whole Wheat", category: "bread", quantity: 1, unit: "each" },
      { name: "Chicken Breast", category: "meat", quantity: 2.5, unit: "lb" },
      { name: "Bananas", category: "fruits", quantity: 3, unit: "lb" },
      { name: "Spinach Organic", category: "vegetables", quantity: 1, unit: "each" },
      { name: "Cheddar Cheese", category: "dairy", quantity: 1, unit: "each" },
      { name: "Ground Beef", category: "meat", quantity: 1, unit: "lb" },
      { name: "Apples Gala", category: "fruits", quantity: 2, unit: "lb" },
      { name: "Yogurt Greek", category: "dairy", quantity: 32, unit: "oz" },
      { name: "Carrots Baby", category: "vegetables", quantity: 2, unit: "lb" },
    ],
  },
  {
    text: `SUPERMARKET
Frozen Pizza $4.99
Ice Cream Vanilla 1.5qt $5.99
Orange Juice 64oz $3.49
Pasta Spaghetti $1.99
Tomato Sauce $2.49
Mozzarella Cheese $4.49
Bell Peppers 2lb $3.99
Mushrooms 8oz $2.99
SUBTOTAL: $30.42
TAX: $2.43
TOTAL: $32.85`,
    items: [
      { name: "Frozen Pizza", category: "frozen", quantity: 1, unit: "each" },
      { name: "Ice Cream Vanilla", category: "frozen", quantity: 1.5, unit: "qt" },
      { name: "Orange Juice", category: "beverages", quantity: 64, unit: "oz" },
      { name: "Pasta Spaghetti", category: "dry_goods", quantity: 1, unit: "each" },
      { name: "Tomato Sauce", category: "canned", quantity: 1, unit: "each" },
      { name: "Mozzarella Cheese", category: "dairy", quantity: 1, unit: "each" },
      { name: "Bell Peppers", category: "vegetables", quantity: 2, unit: "lb" },
      { name: "Mushrooms", category: "vegetables", quantity: 8, unit: "oz" },
    ],
  },
  {
    text: `FRESH MARKET
Salmon Fillet 1.2lb $12.99
Broccoli Crown 2ea $3.99
Sweet Potatoes 3lb $4.99
Avocados 4ea $5.99
Strawberries 1lb $4.99
Blueberries 6oz $3.99
Whole Milk Gallon $3.79
Eggs Large Dozen $2.99
Butter Unsalted $4.49
Rice Jasmine 5lb $8.99
TOTAL: $57.19`,
    items: [
      { name: "Salmon Fillet", category: "meat", quantity: 1.2, unit: "lb" },
      { name: "Broccoli Crown", category: "vegetables", quantity: 2, unit: "each" },
      { name: "Sweet Potatoes", category: "vegetables", quantity: 3, unit: "lb" },
      { name: "Avocados", category: "fruits", quantity: 4, unit: "each" },
      { name: "Strawberries", category: "fruits", quantity: 1, unit: "lb" },
      { name: "Blueberries", category: "fruits", quantity: 6, unit: "oz" },
      { name: "Whole Milk", category: "dairy", quantity: 1, unit: "gallon" },
      { name: "Eggs Large", category: "dairy", quantity: 1, unit: "dozen" },
      { name: "Butter Unsalted", category: "dairy", quantity: 1, unit: "each" },
      { name: "Rice Jasmine", category: "dry_goods", quantity: 5, unit: "lb" },
    ],
  },
  {
    text: `ORGANIC FOODS
Quinoa 2lb $9.99
Almond Milk 32oz $3.99
Kale Organic 1bunch $2.99
Chickpeas Canned 2cans $3.98
Olive Oil Extra Virgin $7.99
Honey Raw 12oz $8.99
Almonds Raw 1lb $9.99
Greek Yogurt Plain 32oz $5.99
Spinach Baby 5oz $3.99
Lentils Red 1lb $2.99
TOTAL: $60.89`,
    items: [
      { name: "Quinoa", category: "dry_goods", quantity: 2, unit: "lb" },
      { name: "Almond Milk", category: "dairy", quantity: 32, unit: "oz" },
      { name: "Kale Organic", category: "vegetables", quantity: 1, unit: "bunch" },
      { name: "Chickpeas Canned", category: "canned", quantity: 2, unit: "cans" },
      { name: "Olive Oil Extra Virgin", category: "dry_goods", quantity: 1, unit: "each" },
      { name: "Honey Raw", category: "dry_goods", quantity: 12, unit: "oz" },
      { name: "Almonds Raw", category: "dry_goods", quantity: 1, unit: "lb" },
      { name: "Greek Yogurt Plain", category: "dairy", quantity: 32, unit: "oz" },
      { name: "Spinach Baby", category: "vegetables", quantity: 5, unit: "oz" },
      { name: "Lentils Red", category: "dry_goods", quantity: 1, unit: "lb" },
    ],
  },
]

export const generateSyntheticData = (count: number): TrainingData[] => {
  const items = [
    { name: "Milk", category: "dairy", units: ["gallon", "qt", "pt"] },
    { name: "Bread", category: "bread", units: ["each", "loaf"] },
    { name: "Chicken", category: "meat", units: ["lb", "kg"] },
    { name: "Bananas", category: "fruits", units: ["lb", "bunch"] },
    { name: "Lettuce", category: "vegetables", units: ["head", "each"] },
    { name: "Cheese", category: "dairy", units: ["lb", "oz"] },
    { name: "Ground Beef", category: "meat", units: ["lb", "kg"] },
    { name: "Apples", category: "fruits", units: ["lb", "bag"] },
    { name: "Yogurt", category: "dairy", units: ["oz", "cup"] },
    { name: "Carrots", category: "vegetables", units: ["lb", "bag"] },
  ]

  const syntheticData: TrainingData[] = []

  for (let i = 0; i < count; i++) {
    const receiptItems = []
    const textLines = ["GROCERY RECEIPT"]

    const numItems = Math.floor(Math.random() * 8) + 3 // 3-10 items

    for (let j = 0; j < numItems; j++) {
      const item = items[Math.floor(Math.random() * items.length)]
      const quantity = (Math.random() * 5 + 0.5).toFixed(1)
      const unit = item.units[Math.floor(Math.random() * item.units.length)]
      const price = (Math.random() * 15 + 1).toFixed(2)

      receiptItems.push({
        name: item.name,
        category: item.category,
        quantity: Number.parseFloat(quantity),
        unit,
      })

      textLines.push(`${item.name} ${quantity} ${unit} $${price}`)
    }

    const total = (Math.random() * 100 + 20).toFixed(2)
    textLines.push(`TOTAL: $${total}`)

    syntheticData.push({
      text: textLines.join("\n"),
      items: receiptItems,
    })
  }

  return syntheticData
}

import * as tf from "@tensorflow/tfjs"

export interface TrainingData {
  text: string
  items: Array<{
    name: string
    category: string
    quantity: number
    unit: string
    price?: number
  }>
}

export class ReceiptAnalyzer {
  private model: tf.LayersModel | null = null
  private tokenizer: Map<string, number> = new Map()
  private categoryEncoder: Map<string, number> = new Map()
  private isTraining = false

  constructor() {
    this.initializeEncoders()
  }

  private initializeEncoders() {
    // Initialize category encoder
    const categories = [
      "dairy",
      "meat",
      "vegetables",
      "fruits",
      "bread",
      "canned",
      "frozen",
      "dry_goods",
      "beverages",
      "snacks",
    ]
    categories.forEach((cat, idx) => {
      this.categoryEncoder.set(cat, idx)
    })
  }

  // Preprocess text for training
  private preprocessText(text: string): number[] {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 0)

    // Build vocabulary if not exists
    words.forEach((word) => {
      if (!this.tokenizer.has(word)) {
        this.tokenizer.set(word, this.tokenizer.size)
      }
    })

    // Convert to token IDs
    return words.map((word) => this.tokenizer.get(word) || 0)
  }

  // Create training model
  private createModel(vocabSize: number, maxLength: number): tf.LayersModel {
    const model = tf.sequential({
      layers: [
        tf.layers.embedding({
          inputDim: vocabSize,
          outputDim: 128,
          inputLength: maxLength,
        }),
        tf.layers.lstm({
          units: 64,
          returnSequences: true,
        }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.lstm({
          units: 32,
        }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({
          units: 64,
          activation: "relu",
        }),
        tf.layers.dense({
          units: this.categoryEncoder.size,
          activation: "softmax",
        }),
      ],
    })

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    })

    return model
  }

  // Train the model with receipt data
  async trainModel(trainingData: TrainingData[]): Promise<void> {
    if (this.isTraining) {
      throw new Error("Model is already training")
    }

    this.isTraining = true

    try {
      console.log("Starting model training...")

      // Preprocess training data
      const processedData = trainingData.map((data) => ({
        text: this.preprocessText(data.text),
        items: data.items,
      }))

      const maxLength = Math.max(...processedData.map((d) => d.text.length))
      const vocabSize = this.tokenizer.size

      // Pad sequences
      const paddedTexts = processedData.map((d) => {
        const padded = [...d.text]
        while (padded.length < maxLength) {
          padded.push(0)
        }
        return padded.slice(0, maxLength)
      })

      // Create labels (simplified - predicting primary category)
      const labels = processedData.map((d) => {
        const primaryCategory = d.items[0]?.category || "dry_goods"
        const categoryIndex = this.categoryEncoder.get(primaryCategory) || 0
        const oneHot = new Array(this.categoryEncoder.size).fill(0)
        oneHot[categoryIndex] = 1
        return oneHot
      })

      // Convert to tensors
      const xs = tf.tensor2d(paddedTexts)
      const ys = tf.tensor2d(labels)

      // Create and train model
      this.model = this.createModel(vocabSize, maxLength)

      const history = await this.model.fit(xs, ys, {
        epochs: 50,
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss?.toFixed(4)}, accuracy = ${logs?.acc?.toFixed(4)}`)
          },
        },
      })

      console.log("Model training completed!")

      // Clean up tensors
      xs.dispose()
      ys.dispose()
    } finally {
      this.isTraining = false
    }
  }

  // Analyze receipt text using trained model
  async analyzeReceipt(receiptText: string): Promise<
    Array<{
      name: string
      category: string
      quantity: number
      unit: string
      confidence: number
    }>
  > {
    if (!this.model) {
      // Fallback to rule-based analysis if model not trained
      return this.fallbackAnalysis(receiptText)
    }

    try {
      const processedText = this.preprocessText(receiptText)
      const maxLength = 100 // Use fixed length for inference

      // Pad sequence
      const padded = [...processedText]
      while (padded.length < maxLength) {
        padded.push(0)
      }
      const input = tf.tensor2d([padded.slice(0, maxLength)])

      // Get prediction
      const prediction = this.model.predict(input) as tf.Tensor
      const probabilities = await prediction.data()

      // Find predicted category
      const maxProb = Math.max(...Array.from(probabilities))
      const predictedCategoryIndex = Array.from(probabilities).indexOf(maxProb)
      const predictedCategory = Array.from(this.categoryEncoder.keys())[predictedCategoryIndex]

      // Clean up tensors
      input.dispose()
      prediction.dispose()

      // Extract items using NLP + ML prediction
      return this.extractItemsWithML(receiptText, predictedCategory, maxProb)
    } catch (error) {
      console.error("Error in ML analysis:", error)
      return this.fallbackAnalysis(receiptText)
    }
  }

  private extractItemsWithML(
    text: string,
    predictedCategory: string,
    confidence: number,
  ): Array<{
    name: string
    category: string
    quantity: number
    unit: string
    confidence: number
  }> {
    const lines = text.split("\n").filter((line) => line.trim().length > 0)
    const items: Array<{
      name: string
      category: string
      quantity: number
      unit: string
      confidence: number
    }> = []

    for (const line of lines) {
      const item = this.parseLineWithML(line, predictedCategory, confidence)
      if (item) {
        items.push(item)
      }
    }

    return items
  }

  private parseLineWithML(
    line: string,
    defaultCategory: string,
    baseConfidence: number,
  ): {
    name: string
    category: string
    quantity: number
    unit: string
    confidence: number
  } | null {
    // Enhanced parsing with ML insights
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

        // Skip non-food items
        if (this.isNonFoodItem(name)) {
          continue
        }

        // Use ML prediction for category with confidence adjustment
        const category = this.categorizeName(name) || defaultCategory
        const confidence = category === defaultCategory ? baseConfidence : baseConfidence * 0.8

        return {
          name,
          category,
          quantity: isNaN(quantity) ? 1 : quantity,
          unit: unit.toLowerCase(),
          confidence,
        }
      }
    }

    return null
  }

  private fallbackAnalysis(receiptText: string): Array<{
    name: string
    category: string
    quantity: number
    unit: string
    confidence: number
  }> {
    // Enhanced rule-based fallback
    const lines = receiptText.split("\n").filter((line) => line.trim().length > 0)
    const items: Array<{
      name: string
      category: string
      quantity: number
      unit: string
      confidence: number
    }> = []

    for (const line of lines) {
      const item = this.parseLineFallback(line)
      if (item) {
        items.push(item)
      }
    }

    return items
  }

  private parseLineFallback(line: string): {
    name: string
    category: string
    quantity: number
    unit: string
    confidence: number
  } | null {
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

        if (this.isNonFoodItem(name)) {
          continue
        }

        return {
          name,
          category: this.categorizeName(name) || "dry_goods",
          quantity: isNaN(quantity) ? 1 : quantity,
          unit: unit.toLowerCase(),
          confidence: 0.7, // Lower confidence for rule-based
        }
      }
    }

    return null
  }

  private isNonFoodItem(name: string): boolean {
    const nonFoodKeywords = [
      "total",
      "tax",
      "change",
      "receipt",
      "store",
      "cashier",
      "bag",
      "bottle deposit",
      "coupon",
      "discount",
    ]

    return nonFoodKeywords.some((keyword) => name.toLowerCase().includes(keyword.toLowerCase()))
  }

  private categorizeName(name: string): string | null {
    const categoryKeywords = {
      dairy: ["milk", "cheese", "yogurt", "butter", "cream"],
      meat: ["chicken", "beef", "pork", "fish", "turkey", "ham"],
      vegetables: ["lettuce", "spinach", "carrot", "broccoli", "tomato", "onion"],
      fruits: ["apple", "banana", "orange", "berry", "grape", "lemon"],
      bread: ["bread", "bagel", "roll", "bun"],
      frozen: ["frozen"],
      beverages: ["juice", "soda", "water", "coffee", "tea"],
    }

    const lowerName = name.toLowerCase()

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((keyword) => lowerName.includes(keyword))) {
        return category
      }
    }

    return null
  }

  // Save trained model
  async saveModel(name = "receipt-analyzer"): Promise<void> {
    if (!this.model) {
      throw new Error("No model to save")
    }

    await this.model.save(`localstorage://${name}`)

    // Save tokenizer and encoders
    localStorage.setItem(`${name}-tokenizer`, JSON.stringify(Array.from(this.tokenizer.entries())))
    localStorage.setItem(`${name}-categories`, JSON.stringify(Array.from(this.categoryEncoder.entries())))
  }

  // Load trained model
  async loadModel(name = "receipt-analyzer"): Promise<void> {
    try {
      this.model = await tf.loadLayersModel(`localstorage://${name}`)

      // Load tokenizer and encoders
      const tokenizerData = localStorage.getItem(`${name}-tokenizer`)
      const categoriesData = localStorage.getItem(`${name}-categories`)

      if (tokenizerData) {
        this.tokenizer = new Map(JSON.parse(tokenizerData))
      }

      if (categoriesData) {
        this.categoryEncoder = new Map(JSON.parse(categoriesData))
      }

      console.log("Model loaded successfully")
    } catch (error) {
      console.log("No saved model found, using rule-based analysis")
    }
  }
}

// Export singleton instance
export const receiptAnalyzer = new ReceiptAnalyzer()

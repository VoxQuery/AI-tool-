import type { PantryItem } from "@/types/pantry"

// In a real application, you would use a proper database
// For this demo, we'll use localStorage with fallback to memory storage
class DatabaseService {
  private storageKey = "voxquery-pantry"
  private settingsKey = "voxquery-settings"

  // Pantry Items
  async getPantryItems(): Promise<PantryItem[]> {
    if (typeof window === "undefined") return []

    try {
      const items = localStorage.getItem(this.storageKey)
      return items ? JSON.parse(items) : []
    } catch {
      return []
    }
  }

  async addPantryItem(item: Omit<PantryItem, "id">): Promise<PantryItem> {
    const items = await this.getPantryItems()
    const newItem: PantryItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    items.push(newItem)
    this.savePantryItems(items)
    return newItem
  }

  async updatePantryItem(id: string, updates: Partial<PantryItem>): Promise<PantryItem | null> {
    const items = await this.getPantryItems()
    const index = items.findIndex((item) => item.id === id)

    if (index === -1) return null

    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() }
    this.savePantryItems(items)
    return items[index]
  }

  async deletePantryItem(id: string): Promise<boolean> {
    const items = await this.getPantryItems()
    const filteredItems = items.filter((item) => item.id !== id)

    if (filteredItems.length === items.length) return false

    this.savePantryItems(filteredItems)
    return true
  }

  async getItemsNearExpiry(days = 3): Promise<PantryItem[]> {
    const items = await this.getPantryItems()
    const now = new Date()
    const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

    return items.filter((item) => {
      const expiryDate = new Date(item.predictedExpiry)
      return expiryDate <= threshold && expiryDate >= now
    })
  }

  // Settings
  async getSettings() {
    if (typeof window === "undefined") return { email: "", notificationDays: 3 }

    try {
      const settings = localStorage.getItem(this.settingsKey)
      return settings ? JSON.parse(settings) : { email: "", notificationDays: 3 }
    } catch {
      return { email: "", notificationDays: 3 }
    }
  }

  async updateSettings(settings: { email?: string; notificationDays?: number }) {
    if (typeof window === "undefined") return

    const currentSettings = await this.getSettings()
    const newSettings = { ...currentSettings, ...settings }
    localStorage.setItem(this.settingsKey, JSON.stringify(newSettings))
  }

  private savePantryItems(items: PantryItem[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(this.storageKey, JSON.stringify(items))
  }
}

export const db = new DatabaseService()

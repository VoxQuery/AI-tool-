"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { PantryItem } from "@/types/pantry"
import { Search, Plus, Edit, Trash2, AlertTriangle, Package, Refrigerator, Snowflake } from "lucide-react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function PantryPage() {
  const [items, setItems] = useState<PantryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<PantryItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStorage, setFilterStorage] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const { toast } = useToast()

  const [newItem, setNewItem] = useState({
    name: "",
    category: "dry_goods",
    quantity: 1,
    unit: "each",
    storage: "pantry" as "fridge" | "freezer" | "pantry",
    notes: "",
  })

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [items, searchTerm, filterCategory, filterStorage])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/pantry")
      const data = await response.json()
      setItems(data)
    } catch (error) {
      toast({
        title: "Error fetching items",
        description: "Failed to load pantry items",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = items

    if (searchTerm) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((item) => item.category === filterCategory)
    }

    if (filterStorage !== "all") {
      filtered = filtered.filter((item) => item.storage === filterStorage)
    }

    // Sort by expiry date (soonest first)
    filtered.sort((a, b) => new Date(a.predictedExpiry).getTime() - new Date(b.predictedExpiry).getTime())

    setFilteredItems(filtered)
  }

  const addItem = async () => {
    try {
      const response = await fetch("/api/pantry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      })

      if (!response.ok) throw new Error("Failed to add item")

      const item = await response.json()
      setItems((prev) => [...prev, item])
      setNewItem({
        name: "",
        category: "dry_goods",
        quantity: 1,
        unit: "each",
        storage: "pantry",
        notes: "",
      })
      setIsAddingNew(false)

      toast({
        title: "Item added successfully!",
        description: `${item.name} has been added to your pantry`,
      })
    } catch (error) {
      toast({
        title: "Error adding item",
        description: "Failed to add item to pantry",
        variant: "destructive",
      })
    }
  }

  const updateItem = async (id: string, updates: Partial<PantryItem>) => {
    try {
      const response = await fetch(`/api/pantry/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error("Failed to update item")

      const updatedItem = await response.json()
      setItems((prev) => prev.map((item) => (item.id === id ? updatedItem : item)))
      setEditingItem(null)

      toast({
        title: "Item updated successfully!",
        description: `${updatedItem.name} has been updated`,
      })
    } catch (error) {
      toast({
        title: "Error updating item",
        description: "Failed to update item",
        variant: "destructive",
      })
    }
  }

  const deleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/pantry/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete item")

      setItems((prev) => prev.filter((item) => item.id !== id))

      toast({
        title: "Item deleted successfully!",
        description: "Item has been removed from your pantry",
      })
    } catch (error) {
      toast({
        title: "Error deleting item",
        description: "Failed to delete item",
        variant: "destructive",
      })
    }
  }

  const getExpiryStatus = (expiryDate: string) => {
    const now = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) {
      return { status: "expired", color: "destructive", text: "Expired" }
    } else if (daysUntilExpiry <= 3) {
      return {
        status: "expiring",
        color: "destructive",
        text: `${daysUntilExpiry} day${daysUntilExpiry === 1 ? "" : "s"} left`,
      }
    } else if (daysUntilExpiry <= 7) {
      return { status: "warning", color: "secondary", text: `${daysUntilExpiry} days left` }
    } else {
      return { status: "good", color: "default", text: `${daysUntilExpiry} days left` }
    }
  }

  const getStorageIcon = (storage: string) => {
    switch (storage) {
      case "fridge":
        return <Refrigerator className="h-4 w-4" />
      case "freezer":
        return <Snowflake className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Pantry</h1>
            <p className="text-muted-foreground">
              {items.length} items •{" "}
              {filteredItems.filter((item) => getExpiryStatus(item.predictedExpiry).status === "expiring").length}{" "}
              expiring soon
            </p>
          </div>

          <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Item</DialogTitle>
                <DialogDescription>Add a new item to your pantry manually</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Item name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) => setNewItem((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dairy">Dairy</SelectItem>
                        <SelectItem value="meat">Meat</SelectItem>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="fruits">Fruits</SelectItem>
                        <SelectItem value="bread">Bread</SelectItem>
                        <SelectItem value="canned">Canned</SelectItem>
                        <SelectItem value="frozen">Frozen</SelectItem>
                        <SelectItem value="dry_goods">Dry Goods</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="storage">Storage</Label>
                    <Select
                      value={newItem.storage}
                      onValueChange={(value: "fridge" | "freezer" | "pantry") =>
                        setNewItem((prev) => ({ ...prev, storage: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fridge">Fridge</SelectItem>
                        <SelectItem value="freezer">Freezer</SelectItem>
                        <SelectItem value="pantry">Pantry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem((prev) => ({ ...prev, quantity: Number.parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={newItem.unit}
                      onValueChange={(value) => setNewItem((prev) => ({ ...prev, unit: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="each">Each</SelectItem>
                        <SelectItem value="lb">Pounds</SelectItem>
                        <SelectItem value="kg">Kilograms</SelectItem>
                        <SelectItem value="oz">Ounces</SelectItem>
                        <SelectItem value="g">Grams</SelectItem>
                        <SelectItem value="gallon">Gallon</SelectItem>
                        <SelectItem value="liter">Liter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={newItem.notes}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about this item"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                  Cancel
                </Button>
                <Button onClick={addItem} disabled={!newItem.name}>
                  Add Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category-filter">Category</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="meat">Meat</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="bread">Bread</SelectItem>
                    <SelectItem value="canned">Canned</SelectItem>
                    <SelectItem value="frozen">Frozen</SelectItem>
                    <SelectItem value="dry_goods">Dry Goods</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="storage-filter">Storage</Label>
                <Select value={filterStorage} onValueChange={setFilterStorage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Storage</SelectItem>
                    <SelectItem value="fridge">Fridge</SelectItem>
                    <SelectItem value="freezer">Freezer</SelectItem>
                    <SelectItem value="pantry">Pantry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No items found</h3>
              <p className="text-muted-foreground mb-4">
                {items.length === 0
                  ? "Your pantry is empty. Add some items to get started!"
                  : "No items match your current filters."}
              </p>
              {items.length === 0 && (
                <Button onClick={() => setIsAddingNew(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Item
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const expiryStatus = getExpiryStatus(item.predictedExpiry)
              return (
                <Card key={item.id} className="animate-fade-in">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription className="flex items-center space-x-2 mt-1">
                          {getStorageIcon(item.storage)}
                          <span className="capitalize">{item.storage}</span>
                          <span>•</span>
                          <span className="capitalize">{item.category.replace("_", " ")}</span>
                        </CardDescription>
                      </div>
                      <Badge variant={expiryStatus.color as any}>
                        {expiryStatus.status === "expiring" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {expiryStatus.text}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span>
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Expires:</span>
                        <span>{new Date(item.predictedExpiry).toLocaleDateString()}</span>
                      </div>
                      {item.notes && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Notes:</span>
                          <p className="mt-1 text-xs bg-muted p-2 rounded">{item.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Item</DialogTitle>
                            <DialogDescription>Update the details of this pantry item</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div>
                              <Label htmlFor="edit-name">Name</Label>
                              <Input
                                id="edit-name"
                                defaultValue={item.name}
                                onChange={(e) =>
                                  setEditingItem((prev) => (prev ? { ...prev, name: e.target.value } : null))
                                }
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="edit-quantity">Quantity</Label>
                                <Input
                                  id="edit-quantity"
                                  type="number"
                                  step="0.1"
                                  defaultValue={item.quantity}
                                  onChange={(e) =>
                                    setEditingItem((prev) =>
                                      prev ? { ...prev, quantity: Number.parseFloat(e.target.value) } : null,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-expiry">Expiry Date</Label>
                                <Input
                                  id="edit-expiry"
                                  type="date"
                                  defaultValue={item.predictedExpiry}
                                  onChange={(e) =>
                                    setEditingItem((prev) =>
                                      prev ? { ...prev, predictedExpiry: e.target.value } : null,
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="edit-notes">Notes</Label>
                              <Textarea
                                id="edit-notes"
                                defaultValue={item.notes}
                                onChange={(e) =>
                                  setEditingItem((prev) => (prev ? { ...prev, notes: e.target.value } : null))
                                }
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingItem(null)}>
                              Cancel
                            </Button>
                            <Button onClick={() => updateItem(item.id, editingItem || {})}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

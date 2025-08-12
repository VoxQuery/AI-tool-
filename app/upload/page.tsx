"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { ParsedReceiptItem } from "@/types/pantry"
import { Upload, FileText, Loader2, Plus, Trash2 } from "lucide-react"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { AITrainer } from "@/components/ai-trainer"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedItems, setParsedItems] = useState<ParsedReceiptItem[]>([])
  const [storage, setStorage] = useState<"fridge" | "freezer" | "pantry">("fridge")
  const [isAddingToPantry, setIsAddingToPantry] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleFileUpload = useCallback(
    async (uploadedFile: File) => {
      setFile(uploadedFile)
      setIsProcessing(true)

      try {
        const formData = new FormData()
        formData.append("receipt", uploadedFile)

        const response = await fetch("/api/upload-receipt", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to process receipt")
        }

        const data = await response.json()
        setParsedItems(data.parsedItems)

        toast({
          title: "Receipt processed successfully!",
          description: `Found ${data.parsedItems.length} items`,
        })
      } catch (error) {
        toast({
          title: "Error processing receipt",
          description: "Please try again or add items manually",
          variant: "destructive",
        })
      } finally {
        setIsProcessing(false)
      }
    },
    [toast],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile && (droppedFile.type.startsWith("image/") || droppedFile.type === "application/pdf")) {
        handleFileUpload(droppedFile)
      }
    },
    [handleFileUpload],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileUpload(selectedFile)
    }
  }

  const updateItem = (index: number, field: keyof ParsedReceiptItem, value: string | number) => {
    setParsedItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const removeItem = (index: number) => {
    setParsedItems((prev) => prev.filter((_, i) => i !== index))
  }

  const addToPantry = async () => {
    if (parsedItems.length === 0) return

    setIsAddingToPantry(true)

    try {
      const promises = parsedItems.map((item) =>
        fetch("/api/pantry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...item, storage }),
        }),
      )

      await Promise.all(promises)

      toast({
        title: "Items added to pantry!",
        description: `Successfully added ${parsedItems.length} items`,
      })

      router.push("/pantry")
    } catch (error) {
      toast({
        title: "Error adding items",
        description: "Some items may not have been added",
        variant: "destructive",
      })
    } finally {
      setIsAddingToPantry(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Receipt</h1>
          <p className="text-muted-foreground">
            Upload a photo or PDF of your grocery receipt to automatically extract items
          </p>
        </div>

        {/* Upload Area */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Receipt Upload</CardTitle>
            <CardDescription>Drag and drop your receipt or click to browse</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-lg font-medium">Processing receipt...</p>
                  <p className="text-sm text-muted-foreground">Extracting text and identifying grocery items</p>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center space-y-4">
                  <FileText className="h-12 w-12 text-primary" />
                  <p className="text-lg font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">File uploaded successfully</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <p className="text-lg font-medium">Drop your receipt here</p>
                  <p className="text-sm text-muted-foreground">Supports JPG, PNG, and PDF files</p>
                </div>
              )}
            </div>

            <input id="file-input" type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
          </CardContent>
        </Card>

        {/* AI Training Section */}
        <AITrainer />

        {/* Parsed Items */}
        {parsedItems.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Extracted Items ({parsedItems.length})</CardTitle>
                  <CardDescription>Review and edit the items before adding to your pantry</CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="storage">Storage:</Label>
                    <Select
                      value={storage}
                      onValueChange={(value: "fridge" | "freezer" | "pantry") => setStorage(value)}
                    >
                      <SelectTrigger className="w-32">
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
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parsedItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label htmlFor={`name-${index}`}>Name</Label>
                      <Input
                        id={`name-${index}`}
                        value={item.name}
                        onChange={(e) => updateItem(index, "name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`category-${index}`}>Category</Label>
                      <Select value={item.category} onValueChange={(value) => updateItem(index, "category", value)}>
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
                      <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        step="0.1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", Number.parseFloat(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`unit-${index}`}>Unit</Label>
                      <Select value={item.unit} onValueChange={(value) => updateItem(index, "unit", value)}>
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
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outline" onClick={() => setParsedItems([])}>
                  Clear All
                </Button>
                <Button onClick={addToPantry} disabled={isAddingToPantry}>
                  {isAddingToPantry ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add to Pantry
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

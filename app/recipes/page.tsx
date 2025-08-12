"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Recipe, PantryItem } from "@/types/pantry"
import { ChefHat, Clock, Users, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [expiringItems, setExpiringItems] = useState<PantryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [recipesResponse, alertsResponse] = await Promise.all([fetch("/api/recipes"), fetch("/api/expiry-alerts")])

      const recipesData = await recipesResponse.json()
      const alertsData = await alertsResponse.json()

      setRecipes(recipesData)
      setExpiringItems(alertsData.items)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
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
                <div key={i} className="h-64 bg-muted rounded"></div>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Recipe Suggestions</h1>
          <p className="text-muted-foreground">Discover recipes to use up ingredients before they expire</p>
        </div>

        {/* Expiring Items Alert */}
        {expiringItems.length > 0 && (
          <Card className="mb-8 border-destructive/20 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">Items Expiring Soon</CardTitle>
              </div>
              <CardDescription>Use these ingredients in your recipes before they expire</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {expiringItems.map((item) => (
                  <Badge key={item.id} variant="destructive">
                    {item.name} -{" "}
                    {Math.ceil(
                      (new Date(item.predictedExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="animate-fade-in hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{recipe.name}</CardTitle>
                    <CardDescription>{recipe.description}</CardDescription>
                  </div>
                  <ChefHat className="h-6 w-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Recipe Stats */}
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{recipe.prepTime + recipe.cookTime} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>2-4 servings</span>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <h4 className="font-medium mb-2">Ingredients:</h4>
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients.map((ingredient, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Instructions Preview */}
                  <div>
                    <h4 className="font-medium mb-2">Instructions:</h4>
                    <ol className="text-sm text-muted-foreground space-y-1">
                      {recipe.instructions.slice(0, 3).map((instruction, index) => (
                        <li key={index} className="flex">
                          <span className="mr-2 font-medium">{index + 1}.</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                      {recipe.instructions.length > 3 && (
                        <li className="text-xs italic">+{recipe.instructions.length - 3} more steps...</li>
                      )}
                    </ol>
                  </div>

                  {/* Time Breakdown */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary">{recipe.prepTime}m</div>
                      <div className="text-xs text-muted-foreground">Prep Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary">{recipe.cookTime}m</div>
                      <div className="text-xs text-muted-foreground">Cook Time</div>
                    </div>
                  </div>

                  <Button className="w-full mt-4">
                    <ChefHat className="mr-2 h-4 w-4" />
                    Start Cooking
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {recipes.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No recipes available</h3>
              <p className="text-muted-foreground">
                Add some items to your pantry to get personalized recipe suggestions!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

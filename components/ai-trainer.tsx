"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { receiptAnalyzer } from "@/lib/ai/receipt-analyzer"
import { SAMPLE_TRAINING_DATA, generateSyntheticData } from "@/lib/ai/training-data"
import { Brain, Play, Save, Upload } from "lucide-react"

export function AITrainer() {
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [modelStatus, setModelStatus] = useState<"untrained" | "training" | "trained">("untrained")
  const { toast } = useToast()

  const startTraining = async () => {
    setIsTraining(true)
    setTrainingProgress(0)
    setModelStatus("training")

    try {
      // Combine sample data with synthetic data
      const syntheticData = generateSyntheticData(50)
      const allTrainingData = [...SAMPLE_TRAINING_DATA, ...syntheticData]

      toast({
        title: "Training Started",
        description: `Training with ${allTrainingData.length} receipt samples`,
      })

      // Simulate training progress
      const progressInterval = setInterval(() => {
        setTrainingProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + Math.random() * 5
        })
      }, 1000)

      await receiptAnalyzer.trainModel(allTrainingData)

      clearInterval(progressInterval)
      setTrainingProgress(100)
      setModelStatus("trained")

      toast({
        title: "Training Complete!",
        description: "AI model is now ready for receipt analysis",
      })
    } catch (error) {
      console.error("Training error:", error)
      setModelStatus("untrained")
      toast({
        title: "Training Failed",
        description: "There was an error training the model",
        variant: "destructive",
      })
    } finally {
      setIsTraining(false)
    }
  }

  const saveModel = async () => {
    try {
      await receiptAnalyzer.saveModel()
      toast({
        title: "Model Saved",
        description: "AI model has been saved to browser storage",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Could not save the model",
        variant: "destructive",
      })
    }
  }

  const loadModel = async () => {
    try {
      await receiptAnalyzer.loadModel()
      setModelStatus("trained")
      toast({
        title: "Model Loaded",
        description: "AI model has been loaded from storage",
      })
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Could not load the saved model",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="professional-card hover-lift">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
            <Brain className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-professional">AI Model Training</CardTitle>
        </div>
        <CardDescription className="text-professional-muted">
          Train the AI model to better analyze grocery receipts and extract item information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-professional">Model Status</p>
            <Badge
              variant={modelStatus === "trained" ? "default" : modelStatus === "training" ? "secondary" : "outline"}
              className={
                modelStatus === "trained"
                  ? "bg-green-100 text-green-800"
                  : modelStatus === "training"
                    ? "bg-blue-100 text-blue-800"
                    : ""
              }
            >
              {modelStatus === "trained" ? "Trained" : modelStatus === "training" ? "Training..." : "Not Trained"}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-sm text-professional-muted">Training Data</p>
            <p className="font-medium text-professional">{SAMPLE_TRAINING_DATA.length + 50} samples</p>
          </div>
        </div>

        {isTraining && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-professional">Training Progress</span>
              <span className="text-blue-600">{Math.round(trainingProgress)}%</span>
            </div>
            <Progress value={trainingProgress} className="w-full h-3" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Button onClick={startTraining} disabled={isTraining} className="professional-btn text-white border-0">
            <Play className="mr-2 h-4 w-4" />
            {isTraining ? "Training..." : "Start Training"}
          </Button>

          <Button
            onClick={saveModel}
            disabled={modelStatus !== "trained"}
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Model
          </Button>

          <Button
            onClick={loadModel}
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
          >
            <Upload className="mr-2 h-4 w-4" />
            Load Model
          </Button>
        </div>

        <div className="text-xs text-professional-muted space-y-1">
          <p>• The AI model learns to identify food items, categories, and quantities from receipt text</p>
          <p>• Training uses both real receipt samples and synthetic data for better accuracy</p>
          <p>• Model is saved locally in your browser for future use</p>
        </div>
      </CardContent>
    </Card>
  )
}

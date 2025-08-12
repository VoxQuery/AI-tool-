"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Upload, Package, ChefHat, Bell, Smartphone, Zap, ArrowRight, CheckCircle, Sparkles, Leaf } from "lucide-react"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [expiringCount, setExpiringCount] = useState(0)

  useEffect(() => {
    // Fetch expiry alerts count
    fetch("/api/expiry-alerts")
      .then((res) => res.json())
      .then((data) => setExpiringCount(data.count))
      .catch(console.error)

    // Add scroll reveal effect
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed")
        }
      })
    }, observerOptions)

    document.querySelectorAll(".scroll-reveal").forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center fade-in">
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Leaf className="w-4 h-4 mr-2 text-green-600" />
              Reduce Food Waste by 40%
            </Badge>

            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8 text-professional">
              <span className="text-blue-600">VoxQuery</span>
              <br />
              <span className="text-3xl sm:text-5xl text-professional-muted">Digital Food Waste Tracker</span>
            </h1>

            <p className="text-xl sm:text-2xl text-professional-muted mb-12 max-w-4xl mx-auto leading-relaxed">
              Minimize food waste with our AI-powered system that tracks groceries, predicts expiry dates, sends smart
              alerts, and suggests delicious recipes.
            </p>

            {expiringCount > 0 && (
              <div className="mb-12 p-6 professional-card max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-3 text-orange-600">
                  <Bell className="h-6 w-6" />
                  <span className="font-semibold text-lg">
                    {expiringCount} item{expiringCount > 1 ? "s" : ""} expiring soon!
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/upload">
                <Button size="lg" className="professional-btn text-white border-0 px-8 py-4 text-lg">
                  <Upload className="mr-3 h-6 w-6" />
                  Upload Receipt
                  <Sparkles className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pantry">
                <Button
                  variant="outline"
                  size="lg"
                  className="hover-lift px-8 py-4 text-lg border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  <Package className="mr-3 h-6 w-6" />
                  View Pantry
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-professional">Smart Food Management</h2>
            <p className="text-xl text-professional-muted max-w-3xl mx-auto">
              Our AI-powered ecosystem transforms how you manage food, reducing waste and saving money
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="professional-card hover-lift scroll-reveal">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-professional">Smart Receipt Scanning</CardTitle>
                <CardDescription className="text-base text-professional-muted">
                  Advanced OCR technology automatically extracts and categorizes your groceries with AI precision
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-professional-muted">Image & PDF support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-professional-muted">AI-powered categorization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-professional-muted">Intelligent quantity detection</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="professional-card hover-lift scroll-reveal" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-professional">Expiry Prediction</CardTitle>
                <CardDescription className="text-base text-professional-muted">
                  Machine learning algorithms predict expiry dates based on product type and storage conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-professional-muted">Storage-aware predictions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-professional-muted">ML-powered accuracy</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-professional-muted">Custom adjustments</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="professional-card hover-lift scroll-reveal" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-2xl text-professional">Smart Alerts</CardTitle>
                <CardDescription className="text-base text-professional-muted">
                  Proactive notifications keep you informed before food expires with customizable timing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-professional-muted">Email notifications</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-professional-muted">Customizable timing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-professional-muted">Priority sorting</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="professional-card hover-lift scroll-reveal" style={{ animationDelay: "0.3s" }}>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                  <ChefHat className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl text-professional">Recipe Suggestions</CardTitle>
                <CardDescription className="text-base text-professional-muted">
                  AI-curated recipes match your expiring ingredients for delicious, waste-free cooking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-professional-muted">Ingredient matching</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-professional-muted">Difficulty levels</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-professional-muted">Prep time estimates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="professional-card hover-lift scroll-reveal" style={{ animationDelay: "0.4s" }}>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-2xl text-professional">Pantry Management</CardTitle>
                <CardDescription className="text-base text-professional-muted">
                  Comprehensive dashboard organizes and tracks all food items with intelligent categorization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-professional-muted">Visual dashboard</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-professional-muted">Advanced search & filter</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-professional-muted">Bulk operations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="professional-card hover-lift scroll-reveal" style={{ animationDelay: "0.5s" }}>
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-4">
                  <Smartphone className="h-8 w-8 text-teal-600" />
                </div>
                <CardTitle className="text-2xl text-professional">Mobile Responsive</CardTitle>
                <CardDescription className="text-base text-professional-muted">
                  Seamless experience across all devices with progressive web app capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-professional-muted">Touch-optimized interface</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-professional-muted">Offline capabilities</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-professional-muted">Lightning fast</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center scroll-reveal">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-professional">Start Your Sustainable Journey</h2>
          <p className="text-xl text-professional-muted mb-10 leading-relaxed">
            Join thousands of users who have already reduced their food waste and saved money with VoxQuery
          </p>
          <Link href="/upload">
            <Button size="lg" className="professional-btn text-white border-0 px-10 py-5 text-xl">
              Get Started Now
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 sm:px-6 lg:px-8 border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Package className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-professional">VoxQuery</span>
          </div>
          <p className="text-professional-muted">Digital Food Waste Tracker - Building a sustainable future</p>
        </div>
      </footer>
    </div>
  )
}

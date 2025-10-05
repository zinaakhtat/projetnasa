"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Activity, TrendingUp, TrendingDown, MapPin, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface AirQualityData {
  aqi: number
  category: string
  color: string
  pm25: number
  pm10: number
  o3: number
  no2: number
  so2: number
  co: number
  location: string
  timestamp: Date
  trend: "up" | "down" | "stable"
}

export function AirQualityDashboard() {
  const [user, setUser] = useState(getUser())
  const [airData, setAirData] = useState<AirQualityData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser) {
      router.push("/")
      return
    }
    if (!currentUser.hasCompletedProfile) {
      router.push("/profile")
      return
    }
    setUser(currentUser)

    // Simulate air quality data
    const mockData: AirQualityData = {
      aqi: Math.floor(Math.random() * 150) + 50,
      category: "",
      color: "",
      pm25: Math.floor(Math.random() * 50) + 10,
      pm10: Math.floor(Math.random() * 80) + 20,
      o3: Math.floor(Math.random() * 100) + 30,
      no2: Math.floor(Math.random() * 60) + 20,
      so2: Math.floor(Math.random() * 40) + 10,
      co: Math.floor(Math.random() * 5) + 1,
      location: "Casablanca, Maroc",
      timestamp: new Date(),
      trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as "up" | "down" | "stable",
    }

    // Determine category based on AQI
    if (mockData.aqi <= 50) {
      mockData.category = "Bon"
      mockData.color = "text-chart-1"
    } else if (mockData.aqi <= 100) {
      mockData.category = "Modéré"
      mockData.color = "text-chart-2"
    } else if (mockData.aqi <= 150) {
      mockData.category = "Mauvais pour groupes sensibles"
      mockData.color = "text-chart-3"
    } else if (mockData.aqi <= 200) {
      mockData.category = "Mauvais"
      mockData.color = "text-chart-4"
    } else {
      mockData.category = "Très mauvais"
      mockData.color = "text-destructive"
    }

    setAirData(mockData)
  }, [router])

  if (!user || !airData) {
    return null
  }

  const hasHealthRisks =
    user.healthConditions &&
    (user.healthConditions.asthma ||
      user.healthConditions.copd ||
      user.healthConditions.cardiovascular ||
      user.healthConditions.lungCancer)

  const shouldShowAlert = airData.aqi > 100 && hasHealthRisks

  const pollutants = [
    { name: "PM2.5", value: airData.pm25, unit: "µg/m³", max: 75, description: "Particules fines", color: "#3b82f6" },
    { name: "PM10", value: airData.pm10, unit: "µg/m³", max: 150, description: "Particules", color: "#8b5cf6" },
    { name: "O₃", value: airData.o3, unit: "µg/m³", max: 180, description: "Ozone", color: "#06b6d4" },
    { name: "NO₂", value: airData.no2, unit: "µg/m³", max: 100, description: "Dioxyde d'azote", color: "#f59e0b" },
    { name: "SO₂", value: airData.so2, unit: "µg/m³", max: 80, description: "Dioxyde de soufre", color: "#ef4444" },
    { name: "CO", value: airData.co, unit: "mg/m³", max: 10, description: "Monoxyde de carbone", color: "#ec4899" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      <main className="container mx-auto px-6 py-8 space-y-6">
        {/* Alert Banner */}
        {shouldShowAlert && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-destructive">Alerte santé</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    La qualité de l'air est actuellement mauvaise. En raison de vos conditions de santé, nous vous
                    recommandons de limiter les activités extérieures et de porter un masque si nécessaire.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main AQI Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl">Indice de Qualité de l'Air</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {airData.location}
                </CardDescription>
              </div>
              <Badge variant="outline" className="gap-1">
                <Calendar className="w-3 h-3" />
                {airData.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className={cn("text-6xl font-bold tabular-nums", airData.color)}>{airData.aqi}</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    {airData.trend === "up" && <TrendingUp className="w-4 h-4" />}
                    {airData.trend === "down" && <TrendingDown className="w-4 h-4" />}
                    {airData.trend === "stable" && <Activity className="w-4 h-4" />}
                  </div>
                </div>
                <p className={cn("text-lg font-medium", airData.color)}>{airData.category}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm text-muted-foreground">AQI</p>
                <Progress value={(airData.aqi / 300) * 100} className="w-32 h-2" />
                <p className="text-xs text-muted-foreground">sur 300</p>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Recommandations</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {airData.aqi <= 50 &&
                  "La qualité de l'air est excellente. Profitez de vos activités extérieures sans restriction."}
                {airData.aqi > 50 &&
                  airData.aqi <= 100 &&
                  "La qualité de l'air est acceptable. Les personnes sensibles devraient limiter les efforts prolongés."}
                {airData.aqi > 100 &&
                  airData.aqi <= 150 &&
                  "Les groupes sensibles devraient réduire les activités extérieures prolongées."}
                {airData.aqi > 150 &&
                  "Évitez les activités extérieures. Restez à l'intérieur et gardez les fenêtres fermées."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Polluants atmosphériques</CardTitle>
            <CardDescription>Vue d'ensemble de tous les paramètres de qualité de l'air</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pollutants.map((pollutant) => (
                <div key={pollutant.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pollutant.color }} />
                      <div>
                        <span className="font-semibold text-sm">{pollutant.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">{pollutant.description}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {pollutant.value} {pollutant.unit}
                    </Badge>
                  </div>
                  <div className="relative">
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((pollutant.value / pollutant.max) * 100, 100)}%`,
                          backgroundColor: pollutant.color,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Limite: {pollutant.max} {pollutant.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t bg-card/30 mt-12">
        <div className="container mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
          <p>Application de surveillance de la qualité de l'air - Protégeons la santé des citoyens marocains</p>
        </div>
      </footer>
    </div>
  )
}

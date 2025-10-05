"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, ChevronDown, ChevronUp, Sparkles, TrendingUp, AlertCircle, Clock, Map } from "lucide-react"
import { cn } from "@/lib/utils"

interface HourlyForecast {
  hour: string
  aqi: number
  category: string
  color: string
  temperature: number
}

interface ForecastResult {
  city: string
  date: string
  prediction: string
  aqi: number
  category: string
  color: string
  hourlyForecasts: HourlyForecast[]
  parameters: {
    pm25: number
    pm10: number
    o3: number
    no2: number
    so2: number
    co: number
  }
}

export default function ForecastPage() {
  const router = useRouter()
  const user = getUser()
  const [city, setCity] = useState("Casablanca")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [result, setResult] = useState<ForecastResult | null>(null)
  const [showParameters, setShowParameters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    const loadInitialForecast = () => {
      setIsLoading(true)
      setTimeout(() => {
        generateForecast("Casablanca", date)
        setIsLoading(false)
      }, 500)
    }

    if (!user) {
      router.push("/")
      return
    }

    loadInitialForecast()
  }, [])

  const moroccanCities = [
    { name: "Casablanca", x: 35, y: 45 },
    { name: "Rabat", x: 32, y: 40 },
    { name: "Marrakech", x: 28, y: 60 },
    { name: "Fès", x: 45, y: 38 },
    { name: "Tanger", x: 30, y: 20 },
    { name: "Agadir", x: 20, y: 75 },
    { name: "Meknès", x: 42, y: 42 },
    { name: "Oujda", x: 75, y: 40 },
    { name: "Tétouan", x: 32, y: 25 },
    { name: "Essaouira", x: 18, y: 62 },
  ]

  const generateForecast = (cityName: string, forecastDate: string) => {
    const aqi = Math.floor(Math.random() * 150) + 50
    let category = ""
    let color = ""
    let prediction = ""

    if (aqi <= 50) {
      category = "Bon"
      color = "text-chart-1"
      prediction = `La qualité de l'air à ${cityName} sera excellente le ${new Date(forecastDate).toLocaleDateString("fr-FR")}. Vous pouvez profiter de vos activités extérieures sans restriction.`
    } else if (aqi <= 100) {
      category = "Modéré"
      color = "text-chart-2"
      prediction = `La qualité de l'air à ${cityName} sera acceptable le ${new Date(forecastDate).toLocaleDateString("fr-FR")}. Les personnes sensibles devraient limiter les efforts prolongés en extérieur.`
    } else if (aqi <= 150) {
      category = "Mauvais pour groupes sensibles"
      color = "text-chart-3"
      prediction = `La qualité de l'air à ${cityName} sera mauvaise pour les groupes sensibles le ${new Date(forecastDate).toLocaleDateString("fr-FR")}. Il est recommandé de réduire les activités extérieures prolongées.`
    } else {
      category = "Mauvais"
      color = "text-chart-4"
      prediction = `La qualité de l'air à ${cityName} sera mauvaise le ${new Date(forecastDate).toLocaleDateString("fr-FR")}. Évitez les activités extérieures et restez à l'intérieur autant que possible.`
    }

    const hourlyForecasts: HourlyForecast[] = Array.from({ length: 24 }, (_, i) => {
      const hourAqi = Math.max(20, Math.min(200, aqi + Math.floor(Math.random() * 40) - 20))
      let hourCategory = ""
      let hourColor = ""

      if (hourAqi <= 50) {
        hourCategory = "Bon"
        hourColor = "text-chart-1"
      } else if (hourAqi <= 100) {
        hourCategory = "Modéré"
        hourColor = "text-chart-2"
      } else if (hourAqi <= 150) {
        hourCategory = "Sensible"
        hourColor = "text-chart-3"
      } else {
        hourCategory = "Mauvais"
        hourColor = "text-chart-4"
      }

      return {
        hour: `${i.toString().padStart(2, "0")}:00`,
        aqi: hourAqi,
        category: hourCategory,
        color: hourColor,
        temperature: Math.floor(Math.random() * 15) + 15,
      }
    })

    setResult({
      city: cityName,
      date: forecastDate,
      prediction,
      aqi,
      category,
      color,
      hourlyForecasts,
      parameters: {
        pm25: Math.floor(Math.random() * 50) + 10,
        pm10: Math.floor(Math.random() * 80) + 20,
        o3: Math.floor(Math.random() * 100) + 30,
        no2: Math.floor(Math.random() * 60) + 20,
        so2: Math.floor(Math.random() * 40) + 10,
        co: Math.floor(Math.random() * 5) + 1,
      },
    })
    setShowParameters(false)
    setShowMap(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      generateForecast(city, date)
      setIsLoading(false)
    }, 800)
  }

  const selectedDate = new Date(date)
  const today = new Date()
  const isFuture = selectedDate > today
  const daysDiff = Math.ceil((selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const adviceIcons = [
    {
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CC3SdGGr7NhRzH3aunD9HKr9hX6JR5.png",
      label: "Porter un masque",
      show: result && result.aqi > 100,
    },
    {
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CC3SdGGr7NhRzH3aunD9HKr9hX6JR5.png",
      label: "Éviter l'exercice extérieur",
      show: result && result.aqi > 100,
    },
    {
      icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CC3SdGGr7NhRzH3aunD9HKr9hX6JR5.png",
      label: "Fermer les fenêtres",
      show: result && result.aqi > 150,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      <main className="container mx-auto px-6 py-8 max-w-4xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Prévisions de Qualité de l'Air</h1>
          <p className="text-muted-foreground text-balance">
            Consultez la qualité de l'air actuelle ou future pour n'importe quelle ville au Maroc
          </p>
        </div>

        <Card className="shadow-lg border-primary/10">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <CardTitle className="text-xl">Rechercher une prévision</CardTitle>
            </div>
            <CardDescription>
              Entrez une ville et sélectionnez une date pour obtenir une analyse détaillée
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">
                    Ville ou destination
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="city"
                      type="text"
                      placeholder="Ex: Casablanca, Rabat..."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="pl-10 h-11"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 bg-transparent"
                    onClick={() => setShowMap(!showMap)}
                  >
                    <Map className="w-4 h-4" />
                    {showMap ? "Masquer la carte" : "Sélectionner sur la carte"}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium">
                    Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="pl-10 h-11"
                    />
                  </div>
                </div>
              </div>

              {showMap && (
                <Card className="bg-muted/30 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-8 border-2 border-dashed border-border min-h-[400px]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-full h-full max-w-2xl">
                          {moroccanCities.map((cityData) => (
                            <button
                              key={cityData.name}
                              type="button"
                              onClick={() => {
                                setCity(cityData.name)
                                setShowMap(false)
                              }}
                              className={cn(
                                "absolute group transition-all hover:scale-110",
                                city === cityData.name && "scale-125",
                              )}
                              style={{ left: `${cityData.x}%`, top: `${cityData.y}%` }}
                            >
                              <div
                                className={cn(
                                  "w-4 h-4 rounded-full border-2 border-background shadow-lg transition-colors",
                                  city === cityData.name ? "bg-primary scale-150" : "bg-primary/60 hover:bg-primary",
                                )}
                              />
                              <span
                                className={cn(
                                  "absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap px-2 py-1 rounded bg-background/90 border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity",
                                  city === cityData.name && "opacity-100",
                                )}
                              >
                                {cityData.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="text-center text-sm text-muted-foreground mt-4">
                        Cliquez sur une ville pour la sélectionner
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {date && (
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {isFuture ? (
                      <>
                        Prévision pour dans <span className="font-medium text-foreground">{daysDiff} jour(s)</span>
                      </>
                    ) : (
                      <>
                        Qualité de l'air <span className="font-medium text-foreground">actuelle</span>
                      </>
                    )}
                  </span>
                </div>
              )}

              <Button type="submit" className="w-full h-11 gap-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Obtenir la prévision
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Card className="shadow-xl border-primary/20 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary via-primary/70 to-primary" />

            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <CardTitle className="text-2xl">{result.city}</CardTitle>
                  </div>
                  <CardDescription className="flex items-center gap-2 text-base">
                    <Calendar className="w-4 h-4" />
                    {new Date(result.date).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </div>
                <div className="text-right space-y-1">
                  <Badge className={cn("text-lg px-4 py-1.5", result.color)}>AQI {result.aqi}</Badge>
                  <p className={cn("text-sm font-medium", result.color)}>{result.category}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                      result.aqi <= 100 ? "bg-chart-1/10" : "bg-chart-4/10",
                    )}
                  >
                    <TrendingUp className={cn("w-5 h-5", result.color)} />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h4 className={cn("font-semibold text-sm", result.color)}>Analyse de la qualité de l'air</h4>
                    <p className="text-sm text-foreground leading-relaxed">{result.prediction}</p>
                  </div>
                </div>
              </div>

              {result.aqi > 100 && (
                <div className="p-5 bg-gradient-to-br from-destructive/5 to-destructive/10 rounded-xl border border-destructive/20">
                  <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    Conseils de sécurité
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center gap-2 p-3 bg-background/50 rounded-lg">
                      <svg
                        className="w-12 h-12 text-destructive"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M12 3c-1.5 0-2.5 1-3 2-1 2-1 4-1 6 0 1 0 2 1 3 .5 1 1.5 2 3 2s2.5-1 3-2c1-1 1-2 1-3 0-2 0-4-1-6-.5-1-1.5-2-3-2z" />
                        <path d="M8 10c-.5-.5-1-1-2-1s-2 .5-2 1.5S5 12 6 12s1.5-.5 2-1z" />
                        <path d="M16 10c.5-.5 1-1 2-1s2 .5 2 1.5S19 12 18 12s-1.5-.5-2-1z" />
                        <path d="M9 14h6" />
                      </svg>
                      <p className="text-xs text-center font-medium">Porter un masque</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-3 bg-background/50 rounded-lg">
                      <svg
                        className="w-12 h-12 text-destructive"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                        <circle cx="18" cy="6" r="3" />
                        <path d="M18 3v6" />
                      </svg>
                      <p className="text-xs text-center font-medium">Éviter l'exercice</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-3 bg-background/50 rounded-lg">
                      <svg
                        className="w-12 h-12 text-destructive"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M9 3v18" />
                        <path d="M15 3v18" />
                        <path d="M3 9h18" />
                        <path d="M3 15h18" />
                      </svg>
                      <p className="text-xs text-center font-medium">Fermer les fenêtres</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-lg">Prévisions horaires</h4>
                </div>
                <div className="overflow-x-auto pb-2">
                  <div className="flex gap-3 min-w-max">
                    {result.hourlyForecasts.map((hourly, index) => (
                      <Card
                        key={index}
                        className={cn(
                          "min-w-[120px] border-2 transition-all hover:shadow-lg",
                          hourly.aqi <= 50 && "border-chart-1/20 hover:border-chart-1/40",
                          hourly.aqi > 50 && hourly.aqi <= 100 && "border-chart-2/20 hover:border-chart-2/40",
                          hourly.aqi > 100 && hourly.aqi <= 150 && "border-chart-3/20 hover:border-chart-3/40",
                          hourly.aqi > 150 && "border-chart-4/20 hover:border-chart-4/40",
                        )}
                      >
                        <CardContent className="p-4 space-y-3">
                          <div className="text-center">
                            <p className="text-sm font-semibold">{hourly.hour}</p>
                            <p className="text-xs text-muted-foreground">{hourly.temperature}°C</p>
                          </div>
                          <div className="text-center space-y-1">
                            <Badge className={cn("text-base px-3 py-1", hourly.color)} variant="secondary">
                              {hourly.aqi}
                            </Badge>
                            <p className={cn("text-xs font-medium", hourly.color)}>{hourly.category}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full gap-2 h-11 bg-card hover:bg-muted/50"
                onClick={() => setShowParameters(!showParameters)}
              >
                {showParameters ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Masquer les paramètres détaillés
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Voir les paramètres détaillés
                  </>
                )}
              </Button>

              {showParameters && (
                <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <h4 className="font-semibold text-sm text-muted-foreground">Paramètres de prédiction</h4>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      { name: "PM2.5", value: result.parameters.pm25, unit: "µg/m³", desc: "Particules fines" },
                      { name: "PM10", value: result.parameters.pm10, unit: "µg/m³", desc: "Particules" },
                      { name: "O₃", value: result.parameters.o3, unit: "µg/m³", desc: "Ozone" },
                      { name: "NO₂", value: result.parameters.no2, unit: "µg/m³", desc: "Dioxyde d'azote" },
                      { name: "SO₂", value: result.parameters.so2, unit: "µg/m³", desc: "Dioxyde de soufre" },
                      { name: "CO", value: result.parameters.co, unit: "mg/m³", desc: "Monoxyde de carbone" },
                    ].map((param) => (
                      <div
                        key={param.name}
                        className="p-4 bg-card border rounded-xl space-y-2 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">{param.name}</span>
                          <Badge variant="secondary" className="font-mono text-xs">
                            {param.value} {param.unit}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{param.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

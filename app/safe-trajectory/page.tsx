"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Navigation,
  ChevronDown,
  ChevronUp,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Route,
  Clock,
  Wind,
  Map,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { t } from "@/app/_trpc/i18n"

interface TrajectoryResult {
  from: string
  to: string
  isSafe: boolean
  overallAqi: number
  category: string
  color: string
  message: string
  recommendation: string
  alternativeRoute?: {
    description: string
    estimatedTime: string
    aqiImprovement: number
  }
  routeDetails: {
    distance: string
    estimatedTime: string
    checkpoints: Array<{
      location: string
      aqi: number
      status: "safe" | "moderate" | "unsafe"
    }>
  }
}

export default function SafeTrajectoryPage() {
  const router = useRouter()
  const user = getUser()
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [result, setResult] = useState<TrajectoryResult | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [selectingPoint, setSelectingPoint] = useState<"from" | "to" | null>(null)

  if (!user) {
    router.push("/")
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      // Simulate trajectory analysis
      const overallAqi = Math.floor(Math.random() * 180) + 30
      const isSafe = overallAqi <= 100

      let category = ""
      let color = ""
      let message = ""
      let recommendation = ""

      if (overallAqi <= 50) {
        category = "Excellent"
        color = "text-chart-1"
        message = `Le trajet de ${from} à ${to} est parfaitement sûr avec une excellente qualité de l'air tout au long du parcours.`
        recommendation = "Vous pouvez voyager en toute sécurité. Profitez de votre trajet !"
      } else if (overallAqi <= 100) {
        category = "Acceptable"
        color = "text-chart-2"
        message = `Le trajet de ${from} à ${to} est globalement sûr avec une qualité de l'air acceptable.`
        recommendation =
          "Le trajet est sûr pour la plupart des personnes. Les personnes sensibles devraient prendre des précautions."
      } else if (overallAqi <= 150) {
        category = "Préoccupant"
        color = "text-chart-3"
        message = `Le trajet de ${from} à ${to} présente des zones avec une qualité de l'air préoccupante.`
        recommendation =
          "Nous recommandons de reporter votre voyage si possible, ou de suivre l'itinéraire alternatif suggéré ci-dessous."
      } else {
        category = "Dangereux"
        color = "text-chart-4"
        message = `Le trajet de ${from} à ${to} traverse des zones avec une mauvaise qualité de l'air.`
        recommendation =
          "Nous vous conseillons fortement de reporter votre voyage ou d'emprunter l'itinéraire alternatif proposé."
      }

      // Generate checkpoints
      const checkpoints = [
        { location: from, aqi: overallAqi - 20, status: overallAqi <= 80 ? "safe" : "moderate" },
        {
          location: "Zone intermédiaire 1",
          aqi: overallAqi + 10,
          status: overallAqi + 10 <= 100 ? "safe" : overallAqi + 10 <= 150 ? "moderate" : "unsafe",
        },
        {
          location: "Zone intermédiaire 2",
          aqi: overallAqi,
          status: overallAqi <= 100 ? "safe" : overallAqi <= 150 ? "moderate" : "unsafe",
        },
        { location: to, aqi: overallAqi - 15, status: overallAqi <= 85 ? "safe" : "moderate" },
      ] as Array<{ location: string; aqi: number; status: "safe" | "moderate" | "unsafe" }>

      const alternativeRoute = !isSafe
        ? {
            description: `Itinéraire alternatif via la route côtière évitant les zones industrielles`,
            estimatedTime: "+25 minutes",
            aqiImprovement: Math.floor(overallAqi * 0.35),
          }
        : undefined

      setResult({
        from,
        to,
        isSafe,
        overallAqi,
        category,
        color,
        message,
        recommendation,
        alternativeRoute,
        routeDetails: {
          distance: `${Math.floor(Math.random() * 150) + 50} km`,
          estimatedTime: `${Math.floor(Math.random() * 3) + 1}h ${Math.floor(Math.random() * 60)}min`,
          checkpoints,
        },
      })
      setShowDetails(false)
      setIsLoading(false)
    }, 1000)
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl space-y-4 sm:space-y-6">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
              <Route className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("safeTrajectory")}</h1>
              <p className="text-sm sm:text-base text-muted-foreground">{t("safeTrajectoryDescription")}</p>
            </div>
          </div>
        </div>

        <Card className="shadow-xl border-primary/10 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Navigation className="w-4 h-4 text-primary" />
              </div>
              <CardTitle className="text-xl">Planifier votre trajet</CardTitle>
            </div>
            <CardDescription>
              Entrez votre point de départ et votre destination pour une analyse complète de la qualité de l'air
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="from" className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Point de départ
                  </Label>
                  <Input
                    id="from"
                    type="text"
                    placeholder="Ex: Casablanca"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    required
                    className="h-11"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 bg-transparent"
                    onClick={() => {
                      setSelectingPoint("from")
                      setShowMap(true)
                    }}
                  >
                    <Map className="w-4 h-4" />
                    Sélectionner sur la carte
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to" className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    Destination
                  </Label>
                  <Input
                    id="to"
                    type="text"
                    placeholder="Ex: Marrakech"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    required
                    className="h-11"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 bg-transparent"
                    onClick={() => {
                      setSelectingPoint("to")
                      setShowMap(true)
                    }}
                  >
                    <Map className="w-4 h-4" />
                    Sélectionner sur la carte
                  </Button>
                </div>
              </div>

              {showMap && (
                <Card className="bg-muted/30 border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Sélectionnez {selectingPoint === "from" ? "le point de départ" : "la destination"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-8 border-2 border-dashed border-border min-h-[400px]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-full h-full max-w-2xl">
                          {moroccanCities.map((cityData) => {
                            const isSelected =
                              (selectingPoint === "from" && from === cityData.name) ||
                              (selectingPoint === "to" && to === cityData.name)
                            return (
                              <button
                                key={cityData.name}
                                type="button"
                                onClick={() => {
                                  if (selectingPoint === "from") {
                                    setFrom(cityData.name)
                                  } else {
                                    setTo(cityData.name)
                                  }
                                  setShowMap(false)
                                  setSelectingPoint(null)
                                }}
                                className={cn(
                                  "absolute group transition-all hover:scale-110",
                                  isSelected && "scale-125",
                                )}
                                style={{ left: `${cityData.x}%`, top: `${cityData.y}%` }}
                              >
                                <div
                                  className={cn(
                                    "w-4 h-4 rounded-full border-2 border-background shadow-lg transition-colors",
                                    isSelected
                                      ? selectingPoint === "from"
                                        ? "bg-primary scale-150"
                                        : "bg-accent scale-150"
                                      : "bg-primary/60 hover:bg-primary",
                                  )}
                                />
                                <span
                                  className={cn(
                                    "absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap px-2 py-1 rounded bg-background/90 border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity",
                                    isSelected && "opacity-100",
                                  )}
                                >
                                  {cityData.name}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                      <p className="text-center text-sm text-muted-foreground mt-4">
                        Cliquez sur une ville pour la sélectionner
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button type="submit" className="w-full h-12 gap-2 text-base shadow-lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Analyser le trajet
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Main Result Card */}
            <Card
              className={cn(
                "shadow-2xl overflow-hidden border-2 transition-all",
                result.isSafe ? "border-chart-1/30" : "border-chart-4/30",
              )}
            >
              <div
                className={cn(
                  "h-2 bg-gradient-to-r",
                  result.isSafe ? "from-chart-1 via-chart-2 to-chart-1" : "from-chart-4 via-chart-3 to-chart-4",
                )}
              />

              <CardHeader className="space-y-4 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      {result.isSafe ? (
                        <div className="w-12 h-12 bg-chart-1/10 rounded-xl flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-chart-1" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-chart-4/10 rounded-xl flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-chart-4" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold">{result.isSafe ? "Trajet Sûr" : "Trajet à Risque"}</h3>
                        <p className="text-sm text-muted-foreground">Analyse complète du parcours</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium">{result.from}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <MapPin className="w-4 h-4 text-accent" />
                      <span className="font-medium">{result.to}</span>
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <Badge
                      className={cn("text-xl px-5 py-2 shadow-lg", result.color)}
                      variant={result.isSafe ? "default" : "destructive"}
                    >
                      AQI {result.overallAqi}
                    </Badge>
                    <p className={cn("text-sm font-semibold", result.color)}>{result.category}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Message */}
                <div
                  className={cn(
                    "p-5 rounded-xl border-2",
                    result.isSafe ? "bg-chart-1/5 border-chart-1/20" : "bg-chart-4/5 border-chart-4/20",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Wind className={cn("w-5 h-5 mt-0.5 flex-shrink-0", result.color)} />
                    <div className="space-y-2 flex-1">
                      <p className="text-sm font-medium leading-relaxed">{result.message}</p>
                      <div className="pt-2 border-t border-current/10">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                          Recommandation
                        </p>
                        <p className="text-sm leading-relaxed">{result.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Route Details Summary */}
                <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2">
                  <div className="p-4 bg-muted/50 rounded-xl border space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Route className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wide">Distance</span>
                    </div>
                    <p className="text-2xl font-bold">{result.routeDetails.distance}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl border space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wide">Durée estimée</span>
                    </div>
                    <p className="text-2xl font-bold">{result.routeDetails.estimatedTime}</p>
                  </div>
                </div>

                {/* Alternative Route */}
                {result.alternativeRoute && (
                  <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30 shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                          <Route className="w-4 h-4 text-accent" />
                        </div>
                        <CardTitle className="text-lg">Itinéraire Alternatif Recommandé</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm leading-relaxed">{result.alternativeRoute.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{result.alternativeRoute.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-chart-1" />
                          <span className="font-medium text-chart-1">
                            -{result.alternativeRoute.aqiImprovement} AQI
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Toggle Details Button */}
                <Button
                  variant="outline"
                  className="w-full gap-2 h-11 bg-card hover:bg-muted/50"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Masquer les détails du parcours
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Voir les détails du parcours
                    </>
                  )}
                </Button>

                {/* Detailed Checkpoints */}
                {showDetails && (
                  <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2">
                      <div className="h-px flex-1 bg-border" />
                      <h4 className="font-semibold text-sm text-muted-foreground">Points de contrôle du trajet</h4>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="space-y-3">
                      {result.routeDetails.checkpoints.map((checkpoint, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-card border rounded-xl hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                                checkpoint.status === "safe" && "bg-chart-1/10 text-chart-1",
                                checkpoint.status === "moderate" && "bg-chart-2/10 text-chart-2",
                                checkpoint.status === "unsafe" && "bg-chart-4/10 text-chart-4",
                              )}
                            >
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{checkpoint.location}</p>
                              <p className="text-xs text-muted-foreground">
                                {checkpoint.status === "safe" && "Qualité de l'air bonne"}
                                {checkpoint.status === "moderate" && "Qualité de l'air modérée"}
                                {checkpoint.status === "unsafe" && "Qualité de l'air préoccupante"}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "font-mono text-sm px-3 py-1",
                              checkpoint.status === "safe" && "bg-chart-1/10 text-chart-1",
                              checkpoint.status === "moderate" && "bg-chart-2/10 text-chart-2",
                              checkpoint.status === "unsafe" && "bg-chart-4/10 text-chart-4",
                            )}
                          >
                            {checkpoint.aqi} AQI
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-xl border-primary/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Route className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl">Visualisation du trajet</CardTitle>
                </div>
                <CardDescription>
                  Flux interactif de votre itinéraire avec les niveaux de qualité de l'air
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-[600px] sm:min-w-0">
                    <div className="relative bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl p-8 border-2 border-dashed border-border min-h-[350px]">
                      {/* Flow-based route visualization */}
                      <div className="relative h-full">
                        {/* Connecting flow lines */}
                        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                          {result.routeDetails.checkpoints.map((_, index) => {
                            if (index === result.routeDetails.checkpoints.length - 1) return null
                            const startX = (index / (result.routeDetails.checkpoints.length - 1)) * 100
                            const endX = ((index + 1) / (result.routeDetails.checkpoints.length - 1)) * 100
                            const checkpoint = result.routeDetails.checkpoints[index]
                            return (
                              <line
                                key={index}
                                x1={`${startX}%`}
                                y1="50%"
                                x2={`${endX}%`}
                                y2="50%"
                                stroke={
                                  checkpoint.status === "safe"
                                    ? "#10b981"
                                    : checkpoint.status === "moderate"
                                      ? "#f59e0b"
                                      : "#ef4444"
                                }
                                strokeWidth="3"
                                strokeDasharray="8,4"
                                opacity="0.4"
                              />
                            )
                          })}
                        </svg>

                        {/* Checkpoint nodes */}
                        <div className="relative flex items-center justify-between h-full" style={{ zIndex: 1 }}>
                          {result.routeDetails.checkpoints.map((checkpoint, index) => (
                            <div key={index} className="flex flex-col items-center gap-4 flex-1">
                              {/* Flow node */}
                              <div className="relative">
                                <div
                                  className={cn(
                                    "w-20 h-20 rounded-full flex flex-col items-center justify-center font-bold shadow-2xl border-4 border-background transition-all hover:scale-110",
                                    checkpoint.status === "safe" && "bg-gradient-to-br from-chart-1 to-chart-1/80",
                                    checkpoint.status === "moderate" && "bg-gradient-to-br from-chart-2 to-chart-2/80",
                                    checkpoint.status === "unsafe" && "bg-gradient-to-br from-chart-4 to-chart-4/80",
                                  )}
                                >
                                  {index === 0 ? (
                                    <MapPin className="w-8 h-8 text-primary-foreground" />
                                  ) : index === result.routeDetails.checkpoints.length - 1 ? (
                                    <MapPin className="w-8 h-8 text-primary-foreground" />
                                  ) : (
                                    <span className="text-2xl text-primary-foreground">{index}</span>
                                  )}
                                </div>
                                {/* Animated pulse effect */}
                                <div
                                  className={cn(
                                    "absolute inset-0 rounded-full animate-ping opacity-20",
                                    checkpoint.status === "safe" && "bg-chart-1",
                                    checkpoint.status === "moderate" && "bg-chart-2",
                                    checkpoint.status === "unsafe" && "bg-chart-4",
                                  )}
                                />
                                {/* AQI badge */}
                                <Badge
                                  className={cn(
                                    "absolute -bottom-3 left-1/2 -translate-x-1/2 font-mono text-sm px-3 py-1 shadow-lg",
                                    checkpoint.status === "safe" && "bg-chart-1 text-primary-foreground",
                                    checkpoint.status === "moderate" && "bg-chart-2 text-primary-foreground",
                                    checkpoint.status === "unsafe" && "bg-chart-4 text-primary-foreground",
                                  )}
                                >
                                  {checkpoint.aqi}
                                </Badge>
                              </div>

                              {/* Location info */}
                              <div className="text-center space-y-2 mt-6">
                                <p className="text-sm font-bold text-balance max-w-[140px]">{checkpoint.location}</p>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    checkpoint.status === "safe" && "border-chart-1 text-chart-1",
                                    checkpoint.status === "moderate" && "border-chart-2 text-chart-2",
                                    checkpoint.status === "unsafe" && "border-chart-4 text-chart-4",
                                  )}
                                >
                                  {checkpoint.status === "safe" && "Bon"}
                                  {checkpoint.status === "moderate" && "Modéré"}
                                  {checkpoint.status === "unsafe" && "Mauvais"}
                                </Badge>
                              </div>

                              {/* Flow arrow */}
                              {index < result.routeDetails.checkpoints.length - 1 && (
                                <ArrowRight
                                  className={cn(
                                    "absolute left-[calc(50%+3rem)] top-1/2 -translate-y-1/2 w-6 h-6 opacity-40",
                                    checkpoint.status === "safe" && "text-chart-1",
                                    checkpoint.status === "moderate" && "text-chart-2",
                                    checkpoint.status === "unsafe" && "text-chart-4",
                                  )}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="mt-8 pt-6 border-t flex items-center justify-center gap-6 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-chart-1 shadow-sm" />
                          <span className="text-xs text-muted-foreground">Bon (0-50)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-chart-2 shadow-sm" />
                          <span className="text-xs text-muted-foreground">Modéré (51-100)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-chart-3 shadow-sm" />
                          <span className="text-xs text-muted-foreground">Sensible (101-150)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-chart-4 shadow-sm" />
                          <span className="text-xs text-muted-foreground">Mauvais (151+)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Advisory for User */}
            {user.conditions && user.conditions.length > 0 && !result.isSafe && (
              <Card className="bg-destructive/5 border-destructive/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <CardTitle className="text-base">Alerte Santé Personnalisée</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">
                    En raison de vos conditions de santé ({user.conditions.join(", ")}), nous vous recommandons
                    fortement d'éviter ce trajet ou d'emprunter l'itinéraire alternatif suggéré.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, MapPin, Calendar, Clock, CheckCircle2, Send } from "lucide-react"

interface ComplaintSubmission {
  location: string
  date: string
  time: string
  description: string
  submittedAt: Date
}

export default function ComplaintPage() {
  const router = useRouter()
  const user = getUser()
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submission, setSubmission] = useState<ComplaintSubmission | null>(null)

  if (!user) {
    router.push("/")
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      const newSubmission: ComplaintSubmission = {
        location,
        date,
        time,
        description,
        submittedAt: new Date(),
      }

      setSubmission(newSubmission)
      setIsSubmitted(true)
      setIsLoading(false)

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setLocation("")
        setDate("")
        setTime("")
        setDescription("")
        setSubmission(null)
      }, 5000)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      <main className="container mx-auto px-6 py-8 max-w-4xl space-y-6">
        {/* Header Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-destructive to-destructive/70 rounded-xl flex items-center justify-center shadow-lg">
              <AlertCircle className="w-6 h-6 text-destructive-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Réclamation</h1>
              <p className="text-muted-foreground">Signalez une pollution non détectée</p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <Card className="bg-muted/50 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Pourquoi signaler une pollution ?</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Si vous avez constaté une pollution de l'air dans votre zone mais n'avez reçu aucune notification,
                  veuillez nous le signaler. Vos informations nous aident à améliorer notre système de surveillance et à
                  protéger la santé de tous les citoyens.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaint Form */}
        {!isSubmitted ? (
          <Card className="shadow-xl border-primary/10 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-destructive via-primary to-destructive" />
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <Send className="w-4 h-4 text-destructive" />
                </div>
                <CardTitle className="text-xl">Formulaire de réclamation</CardTitle>
              </div>
              <CardDescription>
                Remplissez les informations ci-dessous pour signaler une pollution non détectée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Lieu de la pollution
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Ex: Avenue Mohammed V, Casablanca"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">Soyez aussi précis que possible</p>
                </div>

                {/* Date and Time */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Date exacte
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="h-11"
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Horaire exact
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-primary" />
                    Description (optionnelle)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez ce que vous avez observé : odeurs, fumée, visibilité réduite, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Toute information supplémentaire nous aide à mieux comprendre la situation
                  </p>
                </div>

                {/* User Info Display */}
                <div className="p-4 bg-muted/50 rounded-xl border space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Informations du déclarant
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium">{user.name}</span>
                    {user.age && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{user.age} ans</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full h-12 gap-2 text-base shadow-lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Envoyer la réclamation
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          // Success Message
          <Card className="shadow-2xl border-chart-1/30 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="h-2 bg-gradient-to-r from-chart-1 via-chart-2 to-chart-1" />
            <CardHeader className="space-y-4 pb-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-chart-1/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-chart-1" />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-2xl font-bold">Réclamation envoyée avec succès</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Merci pour votre contribution. Votre signalement a été enregistré et sera analysé par notre équipe
                    dans les plus brefs délais.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Submission Details */}
              <div className="p-5 bg-muted/50 rounded-xl border space-y-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Détails de votre réclamation
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Lieu</p>
                      <p className="text-sm font-medium">{submission?.location}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-sm font-medium">
                          {submission?.date &&
                            new Date(submission.date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Horaire</p>
                        <p className="text-sm font-medium">{submission?.time}</p>
                      </div>
                    </div>
                  </div>

                  {submission?.description && (
                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Description</p>
                      <p className="text-sm leading-relaxed">{submission.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Steps */}
              <div className="p-5 bg-primary/5 rounded-xl border border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-semibold">Prochaines étapes</p>
                    <ul className="text-sm text-muted-foreground space-y-1 leading-relaxed">
                      <li>• Notre équipe analysera votre signalement dans les 24-48 heures</li>
                      <li>• Nous vérifierons les données de nos capteurs pour cette zone et période</li>
                      <li>• Si nécessaire, nous ajusterons nos algorithmes de détection</li>
                      <li>• Vous recevrez une notification une fois l'analyse terminée</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

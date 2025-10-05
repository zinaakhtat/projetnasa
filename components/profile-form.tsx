"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { getUser, setUser } from "@/lib/auth"
import { AlertCircle } from "lucide-react"

export function ProfileForm() {
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [healthConditions, setHealthConditions] = useState({
    asthma: false,
    copd: false,
    cardiovascular: false,
    lungCancer: false,
  })
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const user = getUser()
    if (!user) {
      router.push("/")
      return
    }
    if (user.hasCompletedProfile) {
      router.push("/dashboard")
    }
    if (user.name) setName(user.name)
    if (user.age) setAge(user.age.toString())
    if (user.healthConditions) setHealthConditions(user.healthConditions)
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !age) {
      setError("Veuillez remplir tous les champs obligatoires")
      return
    }

    const ageNum = Number.parseInt(age)
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setError("Veuillez entrer un âge valide")
      return
    }

    const user = getUser()
    if (!user) {
      router.push("/")
      return
    }

    setUser({
      ...user,
      name,
      age: ageNum,
      healthConditions,
      hasCompletedProfile: true,
    })

    router.push("/dashboard")
  }

  const conditions = [
    { id: "asthma", label: "Asthme", key: "asthma" as const },
    { id: "copd", label: "Bronchopneumopathie chronique obstructive (BPCO)", key: "copd" as const },
    { id: "cardiovascular", label: "Maladie cardiovasculaire / AVC", key: "cardiovascular" as const },
    { id: "lungCancer", label: "Cancer du poumon", key: "lungCancer" as const },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold">Complétez votre profil</CardTitle>
          <CardDescription className="text-balance">
            Ces informations nous aideront à personnaliser vos alertes de qualité de l'air
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Votre nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Âge *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  min="1"
                  max="120"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground leading-relaxed">
                  Souffrez-vous de l'une de ces conditions médicales ? Ces informations nous permettront de vous alerter
                  en cas de risque élevé.
                </div>
              </div>

              <div className="space-y-3">
                {conditions.map((condition) => (
                  <div
                    key={condition.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <Checkbox
                      id={condition.id}
                      checked={healthConditions[condition.key]}
                      onCheckedChange={(checked) =>
                        setHealthConditions({
                          ...healthConditions,
                          [condition.key]: checked === true,
                        })
                      }
                    />
                    <Label htmlFor={condition.id} className="text-sm font-normal leading-relaxed cursor-pointer">
                      {condition.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" size="lg">
              Continuer vers le tableau de bord
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

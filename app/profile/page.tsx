"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/auth"
import { ProfileForm } from "@/components/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Heart } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(getUser())

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser) {
      router.push("/")
      return
    }
    setUser(currentUser)
  }, [router])

  if (!user) {
    return null
  }

  if (!user.hasCompletedProfile) {
    return <ProfileForm />
  }

  const hasHealthRisks =
    user.healthConditions &&
    (user.healthConditions.asthma ||
      user.healthConditions.copd ||
      user.healthConditions.cardiovascular ||
      user.healthConditions.lungCancer)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      <main className="container mx-auto px-6 py-8 max-w-3xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles et de santé</p>
        </div>

        {/* User Information Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Informations personnelles</CardTitle>
                <CardDescription>Vos données de profil</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nom complet</p>
                <p className="font-semibold">{user.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Âge</p>
                <p className="font-semibold">{user.age} ans</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Votre profil de santé</CardTitle>
                <CardDescription>Conditions médicales surveillées pour des alertes personnalisées</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {hasHealthRisks ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {user.healthConditions?.asthma && (
                  <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Asthme</p>
                      <p className="text-xs text-muted-foreground">Surveillance active</p>
                    </div>
                  </div>
                )}
                {user.healthConditions?.copd && (
                  <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">BPCO</p>
                      <p className="text-xs text-muted-foreground">Surveillance active</p>
                    </div>
                  </div>
                )}
                {user.healthConditions?.cardiovascular && (
                  <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Maladie cardiovasculaire / AVC</p>
                      <p className="text-xs text-muted-foreground">Surveillance active</p>
                    </div>
                  </div>
                )}
                {user.healthConditions?.lungCancer && (
                  <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Cancer du poumon</p>
                      <p className="text-xs text-muted-foreground">Surveillance active</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Aucune condition médicale enregistrée</p>
                <Badge variant="secondary" className="mt-2">
                  Profil standard
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

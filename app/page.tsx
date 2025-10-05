import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Bell, TrendingUp } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-lg w-full space-y-4 text-center relative z-10">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Respera Logo"
              width={270}
              height={90}
              className="object-contain"
              priority
            />
          </div>
          <div className="space-y-2">
            <p className="text-xl text-muted-foreground font-medium">
              Surveillance de la qualité de l'air au Maroc
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border">
            <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-xs font-medium">Protection</p>
          </div>
          <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border">
            <Bell className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-xs font-medium">Alertes</p>
          </div>
          <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-xs font-medium">Prévisions</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-lg">
            Protégez votre santé avec des alertes personnalisées et des données
            en temps réel sur la qualité de l'air
          </p>

          <Link href="/auth" className="block">
            <Button
              size="lg"
              className="w-full h-14 text-lg shadow-2xl hover:shadow-primary/25 transition-all"
            >
              Se connecter
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Données en temps réel</span>
          <span>•</span>
          <span>Alertes personnalisées</span>
          <span>•</span>
          <span>Trajets sûrs</span>
        </div>
      </div>
    </div>
  );
}

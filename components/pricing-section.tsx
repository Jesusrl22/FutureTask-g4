"use client"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Sparkles } from "lucide-react"
import { PayPalButton } from "./paypal-button"

interface PricingSectionProps {
  onUpgrade: (type: "monthly" | "yearly") => void
  onSkip: () => void
}

export function PricingSection({ onUpgrade, onSkip }: PricingSectionProps) {
  const features = {
    free: [
      { text: "Acceso básico al calendario", included: true },
      { text: "Máximo 20 tareas activas", included: true },
      { text: "Anuncios visibles", included: true },
      { text: "Temas de color básicos", included: true },
      { text: "Sin estadísticas avanzadas", included: false },
      { text: "Sin logros extra", included: false },
      { text: "Sin tareas ilimitadas", included: false },
      { text: "Sin temas exclusivos", included: false },
      { text: "Sin vista semanal", included: false }, // New premium feature
      { text: "Sin modo Pomodoro", included: false }, // New premium feature
    ],
    premium: [
      { text: "Acceso completo al calendario", included: true },
      { text: "Tareas ilimitadas", included: true },
      { text: "Sin anuncios", included: true },
      { text: "Acceso a temas exclusivos", included: true },
      { text: "Estadísticas detalladas", included: true },
      { text: "Logros desbloqueables adicionales", included: true },
      { text: "Medallas especiales", included: true },
      { text: "Soporte prioritario", included: true },
      { text: "Vista semanal de tareas", included: true }, // New premium feature
      { text: "Modo Pomodoro integrado", included: true }, // New premium feature
    ],
  }

  const handlePayPalSuccess = (type: "monthly" | "yearly") => (details: any, data: any) => {
    console.log("Payment successful:", details, data)
    onUpgrade(type)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

      <Card className="w-full max-w-4xl bg-black/20 backdrop-blur-xl border-purple-500/20 shadow-2xl animate-scale-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Elige tu Plan FutureTask
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Desbloquea todo el potencial de tu productividad.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Free Plan Card */}
          <Card className="bg-black/30 border-gray-700/50 p-6 flex flex-col justify-between animate-slide-in-left">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Gratis</h3>
              <p className="text-muted-foreground mb-4">Ideal para empezar a organizar tus tareas.</p>
              <div className="space-y-2">
                {features.free.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {feature.included ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className={feature.included ? "text-foreground" : "text-muted-foreground line-through"}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <Button
              onClick={onSkip}
              variant="outline"
              className="w-full mt-6 h-12 bg-black/40 border-gray-500/30 text-muted-foreground hover:bg-gray-700/30 transition-all duration-300"
            >
              Continuar como Gratis
            </Button>
          </Card>

          {/* Premium Plan Card */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-cyan-900/50 border-purple-500/50 p-6 flex flex-col justify-between relative overflow-hidden animate-slide-in-right">
            <Sparkles className="absolute -top-4 -right-4 w-20 h-20 text-purple-400/20 rotate-12" />
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center">
                Premium <Badge className="ml-2 bg-yellow-500 text-white">Recomendado</Badge>
              </h3>
              <p className="text-muted-foreground mb-4">
                Desbloquea todas las funciones para una productividad ilimitada.
              </p>
            </div>
            <div className="space-y-2">
              {features.premium.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-foreground">{feature.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground">
                  $0.99<span className="text-lg text-muted-foreground">/mes</span>
                </p>
                <PayPalButton amount="0.99" onSuccess={handlePayPalSuccess("monthly")} />
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground">
                  $10<span className="text-lg text-muted-foreground">/año</span>
                </p>
                <PayPalButton amount="10.00" onSuccess={handlePayPalSuccess("yearly")} />
              </div>
            </div>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

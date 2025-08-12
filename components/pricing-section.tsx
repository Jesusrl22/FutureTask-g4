"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Sparkles } from "lucide-react"

interface PricingSectionProps {
  onUpgrade: (type: "monthly" | "yearly") => void
  onSkip: () => void
}

export function PricingSection({ onUpgrade, onSkip }: PricingSectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <Crown className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4">
            Desbloquea FutureTask Premium
          </h1>
          <p className="text-xl text-muted-foreground">
            Accede a todas las funciones avanzadas y mejora tu productividad
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Free Plan */}
          <Card className="bg-black/20 backdrop-blur-xl border-gray-500/20">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Gratis</CardTitle>
              <div className="text-3xl font-bold text-foreground">
                $0<span className="text-sm font-normal">/mes</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-foreground">Hasta 20 tareas activas</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-foreground">Calendario básico</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-foreground">Logros básicos</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-foreground">4 temas básicos</span>
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border-yellow-500/30 relative">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              Recomendado
            </Badge>
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-yellow-400" />
                Premium
              </CardTitle>
              <div className="text-3xl font-bold text-foreground">
                $4.99<span className="text-sm font-normal">/mes</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-foreground">Tareas ilimitadas</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-foreground">Vista semanal avanzada</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-foreground">Temporizador Pomodoro</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-foreground">Todos los logros</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-foreground">Temas premium exclusivos</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-foreground">Estadísticas avanzadas</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-foreground">Sin anuncios</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => onUpgrade("yearly")}
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-8"
          >
            Obtener Premium Anual ($39.99/año)
          </Button>

          <Button
            onClick={() => onUpgrade("monthly")}
            variant="outline"
            size="lg"
            className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/20 px-8"
          >
            Mensual ($4.99/mes)
          </Button>

          <Button onClick={onSkip} variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
            Continuar Gratis
          </Button>
        </div>
      </div>
    </div>
  )
}

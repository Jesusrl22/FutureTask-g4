"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Sparkles, Trophy, Target } from "lucide-react"

interface WelcomeScreenProps {
  onGetStarted: () => void
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

      <Card className="w-full max-w-4xl bg-black/20 backdrop-blur-xl border-purple-500/20 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mb-6">
            <CalendarIcon className="w-12 h-12 text-white" />
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Bienvenido a FutureTask
          </CardTitle>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            La aplicación de productividad más avanzada con IA, gamificación y funciones premium
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Logros y Gamificación</h3>
              <p className="text-sm text-muted-foreground">
                Desbloquea logros únicos mientras completas tus tareas diarias
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <Target className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Seguimiento Inteligente</h3>
              <p className="text-sm text-muted-foreground">Estadísticas avanzadas y análisis de tu productividad</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-orange-400" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Funciones Premium</h3>
              <p className="text-sm text-muted-foreground">Vista semanal, temporizador Pomodoro y temas exclusivos</p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold text-lg px-8 py-3 transition-all duration-300"
            >
              Comenzar Ahora
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

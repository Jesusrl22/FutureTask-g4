"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"

interface WelcomeScreenProps {
  onGetStarted: () => void
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

      <Card className="w-full max-w-md bg-black/20 backdrop-blur-xl border-purple-500/20 shadow-2xl animate-scale-in">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mb-6 animate-bounce-in">
            <CalendarIcon className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Bienvenido a FutureTask
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2 text-lg">
            Tu calendario inteligente para organizar tu futuro.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground text-base">
            FutureTask te ayuda a gestionar tus tareas diarias, semanales y mensuales con una interfaz intuitiva y
            potentes herramientas de productividad.
          </p>
          <Button
            onClick={onGetStarted}
            className="w-full h-14 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold text-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Empezar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

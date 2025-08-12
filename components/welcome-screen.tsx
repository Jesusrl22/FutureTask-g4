"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Zap, Target, Trophy, Clock, Star, Sparkles, ArrowRight, Check } from "lucide-react"

interface WelcomeScreenProps {
  onGetStarted: () => void
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const features = [
    {
      icon: <CalendarIcon className="w-8 h-8" />,
      title: "Calendario Inteligente",
      description: "Organiza tus tareas con un calendario futurista y intuitivo",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Técnica Pomodoro",
      description: "Mejora tu productividad con sesiones de enfoque cronometradas",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Sistema de Logros",
      description: "Desbloquea logros y mantén tu motivación alta",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Metas Personalizadas",
      description: "Establece y alcanza tus objetivos diarios y semanales",
    },
  ]

  const steps = [
    {
      title: "¡Bienvenido a FutureTask!",
      description: "Tu asistente de productividad del futuro",
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto animate-bounce-in">
            <Zap className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              FutureTask
            </h1>
            <p className="text-xl text-white/80 mb-6">Organiza tu futuro, una tarea a la vez</p>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Versión 2.0
            </Badge>
          </div>
        </div>
      ),
    },
    {
      title: "Características Principales",
      description: "Descubre todo lo que puedes hacer",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/10 backdrop-blur-md border-white/20 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="text-purple-400 mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ),
    },
    {
      title: "¿Listo para comenzar?",
      description: "Empieza tu viaje hacia la máxima productividad",
      content: (
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">¡Todo listo!</h2>
            <p className="text-white/80 max-w-md mx-auto">
              Estás a punto de transformar tu productividad. Comienza creando tu primera tarea y descubre el poder de
              FutureTask.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Primeros pasos:</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <span className="text-white/80 text-sm">Crea tu primera tarea</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <span className="text-white/80 text-sm">Explora el calendario</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <span className="text-white/80 text-sm">Prueba el temporizador Pomodoro</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onGetStarted()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

      <Card className="w-full max-w-4xl bg-black/20 backdrop-blur-xl border-purple-500/20 shadow-2xl animate-scale-in">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "bg-purple-500 scale-125"
                    : index < currentStep
                      ? "bg-green-500"
                      : "bg-white/20"
                }`}
              />
            ))}
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">{steps[currentStep].title}</CardTitle>
          <p className="text-white/70 text-lg">{steps[currentStep].description}</p>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <div className="min-h-[400px] flex items-center justify-center">{steps[currentStep].content}</div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/20">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </Button>

            <div className="text-white/60 text-sm">
              {currentStep + 1} de {steps.length}
            </div>

            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold px-6"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Comenzar
                  <Star className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Siguiente
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

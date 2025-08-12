"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Crown, Check, X, Star, Sparkles, ArrowLeft, Palette, BarChart3, Headphones, Calendar } from "lucide-react"

interface PricingSectionProps {
  onUpgrade: (plan: "monthly" | "yearly") => void
  onSkip: () => void
}

export function PricingSection({ onUpgrade, onSkip }: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly" | null>(null)

  const monthlyPrice = 9.99
  const yearlyPrice = 99.99
  const yearlyMonthlyEquivalent = yearlyPrice / 12

  const features = {
    free: [
      { name: "Hasta 20 tareas activas", included: true },
      { name: "Calendario básico", included: true },
      { name: "Temporizador Pomodoro", included: true },
      { name: "Temas básicos", included: true },
      { name: "Sincronización en la nube", included: true },
      { name: "Temas premium", included: false },
      { name: "Estadísticas avanzadas", included: false },
      { name: "Tareas ilimitadas", included: false },
      { name: "Soporte prioritario", included: false },
      { name: "Sin anuncios", included: false },
    ],
    premium: [
      { name: "Tareas ilimitadas", included: true },
      { name: "Calendario avanzado", included: true },
      { name: "Temporizador Pomodoro Pro", included: true },
      { name: "Todos los temas premium", included: true },
      { name: "Sincronización en tiempo real", included: true },
      { name: "Estadísticas detalladas", included: true },
      { name: "Análisis de productividad", included: true },
      { name: "Exportación de datos", included: true },
      { name: "Soporte prioritario 24/7", included: true },
      { name: "Experiencia sin anuncios", included: true },
    ],
  }

  const handleUpgrade = (plan: "monthly" | "yearly") => {
    setSelectedPlan(plan)
    // En una implementación real, aquí se abriría PayPal
    // Por ahora, simulamos el upgrade
    setTimeout(() => {
      onUpgrade(plan)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Button variant="ghost" onClick={onSkip} className="absolute top-4 left-4 text-white hover:bg-white/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continuar gratis
          </Button>

          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
            <Crown className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4">
            Desbloquea tu Potencial
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Lleva tu productividad al siguiente nivel con FutureTask Premium
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Label htmlFor="billing-toggle" className="text-white">
              Mensual
            </Label>
            <Switch id="billing-toggle" checked={isYearly} onCheckedChange={setIsYearly} />
            <Label htmlFor="billing-toggle" className="text-white">
              Anual
            </Label>
            {isYearly && <Badge className="bg-green-500 text-white border-0 ml-2">Ahorra 17%</Badge>}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 relative">
            <CardHeader className="text-center pb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">Plan Gratuito</CardTitle>
              <div className="text-4xl font-bold text-white mb-2">
                $0
                <span className="text-lg font-normal text-white/60">/mes</span>
              </div>
              <p className="text-white/70">Perfecto para empezar</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                {features.free.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? "text-white" : "text-white/50"}`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={onSkip}
                variant="outline"
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Continuar Gratis
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-gradient-to-b from-yellow-500/20 to-orange-500/20 backdrop-blur-md border-yellow-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 text-sm font-semibold">
              <Sparkles className="w-4 h-4 inline mr-1" />
              Recomendado
            </div>

            <CardHeader className="text-center pb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">Plan Premium</CardTitle>
              <div className="text-4xl font-bold text-white mb-2">
                ${isYearly ? yearlyMonthlyEquivalent.toFixed(2) : monthlyPrice}
                <span className="text-lg font-normal text-white/60">/mes</span>
              </div>
              {isYearly && <p className="text-sm text-green-400">Facturado anualmente (${yearlyPrice}/año)</p>}
              <p className="text-white/70">Para profesionales ambiciosos</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                {features.premium.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-white">{feature.name}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                <Button
                  onClick={() => handleUpgrade(isYearly ? "yearly" : "monthly")}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold text-lg py-3"
                  disabled={selectedPlan !== null}
                >
                  {selectedPlan ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Procesando...
                    </div>
                  ) : (
                    <>
                      <Crown className="w-5 h-5 mr-2" />
                      Obtener Premium
                    </>
                  )}
                </Button>

                {/* PayPal Button (commented out for demo) */}
                {/* <PayPalButton
                  amount={isYearly ? yearlyPrice : monthlyPrice}
                  onSuccess={() => handleUpgrade(isYearly ? 'yearly' : 'monthly')}
                  onError={(error) => console.error('PayPal error:', error)}
                /> */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Premium Features Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center p-6">
            <Palette className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Temas Exclusivos</h3>
            <p className="text-white/70 text-sm">Accede a más de 20 temas premium diseñados por expertos</p>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center p-6">
            <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Análisis Avanzado</h3>
            <p className="text-white/70 text-sm">Obtén insights detallados sobre tu productividad y patrones</p>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center p-6">
            <Headphones className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Soporte 24/7</h3>
            <p className="text-white/70 text-sm">Recibe ayuda prioritaria cuando la necesites</p>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-8">Lo que dicen nuestros usuarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "María González",
                role: "Emprendedora",
                comment:
                  "FutureTask Premium transformó mi productividad. Los análisis me ayudan a optimizar mi tiempo.",
                rating: 5,
              },
              {
                name: "Carlos Ruiz",
                role: "Desarrollador",
                comment: "Los temas premium son increíbles y la sincronización en tiempo real es perfecta.",
                rating: 5,
              },
              {
                name: "Ana López",
                role: "Estudiante",
                comment: "El soporte 24/7 me salvó durante mis exámenes finales. Totalmente recomendado.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 p-6">
                <div className="flex justify-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/80 text-sm mb-4 italic">"{testimonial.comment}"</p>
                <div className="text-white font-semibold text-sm">{testimonial.name}</div>
                <div className="text-white/60 text-xs">{testimonial.role}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Preguntas Frecuentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "¿Puedo cancelar en cualquier momento?",
                answer: "Sí, puedes cancelar tu suscripción en cualquier momento sin penalizaciones.",
              },
              {
                question: "¿Hay garantía de devolución?",
                answer: "Ofrecemos una garantía de devolución de 30 días si no estás satisfecho.",
              },
              {
                question: "¿Mis datos están seguros?",
                answer: "Utilizamos encriptación de nivel bancario para proteger toda tu información.",
              },
              {
                question: "¿Funciona offline?",
                answer: "Sí, puedes usar FutureTask offline y se sincronizará cuando tengas conexión.",
              },
            ].map((faq, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 p-4 text-left">
                <h3 className="text-white font-semibold mb-2">{faq.question}</h3>
                <p className="text-white/70 text-sm">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

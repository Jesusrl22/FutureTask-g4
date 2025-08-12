"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

      <Card className="w-full max-w-md bg-black/20 backdrop-blur-xl border-purple-500/20 shadow-2xl animate-scale-in">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
            <CalendarIcon className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            404
          </CardTitle>
          <p className="text-xl text-muted-foreground mt-2">Página no encontrada</p>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">Lo sentimos, la página que buscas no existe o ha sido movida.</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
            >
              <Link href="/es">
                <Home className="w-4 h-4 mr-2" />
                Ir al Inicio
              </Link>
            </Button>

            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver Atrás
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>¿Necesitas ayuda? Contacta con nuestro soporte.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react"

interface PomodoroSession {
  id: string
  type: "work" | "break"
  duration: number
  completedAt: string
}

export function PomodoroTimer() {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(25 * 60) // 25 minutes in seconds
  const [sessionType, setSessionType] = useState<"work" | "break">("work")
  const [sessions, setSessions] = useState<PomodoroSession[]>([])
  const [completedPomodoros, setCompletedPomodoros] = useState(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const originalTime = useRef(25 * 60)

  const workDuration = 25 * 60 // 25 minutes
  const shortBreakDuration = 5 * 60 // 5 minutes
  const longBreakDuration = 15 * 60 // 15 minutes

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            handleSessionComplete()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, time])

  const handleSessionComplete = () => {
    setIsRunning(false)

    // Add session to history
    const newSession: PomodoroSession = {
      id: Date.now().toString(),
      type: sessionType,
      duration: originalTime.current,
      completedAt: new Date().toISOString(),
    }
    setSessions((prev) => [newSession, ...prev])

    if (sessionType === "work") {
      setCompletedPomodoros((prev) => prev + 1)

      // Auto-start break
      const isLongBreak = (completedPomodoros + 1) % 4 === 0
      const breakDuration = isLongBreak ? longBreakDuration : shortBreakDuration

      setSessionType("break")
      setTime(breakDuration)
      originalTime.current = breakDuration

      // Play notification sound and show notification
      playNotificationSound()
      showNotification("¡Pomodoro Completado! 🍅", "Hora de tomar un descanso")
    } else {
      // Break completed, start work session
      setSessionType("work")
      setTime(workDuration)
      originalTime.current = workDuration

      playNotificationSound()
      showNotification("Descanso Terminado ☕", "¡Hora de volver al trabajo!")
    }
  }

  const playNotificationSound = () => {
    try {
      const audio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OSnTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
      )
      audio.volume = 0.5
      audio.play().catch(() => {})
    } catch (e) {
      // Ignore audio errors
    }
  }

  const showNotification = (title: string, body: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
        requireInteraction: true,
      })
    }
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTime(originalTime.current)
  }

  const startWorkSession = () => {
    setSessionType("work")
    setTime(workDuration)
    originalTime.current = workDuration
    setIsRunning(false)
  }

  const startBreakSession = (duration: number) => {
    setSessionType("break")
    setTime(duration)
    originalTime.current = duration
    setIsRunning(false)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getProgress = () => {
    return ((originalTime.current - time) / originalTime.current) * 100
  }

  const getTodaySessions = () => {
    const today = new Date().toDateString()
    return sessions.filter((session) => new Date(session.completedAt).toDateString() === today)
  }

  const getTodayWorkSessions = () => {
    return getTodaySessions().filter((session) => session.type === "work").length
  }

  return (
    <div className="space-y-6">
      {/* Main Timer Card */}
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-foreground flex items-center">
              {sessionType === "work" ? (
                <>
                  <Brain className="w-6 h-6 mr-2 text-purple-400" />
                  Sesión de Trabajo
                </>
              ) : (
                <>
                  <Coffee className="w-6 h-6 mr-2 text-cyan-400" />
                  Descanso
                </>
              )}
            </CardTitle>
            <Badge className={sessionType === "work" ? "bg-purple-500" : "bg-cyan-500"}>
              {sessionType === "work" ? "TRABAJO" : "DESCANSO"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div
              className={`text-6xl md:text-8xl font-mono font-bold transition-colors duration-300 ${
                time <= 60 ? "text-red-400 animate-pulse" : sessionType === "work" ? "text-purple-400" : "text-cyan-400"
              }`}
            >
              {formatTime(time)}
            </div>

            <Progress
              value={getProgress()}
              className={`h-2 mt-4 transition-all duration-300 ${
                sessionType === "work" ? "[&>div]:bg-purple-500" : "[&>div]:bg-cyan-500"
              }`}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={toggleTimer}
              size="lg"
              className={`px-8 py-3 ${
                sessionType === "work" ? "bg-purple-500 hover:bg-purple-600" : "bg-cyan-500 hover:bg-cyan-600"
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar
                </>
              )}
            </Button>

            <Button
              onClick={resetTimer}
              variant="outline"
              size="lg"
              className="px-8 py-3 border-gray-500/30 text-muted-foreground hover:bg-gray-500/20 bg-transparent"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reiniciar
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              onClick={startWorkSession}
              variant="outline"
              size="sm"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20 bg-transparent"
            >
              25 min Trabajo
            </Button>
            <Button
              onClick={() => startBreakSession(shortBreakDuration)}
              variant="outline"
              size="sm"
              className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
            >
              5 min Descanso
            </Button>
            <Button
              onClick={() => startBreakSession(longBreakDuration)}
              variant="outline"
              size="sm"
              className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
            >
              15 min Descanso Largo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Estadísticas de Hoy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="text-2xl font-bold text-purple-400">{getTodayWorkSessions()}</div>
              <div className="text-sm text-muted-foreground">Pomodoros</div>
            </div>

            <div className="text-center p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <div className="text-2xl font-bold text-cyan-400">
                {getTodaySessions().filter((s) => s.type === "break").length}
              </div>
              <div className="text-sm text-muted-foreground">Descansos</div>
            </div>

            <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-2xl font-bold text-green-400">
                {Math.floor((getTodayWorkSessions() * 25) / 60)}h {(getTodayWorkSessions() * 25) % 60}m
              </div>
              <div className="text-sm text-muted-foreground">Tiempo Trabajo</div>
            </div>

            <div className="text-center p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="text-2xl font-bold text-yellow-400">{completedPomodoros}</div>
              <div className="text-sm text-muted-foreground">Total Completados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      {getTodaySessions().length > 0 && (
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Sesiones de Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {getTodaySessions()
                .slice(0, 5)
                .map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      session.type === "work"
                        ? "bg-purple-500/10 border border-purple-500/20"
                        : "bg-cyan-500/10 border border-cyan-500/20"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {session.type === "work" ? (
                        <Brain className="w-4 h-4 text-purple-400" />
                      ) : (
                        <Coffee className="w-4 h-4 text-cyan-400" />
                      )}
                      <span className="text-sm text-foreground">
                        {session.type === "work" ? "Trabajo" : "Descanso"}
                      </span>
                      <span className="text-xs text-muted-foreground">({Math.floor(session.duration / 60)} min)</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(session.completedAt).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

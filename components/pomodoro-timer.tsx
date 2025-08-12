"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw, Coffee, Zap, Volume2, VolumeX } from "lucide-react"

interface PomodoroTimerProps {
  preferences: {
    pomodoroTime: number
    shortBreakTime: number
    longBreakTime: number
    longBreakInterval: number
    autoStartBreaks: boolean
    autoStartPomodoros: boolean
    soundEnabled: boolean
  }
  onClose: () => void
  onComplete: (sessionType: "focus" | "break") => void
}

type SessionType = "focus" | "shortBreak" | "longBreak"

export function PomodoroTimer({ preferences, onClose, onComplete }: PomodoroTimerProps) {
  const [sessionType, setSessionType] = useState<SessionType>("focus")
  const [timeLeft, setTimeLeft] = useState(preferences.pomodoroTime * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [totalFocusTime, setTotalFocusTime] = useState(0)
  const [currentTask, setCurrentTask] = useState<string>("")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const getSessionDuration = (type: SessionType) => {
    switch (type) {
      case "focus":
        return preferences.pomodoroTime * 60
      case "shortBreak":
        return preferences.shortBreakTime * 60
      case "longBreak":
        return preferences.longBreakTime * 60
    }
  }

  const getSessionTitle = (type: SessionType) => {
    switch (type) {
      case "focus":
        return "Sesión de Enfoque"
      case "shortBreak":
        return "Descanso Corto"
      case "longBreak":
        return "Descanso Largo"
    }
  }

  const getSessionColor = (type: SessionType) => {
    switch (type) {
      case "focus":
        return "from-red-500 to-orange-500"
      case "shortBreak":
        return "from-green-500 to-emerald-500"
      case "longBreak":
        return "from-blue-500 to-cyan-500"
    }
  }

  const playSound = () => {
    if (preferences.soundEnabled && audioRef.current) {
      audioRef.current.play().catch(console.error)
    }
  }

  const startTimer = () => {
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          completeSession()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const pauseTimer = () => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const resetTimer = () => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setTimeLeft(getSessionDuration(sessionType))
  }

  const completeSession = () => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    playSound()
    onComplete(sessionType === "focus" ? "focus" : "break")

    if (sessionType === "focus") {
      setSessionsCompleted((prev) => prev + 1)
      setTotalFocusTime((prev) => prev + preferences.pomodoroTime)

      // Determine next session type
      const nextSessionsCompleted = sessionsCompleted + 1
      const shouldTakeLongBreak = nextSessionsCompleted % preferences.longBreakInterval === 0
      const nextSessionType = shouldTakeLongBreak ? "longBreak" : "shortBreak"

      setSessionType(nextSessionType)
      setTimeLeft(getSessionDuration(nextSessionType))

      if (preferences.autoStartBreaks) {
        setTimeout(startTimer, 1000)
      }
    } else {
      // Break completed, switch to focus
      setSessionType("focus")
      setTimeLeft(getSessionDuration("focus"))

      if (preferences.autoStartPomodoros) {
        setTimeout(startTimer, 1000)
      }
    }
  }

  const switchSession = (type: SessionType) => {
    pauseTimer()
    setSessionType(type)
    setTimeLeft(getSessionDuration(type))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getProgress = () => {
    const totalDuration = getSessionDuration(sessionType)
    return ((totalDuration - timeLeft) / totalDuration) * 100
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Update document title with timer
    if (typeof document !== "undefined") {
      document.title = isRunning
        ? `${formatTime(timeLeft)} - ${getSessionTitle(sessionType)}`
        : "FutureTask - Pomodoro Timer"
    }

    return () => {
      if (typeof document !== "undefined") {
        document.title = "FutureTask"
      }
    }
  }, [timeLeft, isRunning, sessionType])

  return (
    <div className="w-full max-w-md mx-auto">
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/notification.mp3" type="audio/mpeg" />
      </audio>

      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-between mb-4">
          <Badge className={`bg-gradient-to-r ${getSessionColor(sessionType)} text-white border-0`}>
            {sessionType === "focus" ? <Zap className="w-4 h-4 mr-1" /> : <Coffee className="w-4 h-4 mr-1" />}
            {getSessionTitle(sessionType)}
          </Badge>

          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            ✕
          </Button>
        </div>

        <CardTitle className="text-white text-lg">Sesión {sessionsCompleted + 1}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className="relative w-48 h-48 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-8 border-white/20"></div>
            <div
              className={`absolute inset-0 rounded-full border-8 border-transparent bg-gradient-to-r ${getSessionColor(sessionType)} transition-all duration-1000`}
              style={{
                background: `conic-gradient(from 0deg, transparent ${100 - getProgress()}%, rgba(139, 92, 246, 0.8) ${100 - getProgress()}%)`,
                mask: "radial-gradient(circle, transparent 70%, black 70%)",
                WebkitMask: "radial-gradient(circle, transparent 70%, black 70%)",
              }}
            ></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-white mb-2">{formatTime(timeLeft)}</div>
              <div className="text-sm text-white/60">{Math.round(getProgress())}% completado</div>
            </div>
          </div>

          <Progress value={getProgress()} className="w-full h-2 mb-4" />
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={isRunning ? pauseTimer : startTimer}
            className={`bg-gradient-to-r ${getSessionColor(sessionType)} hover:opacity-90 text-white px-8 py-3`}
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
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* Session Switcher */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">Cambiar sesión:</label>
          <Select value={sessionType} onValueChange={(value: SessionType) => switchSession(value)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="focus">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Enfoque ({preferences.pomodoroTime}m)</span>
                </div>
              </SelectItem>
              <SelectItem value="shortBreak">
                <div className="flex items-center space-x-2">
                  <Coffee className="w-4 h-4" />
                  <span>Descanso Corto ({preferences.shortBreakTime}m)</span>
                </div>
              </SelectItem>
              <SelectItem value="longBreak">
                <div className="flex items-center space-x-2">
                  <Coffee className="w-4 h-4" />
                  <span>Descanso Largo ({preferences.longBreakTime}m)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Current Task Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Tarea actual (opcional):</label>
          <input
            type="text"
            value={currentTask}
            onChange={(e) => setCurrentTask(e.target.value)}
            placeholder="¿En qué estás trabajando?"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{sessionsCompleted}</div>
            <div className="text-sm text-white/60">Sesiones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{totalFocusTime}m</div>
            <div className="text-sm text-white/60">Tiempo Total</div>
          </div>
        </div>

        {/* Sound Toggle */}
        <div className="flex items-center justify-center space-x-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // This would update preferences in the parent component
              // For now, we'll just show the current state
            }}
            className="text-white hover:bg-white/20"
          >
            {preferences.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          <span className="text-sm text-white/60">Sonido {preferences.soundEnabled ? "activado" : "desactivado"}</span>
        </div>
      </CardContent>
    </div>
  )
}

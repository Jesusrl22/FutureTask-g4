"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Settings } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const DEFAULT_WORK_TIME = 25 * 60 // 25 minutes in seconds
const DEFAULT_BREAK_TIME = 5 * 60 // 5 minutes in seconds
const DEFAULT_LONG_BREAK_TIME = 15 * 60 // 15 minutes in seconds
const DEFAULT_POMODOROS_UNTIL_LONG_BREAK = 4

export function PomodoroTimer() {
  const [time, setTime] = useState(DEFAULT_WORK_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [isWorkTime, setIsWorkTime] = useState(true)
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  // Settings states
  const [workDuration, setWorkDuration] = useState(DEFAULT_WORK_TIME / 60)
  const [breakDuration, setBreakDuration] = useState(DEFAULT_BREAK_TIME / 60)
  const [longBreakDuration, setLongBreakDuration] = useState(DEFAULT_LONG_BREAK_TIME / 60)
  const [pomodorosUntilLongBreak, setPomodorosUntilLongBreak] = useState(DEFAULT_POMODOROS_UNTIL_LONG_BREAK)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playSound = useCallback(() => {
    if (soundEnabled) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      audioRef.current = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
      ) // Simple beep sound
      audioRef.current.volume = 0.5
      audioRef.current.play().catch(() => {})
    }
  }, [soundEnabled])

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsRunning(false)
    setIsWorkTime(true)
    setTime(workDuration * 60)
  }, [workDuration])

  const startTimer = useCallback(() => {
    if (isRunning) return

    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          playSound()
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
          setIsRunning(false)

          if (isWorkTime) {
            setPomodorosCompleted((prev) => prev + 1)
            if ((pomodorosCompleted + 1) % pomodorosUntilLongBreak === 0) {
              setIsWorkTime(false)
              return longBreakDuration * 60
            } else {
              setIsWorkTime(false)
              return breakDuration * 60
            }
          } else {
            setIsWorkTime(true)
            return workDuration * 60
          }
        }
        return prevTime - 1
      })
    }, 1000)
  }, [
    isRunning,
    isWorkTime,
    pomodorosCompleted,
    workDuration,
    breakDuration,
    longBreakDuration,
    pomodorosUntilLongBreak,
    playSound,
  ])

  const pauseTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsRunning(false)
  }, [])

  useEffect(() => {
    // Initialize time based on settings when component mounts or settings change
    setTime(isWorkTime ? workDuration * 60 : breakDuration * 60)
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [workDuration, breakDuration, isWorkTime])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleSaveSettings = () => {
    resetTimer() // Reset timer with new settings
    setShowSettings(false)
  }

  return (
    <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 animate-fade-in p-6 text-center">
      <CardHeader>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Modo Pomodoro
        </CardTitle>
        <p className="text-muted-foreground mt-2">{isWorkTime ? "¡Hora de Concentrarse!" : "¡Descanso!"}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-7xl font-bold tabular-nums text-foreground animate-pulse-text">{formatTime(time)}</div>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={isRunning ? pauseTimer : startTimer}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white shadow-lg"
          >
            {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
          </Button>
          <Button
            onClick={resetTimer}
            className="h-14 w-14 rounded-full bg-black/30 border border-gray-500/30 text-muted-foreground hover:bg-gray-700/30 shadow-lg"
          >
            <RotateCcw className="w-7 h-7" />
          </Button>
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-14 w-14 rounded-full bg-black/30 border border-green-500/30 text-green-300 hover:bg-green-700/30 shadow-lg"
              >
                <Settings className="w-7 h-7" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 backdrop-blur-xl border-green-500/30 text-foreground max-w-md animate-scale-in">
              <DialogHeader>
                <DialogTitle className="text-xl bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Configuración Pomodoro
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Ajusta los tiempos de trabajo y descanso.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="work-duration" className="text-foreground flex justify-between">
                    Duración del Trabajo: {workDuration} minutos
                  </Label>
                  <Slider
                    id="work-duration"
                    min={1}
                    max={60}
                    step={1}
                    value={[workDuration]}
                    onValueChange={(val) => setWorkDuration(val[0])}
                    className="[&>span:first-child]:h-2 [&>span:first-child]:bg-purple-500/30 [&>span:first-child>span]:bg-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="break-duration" className="text-foreground flex justify-between">
                    Duración del Descanso Corto: {breakDuration} minutos
                  </Label>
                  <Slider
                    id="break-duration"
                    min={1}
                    max={15}
                    step={1}
                    value={[breakDuration]}
                    onValueChange={(val) => setBreakDuration(val[0])}
                    className="[&>span:first-child]:h-2 [&>span:first-child]:bg-cyan-500/30 [&>span:first-child>span]:bg-cyan-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="long-break-duration" className="text-foreground flex justify-between">
                    Duración del Descanso Largo: {longBreakDuration} minutos
                  </Label>
                  <Slider
                    id="long-break-duration"
                    min={5}
                    max={30}
                    step={1}
                    value={[longBreakDuration]}
                    onValueChange={(val) => setLongBreakDuration(val[0])}
                    className="[&>span:first-child]:h-2 [&>span:first-child]:bg-orange-500/30 [&>span:first-child>span]:bg-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pomodoros-until-long-break" className="text-foreground flex justify-between">
                    Pomodoros hasta Descanso Largo: {pomodorosUntilLongBreak}
                  </Label>
                  <Slider
                    id="pomodoros-until-long-break"
                    min={1}
                    max={10}
                    step={1}
                    value={[pomodorosUntilLongBreak]}
                    onValueChange={(val) => setPomodorosUntilLongBreak(val[0])}
                    className="[&>span:first-child]:h-2 [&>span:first-child]:bg-red-500/30 [&>span:first-child>span]:bg-red-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound-enabled" className="text-foreground">
                    Sonido de Notificación
                  </Label>
                  <Switch
                    id="sound-enabled"
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
                <Button
                  onClick={handleSaveSettings}
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300"
                >
                  Guardar Configuración
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-muted-foreground text-sm">Pomodoros Completados: {pomodorosCompleted}</p>
      </CardContent>
    </Card>
  )
}

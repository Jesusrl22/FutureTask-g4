"use client"

import { useState } from "react"
import { format, startOfWeek, addDays, isSameDay, isToday } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, Plus, Clock, CheckCircle, Circle } from "lucide-react"

interface Task {
  id: string
  title: string
  description?: string
  date: Date
  completed: boolean
  priority: "low" | "medium" | "high"
  category: string
  estimatedTime?: number
}

interface WeeklyViewProps {
  tasks: Task[]
  selectedDate: Date
  onDateChange: (date: Date) => void
  onTaskClick: (task: Task) => void
  onTaskComplete: (taskId: string) => void
}

export function WeeklyView({ tasks, selectedDate, onDateChange, onTaskClick, onTaskComplete }: WeeklyViewProps) {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(selectedDate, { weekStartsOn: 1 }))

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i))

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = addDays(currentWeek, direction === "prev" ? -7 : 7)
    setCurrentWeek(newWeek)
  }

  const getTasksForDay = (date: Date) => {
    return tasks.filter((task) => isSameDay(task.date, date))
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-300 border-green-500/30"
    }
  }

  const getTotalTimeForDay = (date: Date) => {
    const dayTasks = getTasksForDay(date)
    return dayTasks.reduce((total, task) => total + (task.estimatedTime || 0), 0)
  }

  const getCompletedTasksForDay = (date: Date) => {
    const dayTasks = getTasksForDay(date)
    return dayTasks.filter((task) => task.completed).length
  }

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWeek("prev")}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <h2 className="text-2xl font-bold text-white">{format(currentWeek, "MMMM yyyy", { locale: es })}</h2>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWeek("next")}
            className="text-white hover:bg-white/20"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <Button
          onClick={() => {
            const today = new Date()
            setCurrentWeek(startOfWeek(today, { weekStartsOn: 1 }))
            onDateChange(today)
          }}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          Hoy
        </Button>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const dayTasks = getTasksForDay(day)
          const completedTasks = getCompletedTasksForDay(day)
          const totalTime = getTotalTimeForDay(day)
          const isCurrentDay = isToday(day)
          const isSelected = isSameDay(day, selectedDate)

          return (
            <Card
              key={index}
              className={`bg-white/10 backdrop-blur-md border-white/20 transition-all duration-200 hover:bg-white/20 cursor-pointer ${
                isCurrentDay ? "ring-2 ring-purple-500/50" : ""
              } ${isSelected ? "bg-purple-500/20 border-purple-500/30" : ""}`}
              onClick={() => onDateChange(day)}
            >
              <CardContent className="p-4">
                {/* Day Header */}
                <div className="text-center mb-4">
                  <div className="text-sm text-white/60 font-medium">{format(day, "EEEE", { locale: es })}</div>
                  <div className={`text-2xl font-bold ${isCurrentDay ? "text-purple-400" : "text-white"}`}>
                    {format(day, "d")}
                  </div>
                  {dayTasks.length > 0 && (
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <Badge variant="secondary" className="text-xs bg-white/10 text-white/80">
                        {completedTasks}/{dayTasks.length}
                      </Badge>
                      {totalTime > 0 && (
                        <Badge variant="secondary" className="text-xs bg-white/10 text-white/80">
                          <Clock className="w-3 h-3 mr-1" />
                          {totalTime}m
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Tasks List */}
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {dayTasks.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-white/40 text-sm mb-2">Sin tareas</div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDateChange(day)
                            // Aquí podrías abrir un diálogo para crear tarea
                          }}
                          className="text-white/60 hover:bg-white/20 text-xs"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Agregar
                        </Button>
                      </div>
                    ) : (
                      dayTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-2 rounded-lg border transition-all duration-200 hover:bg-white/10 cursor-pointer ${
                            task.completed
                              ? "bg-green-500/10 border-green-500/20 opacity-60"
                              : "bg-white/5 border-white/10"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            onTaskClick(task)
                          }}
                        >
                          <div className="flex items-start space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                onTaskComplete(task.id)
                              }}
                              className="p-0 h-auto text-white hover:bg-white/20 mt-0.5"
                            >
                              {task.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <Circle className="w-4 h-4 text-white/60" />
                              )}
                            </Button>

                            <div className="flex-1 min-w-0">
                              <div
                                className={`text-sm font-medium text-white truncate ${
                                  task.completed ? "line-through opacity-60" : ""
                                }`}
                              >
                                {task.title}
                              </div>

                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={`${getPriorityColor(task.priority)} text-xs px-1 py-0`}>
                                  {task.priority}
                                </Badge>

                                {task.estimatedTime && (
                                  <div className="flex items-center text-xs text-white/60">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {task.estimatedTime}m
                                  </div>
                                )}
                              </div>

                              {task.description && (
                                <div
                                  className={`text-xs text-white/60 mt-1 truncate ${
                                    task.completed ? "line-through opacity-60" : ""
                                  }`}
                                >
                                  {task.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                {/* Day Summary */}
                {dayTasks.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/20">
                    <div className="flex justify-between items-center text-xs text-white/60">
                      <span>Progreso del día</span>
                      <span>{Math.round((completedTasks / dayTasks.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 mt-1">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(completedTasks / dayTasks.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Week Summary */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Resumen de la Semana</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {tasks.filter((task) => weekDays.some((day) => isSameDay(task.date, day))).length}
              </div>
              <div className="text-sm text-white/60">Total Tareas</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {tasks.filter((task) => task.completed && weekDays.some((day) => isSameDay(task.date, day))).length}
              </div>
              <div className="text-sm text-white/60">Completadas</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {tasks.filter((task) => !task.completed && weekDays.some((day) => isSameDay(task.date, day))).length}
              </div>
              <div className="text-sm text-white/60">Pendientes</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {tasks
                  .filter((task) => weekDays.some((day) => isSameDay(task.date, day)))
                  .reduce((total, task) => total + (task.estimatedTime || 0), 0)}
                m
              </div>
              <div className="text-sm text-white/60">Tiempo Total</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

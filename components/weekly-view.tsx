"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Edit, X } from "lucide-react"
import { useState } from "react"

interface Task {
  id: string
  user_id: string
  text: string
  completed: boolean
  date: string
  priority: "low" | "medium" | "high"
  category: string
  notes?: string
  completed_at?: string
  reminder_time?: string
  notified?: boolean
}

interface WeeklyViewProps {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  tasks: Task[]
  getTasksForDate: (date: Date) => Task[]
  getPriorityColor: (priority: Task["priority"]) => string
  getCategoryInfo: (categoryId: string) => { id: string; name: string; color: string }
  toggleTask: (taskId: string) => void
  openEditDialog: (task: Task) => void
  deleteTask: (taskId: string) => void
}

export function WeeklyView({
  selectedDate,
  setSelectedDate,
  tasks,
  getTasksForDate,
  getPriorityColor,
  getCategoryInfo,
  toggleTask,
  openEditDialog,
  deleteTask,
}: WeeklyViewProps) {
  const [currentWeek, setCurrentWeek] = useState(() => {
    const date = new Date(selectedDate)
    const day = date.getDay()
    const diff = date.getDate() - day
    return new Date(date.setDate(diff))
  })

  const getWeekDays = () => {
    const days = []
    const startDate = new Date(currentWeek)

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate)
      day.setDate(startDate.getDate() + i)
      days.push(day)
    }

    return days
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7))
    setCurrentWeek(newWeek)
  }

  const weekDays = getWeekDays()
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  return (
    <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Vista Semanal</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => navigateWeek("prev")}
              variant="ghost"
              size="sm"
              className="text-foreground hover:bg-purple-500/20"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-foreground font-medium">
              {currentWeek.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
            </span>
            <Button
              onClick={() => navigateWeek("next")}
              variant="ghost"
              size="sm"
              className="text-foreground hover:bg-purple-500/20"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const dayTasks = getTasksForDate(day)
            const isToday = day.toDateString() === new Date().toDateString()
            const isSelected = day.toDateString() === selectedDate.toDateString()

            return (
              <div
                key={day.toISOString()}
                className={`min-h-32 p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-purple-500/20 border-purple-500/50"
                    : isToday
                      ? "bg-cyan-500/10 border-cyan-500/30"
                      : "bg-gray-800/30 border-gray-700/30 hover:border-purple-500/30"
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="text-center mb-2">
                  <div className="text-xs text-muted-foreground font-medium">{dayNames[index]}</div>
                  <div className={`text-lg font-bold ${isToday ? "text-cyan-400" : "text-foreground"}`}>
                    {day.getDate()}
                  </div>
                </div>

                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => {
                    const categoryInfo = getCategoryInfo(task.category)
                    return (
                      <div
                        key={task.id}
                        className={`text-xs p-1 rounded border-l-2 ${getPriorityColor(task.priority)} ${
                          task.completed ? "opacity-60 line-through" : ""
                        } bg-black/20`}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleTask(task.id)
                        }}
                      >
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${categoryInfo.color} flex-shrink-0`} />
                          <span className="truncate text-foreground">{task.text}</span>
                        </div>
                      </div>
                    )
                  })}

                  {dayTasks.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">+{dayTasks.length - 3} más</div>
                  )}

                  {dayTasks.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-2">Sin tareas</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Task details for selected day */}
        <div className="mt-6 pt-4 border-t border-gray-700/30">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Tareas para{" "}
            {selectedDate.toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h3>

          <div className="space-y-2">
            {getTasksForDate(selectedDate).map((task) => {
              const categoryInfo = getCategoryInfo(task.category)
              return (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3 rounded-lg border border-l-4 transition-all duration-300 ${
                    task.completed ? "bg-green-500/10 border-green-500/30" : "bg-gray-800/30 border-gray-700/30"
                  } ${getPriorityColor(task.priority)}`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-4 h-4 rounded border-2 border-purple-500/50"
                    />
                    <div className="flex-1">
                      <span className={`${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {task.text}
                      </span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={`${categoryInfo.color} text-white text-xs`}>{categoryInfo.name}</Badge>
                        {task.reminder_time && (
                          <Badge variant="outline" className="text-xs">
                            {task.reminder_time}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(task)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-8 w-8"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}

            {getTasksForDate(selectedDate).length === 0 && (
              <div className="text-muted-foreground text-center py-8">
                <p>No hay tareas para este día</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

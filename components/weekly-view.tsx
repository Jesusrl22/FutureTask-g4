"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Edit, X, AlertCircle, Clock } from "lucide-react"

interface Task {
  id: string
  text: string
  completed: boolean
  date: string
  priority: "low" | "medium" | "high"
  category: string
  notes?: string
  completedAt?: string
  reminderTime?: string
  notified?: boolean
}

interface CategoryInfo {
  id: string
  name: string
  color: string
}

interface WeeklyViewProps {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  tasks: Task[]
  getTasksForDate: (date: Date) => Task[]
  getPriorityColor: (priority: Task["priority"]) => string
  getCategoryInfo: (categoryId: string) => CategoryInfo
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
  // Helper to get the start of the week (Monday)
  const getStartOfWeek = (date: Date) => {
    const day = date.getDay() // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust to Monday (1)
    const monday = new Date(date.getFullYear(), date.getMonth(), diff)
    monday.setHours(0, 0, 0, 0) // Normalize to start of day
    return monday
  }

  const startOfWeek = getStartOfWeek(selectedDate)

  const daysOfWeek = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    return day
  })

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setSelectedDate(newDate)
  }

  return (
    <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center justify-between">
          <Button
            onClick={() => navigateWeek("prev")}
            variant="ghost"
            size="sm"
            className="text-foreground hover:bg-purple-500/20 h-10 w-10 lg:h-8 lg:w-8 transition-colors duration-300"
          >
            <ChevronLeft className="w-5 h-5 lg:w-4 lg:h-4" />
          </Button>
          <span className="text-lg lg:text-xl font-bold">
            Semana del{" "}
            {startOfWeek.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
            })}{" "}
            -{" "}
            {new Date(startOfWeek.setDate(startOfWeek.getDate() + 6)).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <Button
            onClick={() => navigateWeek("next")}
            variant="ghost"
            size="sm"
            className="text-foreground hover:bg-purple-500/20 h-10 w-10 lg:h-8 lg:w-8 transition-colors duration-300"
          >
            <ChevronRight className="w-5 h-5 lg:w-4 lg:h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 overflow-x-auto pb-4">
        {daysOfWeek.map((day) => {
          const tasksForDay = getTasksForDate(day)
          const isSelectedDay = day.toDateString() === selectedDate.toDateString()
          const isToday = day.toDateString() === new Date().toDateString()

          return (
            <div
              key={day.toISOString()}
              className={`flex flex-col p-3 rounded-lg border ${
                isSelectedDay
                  ? "border-purple-500 ring-2 ring-purple-500 bg-purple-900/20"
                  : isToday
                    ? "border-cyan-500/30 bg-cyan-900/10"
                    : "border-gray-700/50 bg-gray-800/30"
              } transition-all duration-300 min-w-[200px] lg:min-w-0`}
            >
              <h4 className={`font-semibold text-center mb-3 ${isSelectedDay ? "text-white" : "text-foreground"}`}>
                {day.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}
              </h4>
              <div className="flex-1 space-y-2">
                {tasksForDay.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center">Sin tareas</p>
                ) : (
                  tasksForDay.map((task) => {
                    const categoryInfo = getCategoryInfo(task.category)
                    return (
                      <div
                        key={task.id}
                        className={`flex items-center space-x-2 p-2 rounded-md border border-l-4 ${getPriorityColor(
                          task.priority,
                        )} ${task.completed ? "bg-green-500/10" : "bg-gray-700/30"}`}
                      >
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                          className="border-purple-500/50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-cyan-500 w-4 h-4"
                        />
                        <div className="flex-1">
                          <span
                            className={`text-sm ${task.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
                          >
                            {task.text}
                          </span>
                          <div className="flex items-center space-x-1 mt-1">
                            <Badge
                              className={`text-xs px-1 py-0.5 ${categoryInfo.color} text-white`}
                              variant="secondary"
                            >
                              {categoryInfo.name}
                            </Badge>
                            {task.priority === "high" && (
                              <AlertCircle className="w-3 h-3 text-red-400" title="Prioridad Alta" />
                            )}
                            {task.reminderTime && (
                              <div className="flex items-center space-x-0.5">
                                <Clock className="w-3 h-3 text-blue-400" />
                                <span className="text-xs text-blue-400">{task.reminderTime}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(task)}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-6 w-6"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(task.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-6 w-6"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
              <Button
                onClick={() => setSelectedDate(day)}
                className="w-full mt-3 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-all duration-300"
                variant="outline"
              >
                Ver Día
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

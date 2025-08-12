"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Trophy,
  CalendarIcon,
  Star,
  Target,
  Award,
  Zap,
  Settings,
  BarChart3,
  Flame,
  CalendarDays,
  TrendingUp,
  Coffee,
  Moon,
  Sun,
  Menu,
  X,
  Search,
  Bell,
  CalendarSearch,
  Gem,
  Sparkles,
  Globe,
} from "lucide-react"

import { PricingSection } from "@/components/pricing-section"
import { WelcomeScreen } from "@/components/welcome-screen"
import { supabase } from "@/lib/supabase"
import { useTranslations } from "next-intl"
import { useRouter, usePathname } from "next/navigation"

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

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  unlockedAt?: string
  rarity: "common" | "rare" | "epic" | "legendary"
  premium?: boolean
}

interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "task" | "achievement" | "reminder" | "streak"
  timestamp: string
  read: boolean
  task_id?: string
}

interface NotificationSettings {
  enabled: boolean
  taskReminders: boolean
  achievementAlerts: boolean
  streakReminders: boolean
  dailyMotivation: boolean
  reminderTime: string
}

interface Country {
  code: string
  name: string
  timezone: string
  flag: string
}

interface UserProfile {
  id: string
  email: string
  name: string
  country: string
  timezone: string
  joined_at: string
  last_active: string
  is_premium: boolean
  subscription_type: "free" | "monthly" | "yearly"
  notification_settings?: NotificationSettings
  theme?: string
}

const COUNTRIES: Country[] = [
  { code: "AR", name: "Argentina", timezone: "America/Argentina/Buenos_Aires", flag: "🇦🇷" },
  { code: "MX", name: "México", timezone: "America/Mexico_City", flag: "🇲🇽" },
  { code: "ES", name: "España", timezone: "Europe/Madrid", flag: "🇪🇸" },
  { code: "CO", name: "Colombia", timezone: "America/Bogota", flag: "🇨🇴" },
  { code: "PE", name: "Perú", timezone: "America/Lima", flag: "🇵🇪" },
  { code: "CL", name: "Chile", timezone: "America/Santiago", flag: "🇨🇱" },
  { code: "VE", name: "Venezuela", timezone: "America/Caracas", flag: "🇻🇪" },
  { code: "EC", name: "Ecuador", timezone: "America/Guayaquil", flag: "🇪🇨" },
  { code: "UY", name: "Uruguay", timezone: "America/Montevideo", flag: "🇺🇾" },
  { code: "PY", name: "Paraguay", timezone: "America/Asuncion", flag: "🇵🇾" },
  { code: "BO", name: "Bolivia", timezone: "America/La_Paz", flag: "🇧🇴" },
  { code: "CR", name: "Costa Rica", timezone: "America/Costa_Rica", flag: "🇨🇷" },
  { code: "PA", name: "Panamá", timezone: "America/Panama", flag: "🇵🇦" },
  { code: "GT", name: "Guatemala", timezone: "America/Guatemala", flag: "🇬🇹" },
  { code: "HN", name: "Honduras", timezone: "America/Tegucigalpa", flag: "🇭🇳" },
  { code: "SV", name: "El Salvador", timezone: "America/El_Salvador", flag: "🇸🇻" },
  { code: "NI", name: "Nicaragua", timezone: "America/Managua", flag: "🇳🇮" },
  { code: "DO", name: "República Dominicana", timezone: "America/Santo_Domingo", flag: "🇩🇴" },
  { code: "CU", name: "Cuba", timezone: "America/Havana", flag: "🇨🇺" },
  { code: "US", name: "Estados Unidos", timezone: "America/New_York", flag: "🇺🇸" },
  { code: "BR", name: "Brasil", timezone: "America/Sao_Paulo", flag: "🇧🇷" },
  { code: "FR", name: "Francia", timezone: "Europe/Paris", flag: "🇫🇷" },
  { code: "IT", name: "Italia", timezone: "Europe/Rome", flag: "🇮🇹" },
  { code: "DE", name: "Alemania", timezone: "Europe/Berlin", flag: "🇩🇪" },
  { code: "GB", name: "Reino Unido", timezone: "Europe/London", flag: "🇬🇧" },
]

const TASK_CATEGORIES = [
  { id: "work", name: "Trabajo", color: "bg-blue-500" },
  { id: "personal", name: "Personal", color: "bg-green-500" },
  { id: "health", name: "Salud", color: "bg-red-500" },
  { id: "learning", name: "Aprendizaje", color: "bg-purple-500" },
  { id: "social", name: "Social", color: "bg-yellow-500" },
  { id: "other", name: "Otros", color: "bg-gray-500" },
]

const DEFAULT_ACHIEVEMENTS = [
  {
    id: "first-task",
    name: "Primer Paso",
    description: "Completa tu primera tarea",
    icon: <Star className="w-5 h-5" />,
    rarity: "common" as const,
    premium: false,
  },
  {
    id: "streak-3",
    name: "Calentando Motores",
    description: "Completa tareas 3 días seguidos",
    icon: <Zap className="w-5 h-5" />,
    rarity: "common" as const,
    premium: false,
  },
  {
    id: "streak-7",
    name: "Una Semana Fuerte",
    description: "Completa tareas 7 días seguidos",
    icon: <CalendarDays className="w-5 h-5" />,
    rarity: "rare" as const,
    premium: false,
  },
  {
    id: "streak-30",
    name: "Máquina Imparable",
    description: "Completa tareas 30 días seguidos",
    icon: <Flame className="w-5 h-5" />,
    rarity: "legendary" as const,
    premium: false,
  },
  {
    id: "task-master",
    name: "Maestro de Tareas",
    description: "Completa 50 tareas en total",
    icon: <Target className="w-5 h-5" />,
    rarity: "rare" as const,
    premium: false,
  },
  {
    id: "perfectionist",
    name: "Perfeccionista",
    description: "Completa todas las tareas de un día",
    icon: <Award className="w-5 h-5" />,
    rarity: "common" as const,
    premium: false,
  },
  {
    id: "early-bird",
    name: "Madrugador",
    description: "Completa 5 tareas antes de las 9 AM",
    icon: <Sun className="w-5 h-5" />,
    rarity: "rare" as const,
    premium: false,
  },
  {
    id: "night-owl",
    name: "Búho Nocturno",
    description: "Completa 5 tareas después de las 10 PM",
    icon: <Moon className="w-5 h-5" />,
    rarity: "rare" as const,
    premium: false,
  },
  {
    id: "productive-day",
    name: "Día Súper Productivo",
    description: "Completa 10 tareas en un solo día",
    icon: <TrendingUp className="w-5 h-5" />,
    rarity: "epic" as const,
    premium: false,
  },
  {
    id: "category-master",
    name: "Multifacético",
    description: "Completa tareas en todas las categorías",
    icon: <Coffee className="w-5 h-5" />,
    rarity: "epic" as const,
    premium: false,
  },
  {
    id: "centurion",
    name: "Centurión",
    description: "Completa 100 tareas en total",
    icon: <Trophy className="w-5 h-5" />,
    rarity: "legendary" as const,
    premium: false,
  },
  {
    id: "premium-streak-90",
    name: "Leyenda de la Productividad",
    description: "Completa tareas 90 días seguidos (Premium)",
    icon: <Sparkles className="w-5 h-5" />,
    rarity: "legendary" as const,
    premium: true,
  },
  {
    id: "premium-master-all",
    name: "Maestro Absoluto",
    description: "Completa 500 tareas en total (Premium)",
    icon: <Gem className="w-5 h-5" />,
    rarity: "legendary" as const,
    premium: true,
  },
] satisfies Omit<Achievement, "unlocked" | "unlockedAt">[]

const BASIC_THEMES = [
  {
    id: "default",
    name: "Default",
    background: "from-slate-900 via-purple-900 to-slate-900",
    accentColorRgba: "rgba(168, 85, 247, 0.3)",
    premium: false,
    isDark: true,
  },
  {
    id: "dark",
    name: "Oscuro",
    background: "from-gray-900 via-gray-800 to-gray-900",
    accentColorRgba: "rgba(100, 116, 139, 0.3)",
    premium: false,
    isDark: true,
  },
  {
    id: "light",
    name: "Claro",
    background: "from-gray-50 via-gray-100 to-gray-50",
    accentColorRgba: "rgba(59, 130, 246, 0.3)",
    premium: false,
    isDark: false,
  },
  {
    id: "forest",
    name: "Bosque",
    background: "from-green-950 via-green-900 to-green-950",
    accentColorRgba: "rgba(34, 197, 94, 0.3)",
    premium: false,
    isDark: true,
  },
]

const PREMIUM_THEMES = [
  {
    id: "futuristic",
    name: "Futurista",
    background: "from-blue-900 via-purple-900 to-pink-900",
    accentColorRgba: "rgba(59, 130, 246, 0.3)",
    premium: true,
    isDark: true,
  },
  {
    id: "neon",
    name: "Neón",
    background: "from-green-900 via-cyan-900 to-blue-900",
    accentColorRgba: "rgba(6, 182, 212, 0.3)",
    premium: true,
    isDark: true,
  },
]

const ALL_THEMES = [...BASIC_THEMES, ...PREMIUM_THEMES]

const MAX_FREE_TASKS = 20

const formatDateToLocal = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const formatDateForDisplay = (dateStr: string): string => {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const getRelativeDate = (dateStr: string): string => {
  const date = new Date(dateStr + "T00:00:00")
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (formatDateToLocal(date) === formatDateToLocal(today)) return "Hoy"
  if (formatDateToLocal(date) === formatDateToLocal(yesterday)) return "Ayer"
  if (formatDateToLocal(date) === formatDateToLocal(tomorrow)) return "Mañana"

  return formatDateForDisplay(dateStr)
}

export default function FutureTaskApp() {
  const t = useTranslations("Index")
  const router = useRouter()
  const pathname = usePathname()

  const [user, setUser] = useState<UserProfile | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [newTask, setNewTask] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium")
  const [newTaskCategory, setNewTaskCategory] = useState("personal")
  const [newTaskReminder, setNewTaskReminder] = useState("")
  const [achievements, setAchievements] = useState<Achievement[]>(
    DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false })),
  )
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: true,
    taskReminders: true,
    achievementAlerts: true,
    streakReminders: true,
    dailyMotivation: true,
    reminderTime: "09:00",
  })

  // Auth states
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const [country, setCountry] = useState("ES")
  const [profileCountry, setProfileCountry] = useState("ES")

  // Premium states
  const [showPricing, setShowPricing] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(BASIC_THEMES[0].id)

  // Profile states
  const [showProfile, setShowProfile] = useState(false)
  const [profileEmail, setProfileEmail] = useState("")
  const [profilePassword, setProfilePassword] = useState("")
  const [profileName, setProfileName] = useState("")

  // UI states
  const [showStats, setShowStats] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showDateSearch, setShowDateSearch] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [currentView, setCurrentView] = useState<"daily" | "weekly" | "pomodoro">("daily")

  // Date search
  const [dateSearchQuery, setDateSearchQuery] = useState("")

  // Edit task states
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editTaskText, setEditTaskText] = useState("")
  const [editTaskPriority, setEditTaskPriority] = useState<"low" | "medium" | "high">("medium")
  const [editTaskCategory, setEditTaskCategory] = useState("personal")
  const [editTaskReminder, setEditTaskReminder] = useState("")
  const [editTaskNotes, setEditTaskNotes] = useState("")

  // Function to change locale
  const onSelectChange = useCallback(
    (nextLocale: string) => {
      const newPath = `/${nextLocale}${pathname.substring(3)}`
      router.replace(newPath)
    },
    [pathname, router],
  )

  // Function to fetch user data, tasks, achievements, and notifications
  const fetchData = useCallback(
    async (supabaseUser: any) => {
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", supabaseUser.id)
        .single()

      if (profileError) {
        console.error("Error fetching user profile:", profileError)
        await supabase.auth.signOut()
        setUser(null)
        setShowWelcome(true)
        return
      }

      setUser(userProfile)
      setProfileEmail(userProfile.email)
      setProfileName(userProfile.name)
      setProfileCountry(userProfile.country || "ES")
      setShowPricing(!userProfile.is_premium)
      setShowWelcome(false)

      const savedNotificationSettings = localStorage.getItem("futureTask_notificationSettings")
      let initialNotificationSettings = notificationSettings

      if (userProfile.notification_settings) {
        initialNotificationSettings = userProfile.notification_settings
        if (savedNotificationSettings) {
          localStorage.removeItem("futureTask_notificationSettings")
        }
      } else if (savedNotificationSettings) {
        try {
          const parsedSettings = JSON.parse(savedNotificationSettings)
          const { error: updateError } = await supabase
            .from("users")
            .update({ notification_settings: parsedSettings })
            .eq("id", supabaseUser.id)
          if (updateError) console.error("Error migrating notification settings:", updateError)
          else {
            initialNotificationSettings = parsedSettings
            localStorage.removeItem("futureTask_notificationSettings")
          }
        } catch (e) {
          console.error("Error parsing notification settings from localStorage:", e)
          localStorage.removeItem("futureTask_notificationSettings")
        }
      }
      setNotificationSettings(initialNotificationSettings)

      const savedTheme = localStorage.getItem("futureTask_theme")
      let initialTheme = BASIC_THEMES[0].id

      if (userProfile.theme) {
        initialTheme = userProfile.theme
        if (savedTheme) {
          localStorage.removeItem("futureTask_theme")
        }
      } else if (savedTheme) {
        const { error: updateError } = await supabase
          .from("users")
          .update({ theme: savedTheme })
          .eq("id", supabaseUser.id)
        if (updateError) console.error("Error migrating theme:", updateError)
        else {
          initialTheme = savedTheme
          localStorage.removeItem("futureTask_theme")
        }
      }
      setCurrentTheme(initialTheme)

      const { data: fetchedTasks, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", supabaseUser.id)

      if (tasksError) console.error("Error fetching tasks:", tasksError)
      else setTasks(fetchedTasks || [])

      const { data: fetchedAchievements, error: achievementsError } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", supabaseUser.id)

      if (achievementsError) console.error("Error fetching achievements:", achievementsError)
      else {
        const parsedAchievements = fetchedAchievements || []
        setAchievements(
          DEFAULT_ACHIEVEMENTS.map((base) => {
            const saved = parsedAchievements.find((s: any) => s.id === base.id)
            return {
              ...base,
              unlocked: saved?.unlocked ?? false,
              unlockedAt: saved?.unlocked_at,
            }
          }),
        )
      }

      const { data: fetchedNotifications, error: notificationsError } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", supabaseUser.id)
        .order("timestamp", { ascending: false })

      if (notificationsError) console.error("Error fetching notifications:", notificationsError)
      else setNotifications(fetchedNotifications || [])
    },
    [notificationSettings],
  )

  const addNotification = useCallback(
    async (notification: Omit<Notification, "id" | "timestamp" | "read" | "user_id">) => {
      if (!user) return

      const { data, error } = await supabase
        .from("notifications")
        .insert({
          user_id: user.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          task_id: notification.task_id || null,
        })
        .select()
        .single()

      if (error) {
        console.error("Error adding notification:", error)
        return
      }

      setNotifications((prev) => [{ ...data, timestamp: data.timestamp }, ...prev])
    },
    [user],
  )

  const showBrowserNotification = useCallback((title: string, body: string, playSound = true) => {
    if (Notification.permission === "granted") {
      const notification = new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "futuretask",
        requireInteraction: false,
        silent: !playSound,
      })

      if (playSound) {
        try {
          const audio = new Audio(
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OSnTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
          )
          audio.volume = 0.3
          audio.play().catch(() => {})
        } catch (e) {
          // Fallback silencioso
        }
      }

      setTimeout(() => {
        notification.close()
      }, 5000)

      return notification
    }
    return null
  }, [])

  const checkTaskReminders = useCallback(async () => {
    if (!user || !notificationSettings.enabled || !notificationSettings.taskReminders) return

    const now = new Date()
    const dateStr = formatDateToLocal(now)
    const currentTime = now.toTimeString().slice(0, 5)

    const { data: tasksToNotify, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", dateStr)
      .eq("completed", false)
      .eq("notified", false)
      .lte("reminder_time", currentTime + ":59")

    if (error) {
      console.error("Error fetching tasks for reminders:", error)
      return
    }

    for (const task of tasksToNotify) {
      await addNotification({
        title: t("taskReminderTitle"),
        message: t("taskReminderMessage", { taskText: task.text }),
        type: "reminder",
        task_id: task.id,
      })

      const { error: updateError } = await supabase.from("tasks").update({ notified: true }).eq("id", task.id)

      if (updateError) console.error("Error updating task notified status:", updateError)

      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, notified: true } : t)))

      showBrowserNotification(t("notificationReminder"), t("taskReminderMessage", { taskText: task.text }), true)
    }
  }, [user, notificationSettings, addNotification, showBrowserNotification, t])

  useEffect(() => {
    const loadInitialData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        await fetchData(session.user)
      } else {
        setShowWelcome(true)
      }

      if ("Notification" in window && notificationSettings.enabled) {
        if (Notification.permission === "default") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              showBrowserNotification(t("notificationActivatedTitle"), t("notificationActivatedMessage"), true)
            }
          })
        }
      }
    }

    loadInitialData()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchData(session.user)
      } else {
        setUser(null)
        setShowWelcome(true)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [fetchData, notificationSettings, t, showBrowserNotification])

  useEffect(() => {
    const updateLastActive = async () => {
      if (user) {
        const { error } = await supabase
          .from("users")
          .update({ last_active: new Date().toISOString() })
          .eq("id", user.id)
        if (error) console.error("Error updating last active:", error)
      }
    }
    updateLastActive()

    const interval = setInterval(updateLastActive, 60000)
    return () => clearInterval(interval)
  }, [user])

  useEffect(() => {
    const saveNotificationSettings = async () => {
      if (user) {
        const { error } = await supabase
          .from("users")
          .update({ notification_settings: notificationSettings })
          .eq("id", user.id)
        if (error) console.error("Error saving notification settings to Supabase:", error)
      }
    }
    saveNotificationSettings()
  }, [notificationSettings, user])

  useEffect(() => {
    const saveTheme = async () => {
      if (user) {
        const { error } = await supabase.from("users").update({ theme: currentTheme }).eq("id", user.id)
        if (error) console.error("Error saving theme to Supabase:", error)
      }
    }
    saveTheme()

    const selectedTheme = ALL_THEMES.find((theme) => theme.id === currentTheme)
    if (selectedTheme?.isDark) {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
    } else {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
    }
  }, [currentTheme, user])

  useEffect(() => {
    const interval = setInterval(checkTaskReminders, 60000)
    return () => clearInterval(interval)
  }, [checkTaskReminders])

  const markNotificationAsRead = async (notificationId: string) => {
    if (!user) return
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId)
      .eq("user_id", user.id)

    if (error) console.error("Error marking notification as read:", error)
    else setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
  }

  const clearAllNotifications = async () => {
    if (!user) return
    const { error } = await supabase.from("notifications").delete().eq("user_id", user.id)

    if (error) console.error("Error clearing all notifications:", error)
    else setNotifications([])
  }

  const handleAuth = async () => {
    const selectedCountry = COUNTRIES.find((c) => c.code === country)
    const timezone = selectedCountry?.timezone || "Europe/Madrid"
    const isPremiumUser = email === "jesusrayaleon1@gmail.com"

    if (authMode === "register") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            country,
            timezone,
            is_premium: isPremiumUser,
            subscription_type: isPremiumUser ? "yearly" : "free",
          },
        },
      })

      if (error) {
        alert(`${t("registerButton")}: ${error.message}`)
        console.error("Signup error:", error)
        return
      }

      if (data.user) {
        const { error: profileInsertError } = await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email!,
          name,
          country,
          timezone,
          is_premium: isPremiumUser,
          subscription_type: isPremiumUser ? "yearly" : "free",
          notification_settings: notificationSettings,
          theme: currentTheme,
        })

        if (profileInsertError) {
          console.error("Error inserting user profile:", profileInsertError)
          alert(t("registerButton"))
          await supabase.auth.signOut()
          return
        }

        await addNotification({
          title: "🎉 ¡Bienvenido a FutureTask!",
          message: t("newAccountMessage", { flag: selectedCountry?.flag, countryName: selectedCountry?.name }),
          type: "achievement",
        })
        setShowPricing(!isPremiumUser)
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        alert(`${t("loginButton")}: ${error.message}`)
        console.error("Login error:", error)
        return
      }

      if (data.user) {
        await addNotification({
          title: "👋 ¡Bienvenido de vuelta!",
          message: t("welcomeBackMessage"),
          type: "achievement",
        })
      }
    }
    setEmail("")
    setPassword("")
    setName("")
    setCountry("ES")
  }

  const handleUpgrade = async (type: "monthly" | "yearly") => {
    if (user) {
      const { error } = await supabase
        .from("users")
        .update({ is_premium: true, subscription_type: type })
        .eq("id", user.id)

      if (error) {
        console.error("Error upgrading subscription:", error)
        alert(t("premiumActivatedTitle"))
        return
      }

      setUser((prev) => (prev ? { ...prev, is_premium: true, subscription_type: type } : null))
      setShowPricing(false)
      await addNotification({
        title: t("premiumActivatedTitle"),
        message: t("premiumActivatedMessage", { planType: type === "monthly" ? t("monthly") : t("yearly") }),
        type: "achievement",
      })
    }
  }

  const handleDowngrade = async () => {
    if (user) {
      const { error } = await supabase
        .from("users")
        .update({ is_premium: false, subscription_type: "free" })
        .eq("id", user.id)

      if (error) {
        console.error("Error downgrading subscription:", error)
        alert(t("freePlanTitle"))
        return
      }

      setUser((prev) => (prev ? { ...prev, is_premium: false, subscription_type: "free" } : null))
      await addNotification({
        title: t("freePlanTitle"),
        message: t("freePlanMessage"),
        type: "achievement",
      })
    }
  }

  const updateProfile = async () => {
    if (user) {
      const selectedCountry = COUNTRIES.find((c) => c.code === profileCountry)
      const updateData: { name: string; email: string; country: string; timezone: string; last_active: string } = {
        name: profileName,
        email: profileEmail,
        country: profileCountry,
        timezone: selectedCountry?.timezone || user.timezone,
        last_active: new Date().toISOString(),
      }

      const { error } = await supabase.from("users").update(updateData).eq("id", user.id)

      if (error) {
        console.error("Error updating profile:", error)
        alert(t("profileUpdatedTitle"))
        return
      }

      if (profileEmail !== user.email) {
        const { error: authUpdateError } = await supabase.auth.updateUser({ email: profileEmail })
        if (authUpdateError) {
          console.error("Error updating auth email:", authUpdateError)
          alert(t("profileUpdatedTitle"))
          return
        }
      }

      if (profilePassword) {
        const { error: passwordUpdateError } = await supabase.auth.updateUser({ password: profilePassword })
        if (passwordUpdateError) {
          console.error("Error updating password:", passwordUpdateError)
          alert(t("profileUpdatedTitle"))
          return
        }
      }

      setUser((prev) => (prev ? { ...prev, ...updateData } : null))
      setShowProfile(false)
      setProfilePassword("")

      await addNotification({
        title: t("profileUpdatedTitle"),
        message: t("profileUpdatedMessage", { countryName: selectedCountry?.name }),
        type: "achievement",
      })
    }
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error logging out:", error)
      alert(t("logout"))
    } else {
      setUser(null)
      setTasks([])
      setAchievements(DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false })))
      setNotifications([])
      setShowWelcome(true)
    }
  }

  const addTask = async () => {
    if (!newTask.trim() || !user) return

    if (!user.is_premium && tasks.filter((t) => !t.completed).length >= MAX_FREE_TASKS) {
      await addNotification({
        title: t("limitReachedTitle"),
        message: t("limitReachedMessage", { maxTasks: MAX_FREE_TASKS }),
        type: "reminder",
      })
      return
    }

    const dateStr = formatDateToLocal(selectedDate)

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        text: newTask,
        completed: false,
        date: dateStr,
        priority: newTaskPriority,
        category: newTaskCategory,
        reminder_time: newTaskReminder || null,
        notified: false,
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding task:", error)
      alert(t("addTask"))
      return
    }

    setTasks((prev) => [...prev, data])
    setNewTask("")
    setNewTaskReminder("")

    await addNotification({
      title: "📝 Nueva Tarea Creada",
      message: `"${data.text}" agregada para ${getRelativeDate(dateStr)}`,
      type: "task",
      task_id: data.id,
    })
  }

  const toggleTask = async (taskId: string) => {
    if (!user) return
    const taskToUpdate = tasks.find((task) => task.id === taskId)
    if (!taskToUpdate) return

    const newCompletedStatus = !taskToUpdate.completed
    const newCompletedAt = newCompletedStatus ? new Date().toISOString() : null

    const { data, error } = await supabase
      .from("tasks")
      .update({ completed: newCompletedStatus, completed_at: newCompletedAt, notified: false })
      .eq("id", taskId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error toggling task:", error)
      alert(t("taskCompletedTitle"))
      return
    }

    setTasks((prev) => prev.map((task) => (task.id === taskId ? data : task)))

    if (newCompletedStatus) {
      await addNotification({
        title: t("taskCompletedTitle"),
        message: t("taskCompletedMessage", { taskText: data.text }),
        type: "task",
        task_id: data.id,
      })
    }
  }

  const deleteTask = async (taskId: string) => {
    if (!user) return
    const taskToDelete = tasks.find((t) => t.id === taskId)

    const { error } = await supabase.from("tasks").delete().eq("id", taskId).eq("user_id", user.id)

    if (error) {
      console.error("Error deleting task:", error)
      alert(t("taskDeletedTitle"))
      return
    }

    setTasks((prev) => prev.filter((task) => task.id !== taskId))

    if (taskToDelete) {
      await addNotification({
        title: t("taskDeletedTitle"),
        message: t("taskDeletedMessage", { taskText: taskToDelete.text }),
        type: "task",
      })
    }
  }

  const openEditDialog = (task: Task) => {
    setEditingTask(task)
    setEditTaskText(task.text)
    setEditTaskPriority(task.priority)
    setEditTaskCategory(task.category)
    setEditTaskReminder(task.reminder_time || "")
    setEditTaskNotes(task.notes || "")
    setShowEditDialog(true)
  }

  const saveEditedTask = async () => {
    if (!editingTask || !editTaskText.trim() || !user) return

    const { data, error } = await supabase
      .from("tasks")
      .update({
        text: editTaskText,
        priority: editTaskPriority,
        category: editTaskCategory,
        reminder_time: editTaskReminder || null,
        notes: editTaskNotes || null,
        notified: false,
      })
      .eq("id", editingTask.id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error saving edited task:", error)
      alert(t("taskModifiedTitle"))
      return
    }

    setTasks((prev) => prev.map((task) => (task.id === editingTask.id ? data : task)))

    await addNotification({
      title: t("taskModifiedTitle"),
      message: t("taskModifiedMessage", { taskText: data.text }),
      type: "task",
      task_id: data.id,
    })

    setShowEditDialog(false)
    setEditingTask(null)
    setEditTaskText("")
    setEditTaskPriority("medium")
    setEditTaskCategory("personal")
    setEditTaskReminder("")
    setEditTaskNotes("")
  }

  const cancelEdit = () => {
    setShowEditDialog(false)
    setEditingTask(null)
    setEditTaskText("")
    setEditTaskPriority("medium")
    setEditTaskCategory("personal")
    setEditTaskReminder("")
    setEditTaskNotes("")
  }

  const navigateDate = (direction: "prev" | "next" | "today") => {
    const newDate = new Date(selectedDate)
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 1)
    } else if (direction === "next") {
      newDate.setDate(newDate.getDate() + 1)
    } else {
      setSelectedDate(new Date())
      return
    }
    setSelectedDate(newDate)
  }

  const getStreak = () => {
    const sortedDates = [...new Set(tasks.filter((t) => t.completed).map((t) => t.date))].sort()
    if (sortedDates.length === 0) return 0

    let streak = 1

    for (let i = sortedDates.length - 1; i > 0; i--) {
      const currentDate = new Date(sortedDates[i])
      const prevDate = new Date(sortedDates[i - 1])
      const daysDiff = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)

      if (daysDiff === 1) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const checkAchievements = useCallback(async () => {
    if (!user) return

    const completedTasks = tasks.filter((task) => task.completed)
    const totalCompleted = completedTasks.length
    const streak = getStreak()
    const todayTasks = tasks.filter((task) => task.date === formatDateToLocal(selectedDate))
    const completedCategories = new Set(completedTasks.map((t) => t.category))

    const earlyTasks = completedTasks.filter((t) => {
      if (!t.completed_at) return false
      const hour = new Date(t.completed_at).getHours()
      return hour < 9
    })

    const lateTasks = completedTasks.filter((t) => {
      if (!t.completed_at) return false
      const hour = new Date(t.completed_at).getHours()
      return hour >= 22
    })

    const tasksByDate = tasks.reduce(
      (acc, task) => {
        if (task.completed) {
          acc[task.date] = (acc[task.date] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    const maxTasksInDay = Math.max(...Object.values(tasksByDate), 0)

    const updatedAchievements = await Promise.all(
      DEFAULT_ACHIEVEMENTS.map(async (achievement) => {
        const currentAchievement = achievements.find((a) => a.id === achievement.id)
        if (currentAchievement?.unlocked) return currentAchievement

        if (achievement.premium && !user.is_premium) return achievement

        let shouldUnlock = false

        switch (achievement.id) {
          case "first-task":
            shouldUnlock = totalCompleted >= 1
            break
          case "streak-3":
            shouldUnlock = streak >= 3
            break
          case "streak-7":
            shouldUnlock = streak >= 7
            break
          case "streak-30":
            shouldUnlock = streak >= 30
            break
          case "task-master":
            shouldUnlock = totalCompleted >= 50
            break
          case "centurion":
            shouldUnlock = totalCompleted >= 100
            break
          case "perfectionist":
            shouldUnlock = todayTasks.length > 0 && todayTasks.every((task) => task.completed)
            break
          case "early-bird":
            shouldUnlock = earlyTasks.length >= 5
            break
          case "night-owl":
            shouldUnlock = lateTasks.length >= 5
            break
          case "productive-day":
            shouldUnlock = maxTasksInDay >= 10
            break
          case "category-master":
            shouldUnlock = completedCategories.size >= TASK_CATEGORIES.length
            break
          case "premium-streak-90":
            shouldUnlock = user.is_premium && streak >= 90
            break
          case "premium-master-all":
            shouldUnlock = user.is_premium && totalCompleted >= 500
            break
        }

        if (shouldUnlock) {
          const unlockedAt = new Date().toISOString()
          const { error } = await supabase.from("achievements").upsert({
            id: achievement.id,
            user_id: user.id,
            unlocked: true,
            unlocked_at: unlockedAt,
          })

          if (error) {
            console.error("Error unlocking achievement:", error)
          } else if (notificationSettings.achievementAlerts) {
            await addNotification({
              title: t("notificationActivatedTitle"),
              message: t("notificationAchievement", { achievementName: achievement.name }),
              type: "achievement",
            })
            showBrowserNotification(
              t("notificationAchievement"),
              t("notificationAchievement", { achievementName: achievement.name }),
              true,
            )
          }
          return { ...achievement, unlocked: true, unlockedAt }
        }
        return achievement
      }),
    )
    setAchievements(updatedAchievements)
  }, [user, tasks, achievements, selectedDate, notificationSettings, addNotification, showBrowserNotification, t])

  useEffect(() => {
    checkAchievements()
  }, [tasks, checkAchievements])

  const exportData = async () => {
    if (!user) return

    const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", user.id).single()
    const { data: tasksData, error: tasksError } = await supabase.from("tasks").select("*").eq("user_id", user.id)
    const { data: achievementsData, error: achievementsError } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", user.id)
    const { data: notificationsData, error: notificationsError } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)

    if (userError || tasksError || achievementsError || notificationsError) {
      console.error(
        "Error fetching data for export:",
        userError || tasksError || achievementsError || notificationsError,
      )
      alert(t("dataExportedTitle"))
      return
    }

    const data = {
      user: userData,
      tasks: tasksData,
      achievements: achievementsData,
      notifications: notificationsData,
      notificationSettings,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `futuretask-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    await addNotification({
      title: t("dataExportedTitle"),
      message: t("dataExportedMessage"),
      type: "achievement",
    })
  }

  const getRarityColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "from-gray-500 to-gray-600"
      case "rare":
        return "from-blue-500 to-blue-600"
      case "epic":
        return "from-purple-500 to-purple-600"
      case "legendary":
        return "from-yellow-500 to-orange-500"
    }
  }

  const getRarityBadge = (rarity: Achievement["rarity"]) => {
    const colors = {
      common: "bg-gray-500",
      rare: "bg-blue-500",
      epic: "bg-purple-500",
      legendary: "bg-gradient-to-r from-yellow-500 to-orange-500",
    }
    return colors[rarity]
  }

  const getTasksForDate = (date: Date) => {
    const dateStr = formatDateToLocal(date)
    return tasks.filter((task) => task.date === dateStr)
  }

  const getTodayTasks = () => getTasksForDate(selectedDate)
  const getCompletedTasks = () => getTodayTasks().filter((task) => task.completed)
  const getTodayProgress = () => {
    const todayTasks = getTodayTasks()
    if (todayTasks.length === 0) return 0
    return (getCompletedTasks().length / todayTasks.length) * 100
  }

  const getDateWithTasks = () => {
    const datesWithTasks = new Set(tasks.map((task) => task.date))
    return Array.from(datesWithTasks).map((dateStr) => {
      const [year, month, day] = dateStr.split("-").map(Number)
      return new Date(year, month - 1, day)
    })
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
    }
  }

  const getCategoryInfo = (categoryId: string) => {
    return TASK_CATEGORIES.find((c) => c.id === categoryId) || TASK_CATEGORIES[TASK_CATEGORIES.length - 1]
  }

  const getDateSearchResults = () => {
    if (!dateSearchQuery.trim()) {
      const uniqueDates = [...new Set(tasks.map((task) => task.date))].sort().reverse().slice(0, 5)

      return uniqueDates.map((dateStr) => {
        const tasksForDate = tasks.filter((task) => task.date === dateStr)
        const completedCount = tasksForDate.filter((task) => task.completed).length
        const totalCount = tasksForDate.length

        return {
          date: dateStr,
          displayDate: formatDateForDisplay(dateStr),
          relativeDate: getRelativeDate(dateStr),
          tasksCount: totalCount,
          completedCount,
          tasks: tasksForDate,
        }
      })
    }

    const query = dateSearchQuery.toLowerCase()
    const uniqueDates = [...new Set(tasks.map((task) => task.date))].sort().reverse()

    return uniqueDates
      .map((item) => {
        const tasksForDate = tasks.filter((task) => task.date === item)
        const completedCount = tasksForDate.filter((task) => task.completed).length
        const totalCount = tasksForDate.length

        return {
          date: item,
          displayDate: formatDateForDisplay(item),
          relativeDate: getRelativeDate(item),
          tasksCount: totalCount,
          completedCount,
          tasks: tasksForDate,
        }
      })
      .filter(
        (item) =>
          item.displayDate.toLowerCase().includes(query) ||
          item.relativeDate.toLowerCase().includes(query) ||
          item.tasks.some((task) => task.text.toLowerCase().includes(query)) ||
          item.date.includes(query) ||
          (query.includes(t("searchToday").toLowerCase()) && item.relativeDate === t("searchToday")) ||
          (query.includes(t("searchYesterday").toLowerCase()) && item.relativeDate === t("searchYesterday")) ||
          (query.includes(t("searchTomorrow").toLowerCase()) && item.relativeDate === t("searchTomorrow")),
      )
      .slice(0, 10)
  }

  const selectDateFromSearch = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number)
    setSelectedDate(new Date(year, month - 1, day))
    setShowDateSearch(false)
    setDateSearchQuery("")
  }

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length
  const currentAccentColor =
    ALL_THEMES.find((theme) => theme.id === currentTheme)?.accentColorRgba || BASIC_THEMES[0].accentColorRgba

  const getUserLocalTime = () => {
    if (!user?.timezone) return new Date()
    return new Date(new Date().toLocaleString("en-US", { timeZone: user.timezone }))
  }

  const formatUserTime = (date: Date) => {
    if (!user?.timezone) return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    return date.toLocaleString("es-ES", {
      timeZone: user.timezone,
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Render welcome screen first
  if (showWelcome) {
    return <WelcomeScreen onGetStarted={() => setShowWelcome(false)} />
  }

  // Render auth screen if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 animate-fade-in">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

        <Card className="w-full max-w-md bg-black/20 backdrop-blur-xl border-purple-500/20 shadow-2xl animate-scale-in">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 animate-bounce-in">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {t("authTitle")}
            </CardTitle>
            <CardDescription className="text-muted-foreground">{t("authDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "login" | "register")}>
              <TabsList className="grid w-full grid-cols-2 bg-purple-900/20">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-purple-500/30 transition-colors duration-300"
                >
                  {t("loginTab")}
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-purple-500/30 transition-colors duration-300"
                >
                  {t("registerTab")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    {t("emailLabel")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/30 border-purple-500/30 text-foreground placeholder:text-muted-foreground h-12 transition-all duration-300 focus:border-cyan-500"
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    {t("passwordLabel")}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/30 border-purple-500/30 text-foreground placeholder:text-muted-foreground h-12 transition-all duration-300 focus:border-cyan-500"
                    placeholder="••••••••"
                  />
                </div>
                <Button
                  onClick={handleAuth}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold text-lg transition-all duration-300"
                >
                  {t("loginButton")}
                </Button>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-6 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    {t("nameLabel")}
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-black/30 border-purple-500/30 text-foreground placeholder:text-muted-foreground h-12 transition-all duration-300 focus:border-cyan-500"
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register" className="text-foreground">
                    {t("emailLabel")}
                  </Label>
                  <Input
                    id="email-register"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/30 border-purple-500/30 text-foreground placeholder:text-muted-foreground h-12 transition-all duration-300 focus:border-cyan-500"
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register" className="text-foreground">
                    {t("passwordLabel")}
                  </Label>
                  <Input
                    id="password-register"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/30 border-purple-500/30 text-foreground placeholder:text-muted-foreground h-12 transition-all duration-300 focus:border-cyan-500"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-foreground">
                    {t("countryLabel")}
                  </Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="bg-black/30 border-purple-500/30 text-foreground h-12 transition-all duration-300 hover:border-cyan-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-purple-500/30 max-h-60 animate-fade-in">
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c.code} value={c.code} className="text-foreground h-12">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{c.flag}</span>
                            <span>{c.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleAuth}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold text-lg transition-all duration-300"
                >
                  {t("registerButton")}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render pricing section if user is logged in but not premium
  if (user && showPricing && !user.is_premium) {
    return <PricingSection onUpgrade={handleUpgrade} onSkip={() => setShowPricing(false)} />
  }

  const currentBgClass = ALL_THEMES.find((theme) => theme.id === currentTheme)?.background || BASIC_THEMES[0].background

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentBgClass} transition-all duration-500`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

      {/* Ad Placeholder for Free Users */}
      {!user?.is_premium && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800/70 backdrop-blur-sm text-white text-center p-2 z-50 animate-slide-in-bottom">
          <p className="text-sm">{t("adMessage")}</p>
        </div>
      )}

      <div className="relative">
        {/* Mobile Header */}
        <div className="lg:hidden bg-black/20 backdrop-blur-xl border-b border-purple-500/20 p-4 animate-fade-in-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  FutureTask
                </h1>
                <p className="text-xs text-muted-foreground">
                  {t("greeting", { name: user.name })}{" "}
                  {user.country && COUNTRIES.find((c) => c.code === user.country)?.flag}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Language Switcher */}
              <Select value={pathname.substring(1, 3)} onValueChange={onSelectChange}>
                <SelectTrigger className="w-16 bg-black/30 border-purple-500/30 text-foreground h-10 transition-all duration-300 hover:border-cyan-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-purple-500/30 animate-fade-in">
                  <SelectItem value="es" className="text-foreground h-10">
                    🇪🇸 ES
                  </SelectItem>
                  <SelectItem value="en" className="text-foreground h-10">
                    🇬🇧 EN
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Date Search Button */}
              <Popover open={showDateSearch} onOpenChange={setShowDateSearch}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground hover:bg-purple-500/20 transition-colors duration-300"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 p-0 bg-black/90 backdrop-blur-xl border-purple-500/30 animate-scale-in"
                  align="end"
                >
                  <Command shouldFilter={false}>
                    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
                      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-muted-foreground" />
                      <input
                        placeholder={t("searchDatesTasks")}
                        value={dateSearchQuery}
                        onChange={(e) => setDateSearchQuery(e.target.value)}
                        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground text-foreground"
                      />
                    </div>
                    <CommandList className="max-h-64">
                      {getDateSearchResults().length === 0 ? (
                        <div className="text-muted-foreground p-4 text-center">
                          {dateSearchQuery.trim() ? t("noResultsFound") : t("typeToSearch")}
                        </div>
                      ) : (
                        <CommandGroup>
                          {getDateSearchResults().map((result) => (
                            <CommandItem
                              key={result.date}
                              onSelect={() => selectDateFromSearch(result.date)}
                              className="text-foreground hover:bg-purple-500/20 cursor-pointer p-3 flex items-center space-x-3 transition-colors duration-200"
                            >
                              <CalendarSearch className="w-4 h-4 text-purple-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-foreground truncate">{result.relativeDate}</div>
                                <div className="text-sm text-muted-foreground">
                                  {t("tasksCompleted", {
                                    completedCount: result.completedCount,
                                    totalCount: result.tasksCount,
                                  })}
                                </div>
                                {result.tasks.slice(0, 1).map((task) => (
                                  <div key={task.id} className="text-xs text-muted-foreground truncate">
                                    • {task.text}
                                  </div>
                                ))}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Notifications Button */}
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground relative hover:bg-purple-500/20 transition-colors duration-300"
                onClick={() => setShowNotifications(true)}
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </Badge>
                )}
              </Button>

              <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground hover:bg-purple-500/20 transition-colors duration-300"
                  >
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="bg-black/90 backdrop-blur-xl border-purple-500/30 text-foreground w-80 animate-slide-in-right"
                >
                  <SheetHeader>
                    <SheetTitle className="text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      {t("menu")}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 mt-6">
                    <Button
                      onClick={() => {
                        setShowAchievements(true)
                        setShowMobileMenu(false)
                      }}
                      className="w-full h-12 bg-black/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 justify-start transition-all duration-300"
                    >
                      <Trophy className="w-5 h-5 mr-3" />
                      {t("achievements")} (
                      {achievements.filter((a) => a.unlocked && (!a.premium || user?.is_premium)).length})
                    </Button>

                    <Button
                      onClick={() => {
                        setShowStats(true)
                        setShowMobileMenu(false)
                      }}
                      className="w-full h-12 bg-black/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 justify-start transition-all duration-300"
                    >
                      <BarChart3 className="w-5 h-5 mr-3" />
                      {t("statsTitle")}
                    </Button>

                    <Button
                      onClick={() => {
                        setShowProfile(true)
                        setShowMobileMenu(false)
                      }}
                      className="w-full h-12 bg-black/20 border border-green-500/30 text-green-300 hover:bg-green-500/20 justify-start transition-all duration-300"
                    >
                      <Settings className="w-5 h-5 mr-3" />
                      {t("myProfileTitle")}
                    </Button>

                    {!user?.is_premium && (
                      <Button
                        onClick={() => {
                          setShowPricing(true)
                          setShowMobileMenu(false)
                        }}
                        className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 justify-start transition-all duration-300 animate-pulse"
                      >
                        <Sparkles className="w-5 h-5 mr-3" />
                        {t("getPremiumNow")}
                      </Button>
                    )}

                    <Button
                      onClick={logout}
                      className="w-full h-12 bg-black/20 border border-red-500/30 text-red-300 hover:bg-red-500/20 justify-start transition-all duration-300"
                    >
                      <X className="w-5 h-5 mr-3" />
                      {t("logout")}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4 space-y-6">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between animate-fade-in-down">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  FutureTask
                </h1>
                <p className="text-muted-foreground">
                  {t("greeting", { name: user.name })}{" "}
                  {user.country && COUNTRIES.find((c) => c.code === user.country)?.flag} •{" "}
                  {formatUserTime(getUserLocalTime())}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <Select value={pathname.substring(1, 3)} onValueChange={onSelectChange}>
                <SelectTrigger className="w-24 bg-black/20 border-purple-500/30 text-foreground h-10 transition-all duration-300 hover:border-cyan-500">
                  <Globe className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-purple-500/30 animate-fade-in">
                  <SelectItem value="es" className="text-foreground h-10">
                    🇪🇸 Español
                  </SelectItem>
                  <SelectItem value="en" className="text-foreground h-10">
                    🇬🇧 English
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={logout}
                variant="outline"
                className="bg-black/20 border-red-500/30 text-red-300 hover:bg-red-500/20 transition-all duration-300"
              >
                {t("logout")}
              </Button>
            </div>
          </div>

          {/* Simple content for now */}
          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 animate-fade-in">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Bienvenido al Calendario Futurista</h2>
              <p className="text-muted-foreground">La aplicación se está cargando...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

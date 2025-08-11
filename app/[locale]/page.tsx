'use client'
import React, { useState } from 'react'

import { ALL_THEMES, BASIC_THEMES } from '@/lib/themes' 
import { useState, useEffect, useCallback } from "react"
import { Calendar } from "@/components/ui/calendar" // Re-adding Calendar import as it was removed in the previous turn's merged_code
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress" // Re-adding Progress import as it was removed in the previous turn's merged_code
import { Checkbox } from "@/components/ui/checkbox" // Re-adding Checkbox import as it was removed in the previous turn's merged_code
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch" // Re-adding Switch import as it was removed in the previous turn's merged_code
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Trophy,
  CalendarIcon,
  CheckCircle,
  Star,
  Target,
  Award,
  Zap,
  Settings,
  Download,
  BarChart3,
  Flame,
  CalendarDays,
  TrendingUp,
  AlertCircle,
  Coffee,
  Moon,
  Sun,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Clock,
  CalendarSearch,
  Edit,
  Save,
  Gem,
  Sparkles,
  Globe,
} from "lucide-react"

import { PricingSection } from "@/components/pricing-section"
import { WelcomeScreen } from "@/components/welcome-screen"
import { WeeklyView } from "@/components/weekly-view" // Re-adding WeeklyView import as it was removed in the previous turn's merged_code
import { PomodoroTimer } from "@/components/pomodoro-timer" // Re-adding PomodoroTimer import as it was removed in the previous turn's merged_code
import { supabase } from "@/lib/supabase" // Import Supabase client
import { useTranslations } from "next-intl" // Import useTranslations
import { useRouter, usePathname } from "next/navigation" // Import useRouter and usePathname

interface Task {
  id: string
  user_id: string // Added user_id to match DB schema
  text: string
  completed: boolean
  date: string
  priority: "low" | "medium" | "high"
  category: string
  notes?: string
  completed_at?: string // Changed to snake_case to match DB
  reminder_time?: string // Changed to snake_case to match DB
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
  user_id: string // Added user_id to match DB schema
  title: string
  message: string
  type: "task" | "achievement" | "reminder" | "streak"
  timestamp: string
  read: boolean
  task_id?: string // Changed to snake_case to match DB
}

interface NotificationSettings {
  enabled: boolean
  taskReminders: boolean
  achievementAlerts: boolean
  streakReminders: boolean
  dailyMotivation: boolean
  reminderTime: string
}

// Agregar después de las interfaces existentes
interface Country {
  code: string
  name: string
  timezone: string
  flag: string
}

// New interface for user profile data from public.users table
interface UserProfile {
  id: string // Supabase auth user ID
  email: string
  name: string
  country: string
  timezone: string
  joined_at: string
  last_active: string
  is_premium: boolean
  subscription_type: "free" | "monthly" | "yearly"
  notification_settings?: NotificationSettings // Added for Supabase sync
  theme?: string // Added for Supabase sync
}

  export default function Page() {
    const [showPricing, setShowPricing] = useState(true)
    const user = { is_premium: false } // ejemplo; reemplázalo con tu lógica real

    if (user && showPricing && !user.is_premium) {
      return (
        <div>
          <h2>Pricing Section</h2>
          <button onClick={() => setShowPricing(false)}>Omitir</button>
        </div>
      )
    }

    const currentTheme = 'default'
    const currentBgClass = 'from-purple-500 to-blue-500'

    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentBgClass} transition-all duration-500`}>
        <div className="text-white text-center p-10">Contenido principal</div>
      </div>
    )
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
  // Premium Achievements
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
    isDark: true, // This theme is dark
  }, // Purple
  {
    id: "dark",
    name: "Oscuro",
    background: "from-gray-900 via-gray-800 to-gray-900",
    accentColorRgba: "rgba(100, 116, 139, 0.3)",
    premium: false,
    isDark: true, // This theme is dark
  }, // Slate/Gray
  {
    id: "light",
    name: "Claro",
    background: "from-gray-50 via-gray-100 to-gray-50",
    accentColorRgba: "rgba(59, 130, 246, 0.3)", // Blue accent for light mode
    premium: false,
    isDark: false, // This theme is light
  },
  {
    id: "forest",
    name: "Bosque",
    background: "from-green-950 via-green-900 to-green-950",
    accentColorRgba: "rgba(34, 197, 94, 0.3)", // Green accent
    premium: false,
    isDark: true, // This theme is dark
  },
]

const PREMIUM_THEMES = [
  {
    id: "futuristic",
    name: "Futurista",
    background: "from-blue-900 via-purple-900 to-pink-900",
    accentColorRgba: "rgba(59, 130, 246, 0.3)",
    premium: true,
    isDark: true, // This theme is dark
  }, // Blue
  {
    id: "neon",
    name: "Neón",
    background: "from-green-900 via-cyan-900 to-blue-900",
    accentColorRgba: "rgba(6, 182, 212, 0.3)",
    premium: true,
    isDark: true, // This theme is dark
  }, // Cyan
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
  const t = useTranslations("Index") // Initialize useTranslations hook
  const router = useRouter()
  const pathname = usePathname()

  const [user, setUser] = useState<UserProfile | null>(null) // Changed type to UserProfile
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

  // Agregar después de los estados de auth existentes
  const [country, setCountry] = useState("ES") // España por defecto
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
  const [showWelcome, setShowWelcome] = useState(true) // New state for welcome screen
  const [currentView, setCurrentView] = useState<"daily" | "weekly" | "pomodoro">("daily") // New state for main view

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
      const newPath = `/${nextLocale}${pathname.substring(3)}` // Assumes current path is like /es/... or /en/...
      router.replace(newPath)
    },
    [pathname, router],
  )

  // Function to fetch user data, tasks, achievements, and notifications
  const fetchData = useCallback(
    async (supabaseUser: any) => {
      // Fetch user profile from public.users table
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", supabaseUser.id)
        .single()

      if (profileError) {
        console.error("Error fetching user profile:", profileError)
        // If user profile doesn't exist in public.users, it means they just signed up
        // or there was an issue. For now, we'll log out.
        // In a real app, you might create the profile here.
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

      // --- Migration and loading for notificationSettings ---
      const savedNotificationSettings = localStorage.getItem("futureTask_notificationSettings")
      let initialNotificationSettings = notificationSettings // Default or current state

      if (userProfile.notification_settings) {
        // Supabase has data, prioritize it
        initialNotificationSettings = userProfile.notification_settings
        if (savedNotificationSettings) {
          // Clear localStorage if Supabase has data (migration completed or already synced)
          localStorage.removeItem("futureTask_notificationSettings")
        }
      } else if (savedNotificationSettings) {
        // localStorage has data, but Supabase doesn't. Migrate!
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
          localStorage.removeItem("futureTask_notificationSettings") // Clear invalid data
        }
      }
      setNotificationSettings(initialNotificationSettings)

      // --- Migration and loading for currentTheme ---
      const savedTheme = localStorage.getItem("futureTask_theme")
      let initialTheme = BASIC_THEMES[0].id // Default theme

      if (userProfile.theme) {
        // Supabase has data, prioritize it
        initialTheme = userProfile.theme
        if (savedTheme) {
          // Clear localStorage if Supabase has data (migration completed or already synced)
          localStorage.removeItem("futureTask_theme")
        }
      } else if (savedTheme) {
        // localStorage has data, but Supabase doesn't. Migrate!
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

      // Fetch tasks
      const { data: fetchedTasks, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", supabaseUser.id)

      if (tasksError) console.error("Error fetching tasks:", tasksError)
      else setTasks(fetchedTasks || [])

      // Fetch achievements
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
              unlockedAt: saved?.unlocked_at, // Note: DB column name
            }
          }),
        )
      }

      // Fetch notifications
      const { data: fetchedNotifications, error: notificationsError } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", supabaseUser.id)
        .order("timestamp", { ascending: false })

      if (notificationsError) console.error("Error fetching notifications:", notificationsError)
      else setNotifications(fetchedNotifications || [])
    },
    [notificationSettings],
  ) // Added notificationSettings to dependency array for initial state

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

      // Request notification permission
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

    // Listen for auth state changes
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
  }, [fetchData, notificationSettings, t]) // Depend on fetchData, notificationSettings, and t to avoid stale closures

  useEffect(() => {
    // Update last_active timestamp in DB
    const updateLastActive = async () => {
      if (user) {
        const { error } = await supabase
          .from("users")
          .update({ last_active: new Date().toISOString() })
          .eq("id", user.id)
        if (error) console.error("Error updating last active:", error)
      }
    }
    updateLastActive() // Call once on mount/user change

    const interval = setInterval(updateLastActive, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [user])

  // Save notification settings to Supabase instead of localStorage
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

  // Save current theme to Supabase instead of localStorage
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

  // Check for task reminders
  const checkTaskReminders = useCallback(async () => {
    if (!user || !notificationSettings.enabled || !notificationSettings.taskReminders) return

    const now = new Date()
    const dateStr = formatDateToLocal(now)
    const currentTime = now.toTimeString().slice(0, 5) // "HH:MM"

    const { data: tasksToNotify, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", dateStr)
      .eq("completed", false)
      .eq("notified", false)
      .lte("reminder_time", currentTime + ":59") // Check if reminder time is now or in the past for today

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

      // Mark as notified in DB
      const { error: updateError } = await supabase.from("tasks").update({ notified: true }).eq("id", task.id)

      if (updateError) console.error("Error updating task notified status:", updateError)

      // Update local state
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, notified: true } : t)))

      // Browser notification con sonido
      showBrowserNotification(t("notificationReminder"), t("taskReminderMessage", { taskText: task.text }), true)
    }
  }, [user, notificationSettings, addNotification, showBrowserNotification, t])

  // Check reminders every minute
  useEffect(() => {
    const interval = setInterval(checkTaskReminders, 60000)
    return () => clearInterval(interval)
  }, [checkTaskReminders])

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
    const isPremiumUser = email === "jesusrayaleon1@gmail.com" // Still using this for demo

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
        // Insert user profile into public.users table
        const { error: profileInsertError } = await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email!,
          name,
          country,
          timezone,
          is_premium: isPremiumUser,
          subscription_type: isPremiumUser ? "yearly" : "free",
          notification_settings: notificationSettings, // Save default settings on signup
          theme: currentTheme, // Save default theme on signup
        })

        if (profileInsertError) {
          console.error("Error inserting user profile:", profileInsertError)
          alert(t("registerButton"))
          await supabase.auth.signOut() // Log out if profile creation fails
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
        // fetchData will be called by the auth state change listener
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

      // If email changed, Supabase auth will handle it, but we need to update the user's email in auth.users too
      if (profileEmail !== user.email) {
        const { error: authUpdateError } = await supabase.auth.updateUser({ email: profileEmail })
        if (authUpdateError) {
          console.error("Error updating auth email:", authUpdateError)
          alert(t("profileUpdatedTitle"))
          return
        }
      }

      // If password changed
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
      title: "📝 Nueva Tarea Creada", // This was not translated in the messages file, keeping original
      message: `"${data.text}" agregada para ${getRelativeDate(dateStr)}`, // This was not translated in the messages file, keeping original
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

  // Edit task functions
  const openEditDialog = (task: Task) => {
    setEditingTask(task)
    setEditTaskText(task.text)
    setEditTaskPriority(task.priority)
    setEditTaskCategory(task.category)
    setEditTaskReminder(task.reminder_time || "") // Use reminder_time
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
        reminder_time: editTaskReminder || null, // Use reminder_time
        notes: editTaskNotes || null,
        notified: false, // Reset notification status when edited
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
    const today = new Date().toISOString().split("T")[0]

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

    // Early bird and night owl tasks
    const earlyTasks = completedTasks.filter((t) => {
      if (!t.completed_at) return false // Use completed_at
      const hour = new Date(t.completed_at).getHours()
      return hour < 9
    })

    const lateTasks = completedTasks.filter((t) => {
      if (!t.completed_at) return false // Use completed_at
      const hour = new Date(t.completed_at).getHours()
      return hour >= 22
    })

    // Tasks completed in one day
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

        // Skip premium achievements if user is not premium
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
          // Premium achievements
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
  }, [tasks, checkAchievements]) // Re-run when tasks change

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
      notificationSettings, // Still from local storage
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

  // Date search functionality
  const getDateSearchResults = () => {
    if (!dateSearchQuery.trim()) {
      // Si no hay query, mostrar fechas recientes con tareas
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
          // Búsquedas adicionales
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

  // Browser notification con sonido
  const showBrowserNotification = (title: string, body: string, playSound = true) => {
    if (Notification.permission === "granted") {
      const notification = new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "futuretask",
        requireInteraction: false,
        silent: !playSound,
      })

      // Reproducir sonido personalizado
      if (playSound) {
        try {
          const audio = new Audio(
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OSnTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
          )
          audio.volume = 0.3
          audio.play().catch(() => {}) // Ignorar errores de audio
        } catch (e) {
          // Fallback silencioso
        }
      }

      // Auto-cerrar después de 5 segundos
      setTimeout(() => {
        notification.close()
      }, 5000)

      return notification
    }
    return null
  }

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


  return (
    
    <div
      className={`min-h-screen bg-gradient-to-br ${currentBgClass} transition-all duration-500`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />
      {/* Resto del JSX */}
      <h1 className="text-white text-3xl p-8">Bienvenido al Calendario Futurista</h1>
    </div>

    <div className={`min-h-screen bg-gradient-to-br ${currentBgClass} transition-all duration-500`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

      {/* Ad Placeholder for Free Users */}
      {!user?.is_premium && ( // Use user.is_premium
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
                      {achievements.filter((a) => a.unlocked && (!a.premium || user?.is_premium)).length}){" "}
                      {/* Use user.is_premium */}
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

                    {!user?.is_premium && ( // Use user.is_premium
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

              {/* Notifications */}
              <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-black/20 border-orange-500/30 text-orange-300 hover:bg-orange-500/20 relative transition-all duration-300"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    {t("notificationsTitle")}
                    {unreadNotificationsCount > 0 && (
                      <Badge className="ml-2 bg-red-500 text-white animate-pulse">{unreadNotificationsCount}</Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/90 backdrop-blur-xl border-orange-500/30 text-foreground max-w-2xl animate-scale-in">
                  <DialogHeader>
                    <div className="flex items-center justify-between">
                      <DialogTitle className="text-xl bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                        {t("notificationsTitle")}
                      </DialogTitle>
                      {notifications.length > 0 && (
                        <Button
                          onClick={clearAllNotifications}
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                        >
                          {t("clearAll")}
                        </Button>
                      )}
                    </div>
                  </DialogHeader>
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {notifications.length === 0 ? (
                      <div className="text-muted-foreground text-center py-8">
                        <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>{t("noNotifications")}</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                            notification.read
                              ? "bg-gray-800/30 border-gray-700/30"
                              : "bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20"
                          }`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              {notification.type === "achievement" && <Trophy className="w-5 h-5 text-yellow-400" />}
                              {notification.type === "task" && <CheckCircle className="w-5 h-5 text-green-400" />}
                              {notification.type === "reminder" && <Clock className="w-5 h-5 text-blue-400" />}
                              {notification.type === "streak" && <Flame className="w-5 h-5 text-orange-400" />}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{notification.title}</h4>
                              <p className="text-muted-foreground">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(notification.timestamp).toLocaleString("es-ES")}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0 mt-2 animate-pulse" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showAchievements} onOpenChange={setShowAchievements}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-black/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-all duration-300"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    {t("achievements")} (
                    {achievements.filter((a) => a.unlocked && (!a.premium || user?.is_premium)).length}){" "}
                    {/* Use user.is_premium */}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/90 backdrop-blur-xl border-purple-500/30 text-foreground max-w-2xl animate-scale-in">
                  <DialogHeader>
                    <DialogTitle className="text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      {t("achievementsDialogTitle")}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      {t("achievementsDialogDescription")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 mt-4 max-h-96 overflow-y-auto">
                    {achievements
                      .filter((a) => !a.premium || user?.is_premium) // Use user.is_premium
                      .map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 ${
                            achievement.unlocked
                              ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}/20 border-purple-500/30`
                              : "bg-gray-800/30 border-gray-700/30"
                          } ${achievement.premium && !user?.is_premium ? "opacity-50 grayscale" : ""}`} // Use user.is_premium
                        >
                          <div
                            className={`p-2 rounded-full ${
                              achievement.unlocked
                                ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}`
                                : "bg-gray-700"
                            }`}
                          >
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3
                                className={`font-semibold ${achievement.unlocked ? "text-foreground" : "text-muted-foreground"}`}
                              >
                                {achievement.name}
                              </h3>
                              <Badge className={`${getRarityBadge(achievement.rarity)} text-white text-xs`}>
                                {achievement.rarity.toUpperCase()}
                              </Badge>
                              {achievement.premium &&
                                !user?.is_premium && ( // Use user.is_premium
                                  <Badge className="bg-yellow-500 text-white text-xs">{t("premium")}</Badge>
                                )}
                            </div>
                            <p
                              className={`text-sm ${achievement.unlocked ? "text-muted-foreground" : "text-muted-foreground"}`}
                            >
                              {achievement.description}
                            </p>
                          </div>
                          {achievement.unlocked && (
                            <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                              {t("unlocked")}
                            </Badge>
                          )}
                        </div>
                      ))}
                    {!user?.is_premium && ( // Use user.is_premium
                      <div className="text-muted-foreground text-center py-4 border-t border-gray-700/30 mt-4">
                        <Sparkles className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                        <p>{t("getPremiumAchievements")}</p>
                        <Button
                          onClick={() => {
                            setShowPricing(true)
                            setShowAchievements(false)
                          }}
                          className="mt-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                        >
                          {t("getPremiumNow")}
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showStats} onOpenChange={setShowStats}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-black/20 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all duration-300"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {t("statsTitle")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/90 backdrop-blur-xl border-cyan-500/30 text-foreground animate-scale-in">
                  <DialogHeader>
                    <DialogTitle className="text-xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      {t("statsTitle")}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-black/20 border-cyan-500/20">
                        <CardContent className="p-4 text-center">
                          <Flame className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                          <p className="text-2xl font-bold text-foreground">{getStreak()}</p>
                          <p className="text-sm text-muted-foreground">{t("currentStreak")}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-black/20 border-cyan-500/20">
                        <CardContent className="p-4 text-center">
                          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                          <p className="text-2xl font-bold text-foreground">
                            {tasks.filter((t) => t.completed).length}
                          </p>
                          <p className="text-sm text-muted-foreground">{t("totalCompleted")}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <Card className="bg-black/20 border-cyan-500/20">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 text-foreground">{t("tasksByCategory")}</h3>
                        {TASK_CATEGORIES.map((category) => {
                          const count = tasks.filter((t) => t.category === category.id && t.completed).length
                          return (
                            <div key={category.id} className="flex items-center justify-between mb-1">
                              <div className={`w-3 h-3 rounded-full ${category.color}`} />
                              <span className="text-sm text-muted-foreground">{category.name}</span>
                              <span className="text-sm text-foreground font-semibold">{count}</span>
                            </div>
                          )
                        })}
                      </CardContent>
                    </Card>
                    {!user?.is_premium && ( // Use user.is_premium
                      <div className="text-muted-foreground text-center py-4 border-t border-gray-700/30 mt-4">
                        <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>{t("getPremiumStats")}</p>
                        <Button
                          onClick={() => {
                            setShowPricing(true)
                            setShowStats(false)
                          }}
                          className="mt-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                        >
                          {t("getPremiumNow")}
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showProfile} onOpenChange={setShowProfile}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-black/20 border-green-500/30 text-green-300 hover:bg-green-500/20 transition-all duration-300"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {t("myProfileTitle")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/90 backdrop-blur-xl border-green-500/30 text-foreground max-w-2xl animate-scale-in">
                  <DialogHeader>
                    <DialogTitle className="text-xl bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                      {t("myProfileTitle")}
                    </DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="profile" className="mt-4">
                    <TabsList className="grid w-full grid-cols-2 bg-black/20">
                      <TabsTrigger
                        value="profile"
                        className="data-[state=active]:bg-green-500/30 transition-colors duration-300"
                      >
                        {t("profileTab")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="notifications"
                        className="data-[state=active]:bg-green-500/30 transition-colors duration-300"
                      >
                        {t("notificationsTab")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="appearance"
                        className="data-[state=active]:bg-green-500/30 transition-colors duration-300"
                      >
                        {t("appearanceTab")}
                      </TabsTrigger>
                      <TabsTrigger
                        value="subscription"
                        className="data-[state=active]:bg-green-500/30 transition-colors duration-300"
                      >
                        {t("subscriptionTab")}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-4 mt-4 animate-fade-in">
                      <div className="space-y-2">
                        <Label className="text-foreground">{t("newName")}</Label>
                        <Input
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="bg-black/30 border-green-500/30 text-foreground h-12 transition-all duration-300 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground">{t("newEmail")}</Label>
                        <Input
                          type="email"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          className="bg-black/30 border-green-500/30 text-foreground h-12 transition-all duration-300 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground">{t("countryLabel")}</Label>
                        <Select value={profileCountry} onValueChange={setProfileCountry}>
                          <SelectTrigger className="bg-black/30 border-green-500/30 text-foreground h-12 transition-all duration-300 hover:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-green-500/30 max-h-60 animate-fade-in">
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
                      <div className="space-y-2">
                        <Label className="text-foreground">{t("newPasswordOptional")}</Label>
                        <Input
                          type="password"
                          value={profilePassword}
                          onChange={(e) => setProfilePassword(e.target.value)}
                          className="bg-black/30 border-green-500/30 text-foreground h-12 transition-all duration-300 focus:border-blue-500"
                          placeholder={t("leaveEmptyForCurrent")}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={updateProfile}
                          className="flex-1 h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {t("saveChanges")}
                        </Button>
                        <Button
                          onClick={exportData}
                          variant="outline"
                          className="h-12 bg-black/20 border-gray-500/30 text-muted-foreground hover:bg-gray-500/20 transition-all duration-300"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {t("exportData")}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-4 mt-4 animate-fade-in">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-foreground">{t("notificationsEnabled")}</Label>
                            <p className="text-sm text-muted-foreground">{t("toggleAllNotifications")}</p>
                          </div>
                          <Switch
                            checked={notificationSettings.enabled}
                            onCheckedChange={(checked) =>
                              setNotificationSettings((prev) => ({ ...prev, enabled: checked }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-foreground">{t("taskReminders")}</Label>
                            <p className="text-sm text-muted-foreground">{t("notificationsForScheduledTasks")}</p>
                          </div>
                          <Switch
                            checked={notificationSettings.taskReminders}
                            onCheckedChange={(checked) =>
                              setNotificationSettings((prev) => ({ ...prev, taskReminders: checked }))
                            }
                            disabled={!notificationSettings.enabled}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-foreground">{t("achievementAlerts")}</Label>
                            <p className="text-sm text-muted-foreground">{t("notificationsForUnlockedAchievements")}</p>
                          </div>
                          <Switch
                            checked={notificationSettings.achievementAlerts}
                            onCheckedChange={(checked) =>
                              setNotificationSettings((prev) => ({ ...prev, achievementAlerts: checked }))
                            }
                            disabled={!notificationSettings.enabled}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-foreground">{t("streakReminders")}</Label>
                            <p className="text-sm text-muted-foreground">{t("keepStreakActive")}</p>
                          </div>
                          <Switch
                            checked={notificationSettings.streakReminders}
                            onCheckedChange={(checked) =>
                              setNotificationSettings((prev) => ({ ...prev, streakReminders: checked }))
                            }
                            disabled={!notificationSettings.enabled}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-foreground">{t("reminderTime")}</Label>
                          <Input
                            type="time"
                            value={notificationSettings.reminderTime}
                            onChange={(e) =>
                              setNotificationSettings((prev) => ({ ...prev, reminderTime: e.target.value }))
                            }
                            className="bg-black/30 border-green-500/30 text-foreground h-12 transition-all duration-300 focus:border-blue-500"
                            disabled={!notificationSettings.enabled}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="appearance" className="space-y-4 mt-4 animate-fade-in">
                      <h3 className="text-lg font-semibold text-foreground mb-3">{t("themes")}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {ALL_THEMES.map(
                          (theme) =>
                            (
                              <Card
                          key={theme.id}
                          onClick={() => (user?.is_premium || !theme.premium ? setCurrentTheme(theme.id) : null)} // Use user.is_premium
                          className={`p-4 cursor-pointer border-2 transition-all duration-300 ${
                            currentTheme === theme.id
                              ? "border-purple-500 ring-2 ring-purple-500"
                              : "border-gray-700/50 hover:border-purple-500/50"
                          } ${theme.premium && !user?.is_premium ? "opacity-50 grayscale cursor-not-allowed" : ""}`} {/* Use user.is_premium */}
                        >
                          <div className={`w-full h-16 rounded-md mb-2 bg-gradient-to-br ${theme.background}`} />
                          <div className=\"flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground">{theme.name}</p>
                            <Badge
                              className={`text-white text-xs ${theme.premium ? "bg-yellow-500" : "bg-gray-500"}`}
                            >
                              {theme.premium ? t("premium") : t("free")}
                            </Badge>
                          </div>
                          {theme.premium && !user?.is_premium && ( // Use user.is_premium
                            <p className="text-xs text-muted-foreground mt-1">{t("premiumRequired")}</p>
                          )}
                        </Card>
                            ),
                        )}
                      </div>
                      {!user?.is_premium && ( // Use user.is_premium
                        <div className="text-muted-foreground text-center py-4 border-t border-gray-700/30 mt-4">
                          <Sparkles className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                          <p>{t("getPremiumThemes")}</p>
                          <Button
                            onClick={() => {
                              setShowPricing(true)
                              setShowProfile(false)
                            }}
                            className="mt-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                          >
                            {t("getPremiumNow")}
                          </Button>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="subscription" className="space-y-4 mt-4 animate-fade-in">
                      <h3 className="text-lg font-semibold text-foreground mb-3">{t("subscriptionStatus")}</h3>
                      <Card className="bg-black/30 border-purple-500/30 p-4">
                        <CardContent className="p-0">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-muted-foreground">{t("currentPlan")}</p>
                            <Badge
                              className={`text-white ${user?.is_premium ? "bg-gradient-to-r from-purple-500 to-cyan-500" : "bg-gray-500"}`} // Use user.is_premium
                            >
                              {user?.is_premium // Use user.is_premium
                                ? `${t("premium")} (${user.subscription_type === "monthly" ? t("monthly") : t("yearly")})`
                                : t("free")}
                            </Badge>
                          </div>
                          {user?.is_premium ? ( // Use user.is_premium
                            <>
                              <p className="text-sm text-muted-foreground mb-4">{t("enjoyPremiumFeatures")}</p>
                              <Button
                                onClick={handleDowngrade}
                                variant="outline"
                                className="w-full bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30 transition-all duration-300"
                              >
                                {t("cancelPremiumSubscription")}
                              </Button>
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-muted-foreground mb-4">{t("freePlanMessageSubscription")}</p>
                              <Button
                                onClick={() => {
                                  setShowPricing(true)
                                  setShowProfile(false)
                                }}
                                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
                              >
                                {t("getPremiumNow")}
                              </Button>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>

              <Button
                onClick={logout}
                variant="outline"
                className="bg-black/20 border-red-500/30 text-red-300 hover:bg-red-500/20 transition-all duration-300"
              >
                {t("logout")}
              </Button>
            </div>
          </div>

          {/* Edit Task Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="bg-black/90 backdrop-blur-xl border-blue-500/30 text-foreground max-w-2xl animate-scale-in">
              <DialogHeader>
                <DialogTitle className="text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {t("editTaskTitle")}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">{t("editTaskDescription")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-foreground">{t("taskTitle")}</Label>
                  <Input
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                    className="bg-black/30 border-blue-500/30 text-foreground h-12 transition-all duration-300 focus:border-purple-500"
                    placeholder="Título de la tarea..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">{t("priority")}</Label>
                    <Select value={editTaskPriority} onValueChange={(value: any) => setEditTaskPriority(value)}>
                      <SelectTrigger className="bg-black/30 border-blue-500/30 text-foreground h-12 transition-all duration-300 hover:border-purple-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-blue-500/30 animate-fade-in">
                        <SelectItem value="low" className="text-green-400 h-12">
                          🟢 {t("lowPriority")}
                        </SelectItem>
                        <SelectItem value="medium" className="text-yellow-400 h-12">
                          🟡 {t("mediumPriority")}
                        </SelectItem>
                        <SelectItem value="high" className="text-red-400 h-12">
                          🔴 {t("highPriority")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">{t("category")}</Label>
                    <Select value={editTaskCategory} onValueChange={setEditTaskCategory}>
                      <SelectTrigger className="bg-black/30 border-blue-500/30 text-foreground h-12 transition-all duration-300 hover:border-purple-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-blue-500/30 animate-fade-in">
                        {TASK_CATEGORIES.map((category) => (
                          <SelectItem key={category.id} value={category.id} className="text-foreground h-12">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${category.color}`} />
                              <span>{t(`${category.id}Category`)}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">{t("reminderOptional")}</Label>
                  <Input
                    type="time"
                    value={editTaskReminder}
                    onChange={(e) => setEditTaskReminder(e.target.value)}
                    className="bg-black/30 border-blue-500/30 text-foreground h-12 transition-all duration-300 focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">{t("notesOptional")}</Label>
                  <Textarea
                    value={editTaskNotes}
                    onChange={(e) => setEditTaskNotes(e.target.value)}
                    className="bg-black/30 border-blue-500/30 text-foreground min-h-20 transition-all duration-300 focus:border-purple-500"
                    placeholder="Agrega notas adicionales..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={saveEditedTask}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {t("saveChanges")}
                  </Button>
                  <Button
                    onClick={cancelEdit}
                    variant="outline"
                    className="h-12 bg-black/20 border-gray-500/30 text-muted-foreground hover:bg-gray-500/20 transition-all duration-300"
                  >
                    {t("cancel")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Mobile Notifications Dialog */}
          <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
            <DialogContent className="bg-black/90 backdrop-blur-xl border-orange-500/30 text-foreground max-w-[95vw] max-h-[80vh] animate-scale-in">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    {t("notificationsTitle")}
                  </DialogTitle>
                  {notifications.length > 0 && (
                    <Button
                      onClick={clearAllNotifications}
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      {t("clearAll")}
                    </Button>
                  )}
                </div>
              </DialogHeader>
              <div className="max-h-96 overflow-y-auto space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-muted-foreground text-center py-8">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{t("noNotifications")}</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                        notification.read
                          ? "bg-gray-800/30 border-gray-700/30"
                          : "bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20"
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {notification.type === "achievement" && <Trophy className="w-5 h-5 text-yellow-400" />}
                          {notification.type === "task" && <CheckCircle className="w-5 h-5 text-green-400" />}
                          {notification.type === "reminder" && <Clock className="w-5 h-5 text-blue-400" />}
                          {notification.type === "streak" && <Flame className="w-5 h-5 text-orange-400" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{notification.title}</h4>
                          <p className="text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.timestamp).toLocaleString("es-ES")}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0 mt-2 animate-pulse" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Mobile Achievements Dialog */}
          <Dialog open={showAchievements} onOpenChange={setShowAchievements}>
            <DialogContent className="bg-black/90 backdrop-blur-xl border-purple-500/30 text-foreground max-w-[95vw] max-h-[80vh] animate-scale-in">
              <DialogHeader>
                <DialogTitle className="text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {t("achievementsDialogTitle")}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {t("achievementsDialogDescription")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 mt-4 max-h-96 overflow-y-auto">
                {achievements
                  .filter((a) => !a.premium || user?.is_premium) // Use user.is_premium
                  .map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`flex items-center space-x-3 p-4 rounded-lg border transition-all duration-300 ${
                        achievement.unlocked
                          ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}/20 border-purple-500/30`
                          : "bg-gray-800/30 border-gray-700/30"
                      } ${achievement.premium && !user?.is_premium ? "opacity-50 grayscale" : ""}`} // Use user.is_premium
                    >
                      <div
                        className={`p-2 rounded-full ${
                          achievement.unlocked
                            ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}`
                            : "bg-gray-700"
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3
                            className={`font-semibold ${achievement.unlocked ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {achievement.name}
                          </h3>
                          <Badge className={`${getRarityBadge(achievement.rarity)} text-white text-xs`}>
                            {achievement.rarity.toUpperCase()}
                          </Badge>
                          {achievement.premium &&
                            !user?.is_premium && ( // Use user.is_premium
                              <Badge className="bg-yellow-500 text-white text-xs">{t("premium")}</Badge>
                            )}
                        </div>
                        <p
                          className={`text-sm ${achievement.unlocked ? "text-muted-foreground" : "text-muted-foreground"}`}
                        >
                          {achievement.description}
                        </p>
                        {achievement.unlocked && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white mt-2">
                            {t("unlocked")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                {!user?.is_premium && ( // Use user.is_premium
                  <div className="text-muted-foreground text-center py-4 border-t border-gray-700/30 mt-4">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                    <p>{t("getPremiumAchievements")}</p>
                    <Button
                      onClick={() => {
                        setShowPricing(true)
                        setShowAchievements(false)
                      }}
                      className="mt-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                    >
                      {t("getPremiumNow")}
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 animate-fade-in-up">
            <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 animate-slide-in-left">
              <CardContent className="p-3 lg:p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />
                  <div>
                    <p className="text-xs lg:text-sm text-muted-foreground">{t("completedTasks")}</p>
                    <p className="text-lg lg:text-xl font-bold text-foreground">
                      {tasks.filter((t) => t.completed).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 animate-slide-in-left delay-100">
              <CardContent className="p-3 lg:p-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
                  <div>
                    <p className="text-xs lg:text-sm text-muted-foreground">{t("totalToday")}</p>
                    <p className="text-lg lg:text-xl font-bold text-foreground">{getTodayTasks().length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 animate-slide-in-left delay-200">
              <CardContent className="p-3 lg:p-4">
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 lg:w-5 lg:h-5 text-orange-400" />
                  <div>
                    <p className="text-xs lg:text-sm text-muted-foreground">{t("streak")}</p>
                    <p className="text-lg lg:text-xl font-bold text-foreground">{getStreak()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 animate-slide-in-left delay-300">
              <CardContent className="p-3 lg:p-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400" />
                  <div>
                    <p className="text-xs lg:text-sm text-muted-foreground">{t("achievements")}</p>
                    <p className="text-lg lg:text-xl font-bold text-foreground">
                      {achievements.filter((a) => a.unlocked && (!a.premium || user?.is_premium)).length}{" "}
                      {/* Use user.is_premium */}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 col-span-2 lg:col-span-1 animate-slide-in-left delay-400">
              <CardContent className="p-3 lg:p-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />
                  <div>
                    <p className="text-xs lg:text-sm text-muted-foreground">{t("progress")}</p>
                    <p className="text-lg lg:text-xl font-bold text-foreground">{Math.round(getTodayProgress())}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Date Navigation */}
          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 animate-fade-in">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => navigateDate("prev")}
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:bg-purple-500/20 h-10 w-10 lg:h-8 lg:w-8 transition-colors duration-300"
                >
                  <ChevronLeft className="w-5 h-5 lg:w-4 lg:h-4" />
                </Button>

                <div className="text-center">
                  <h2 className="text-lg lg:text-xl font-bold text-foreground">
                    {selectedDate.toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h2>
                  <Button
                    onClick={() => navigateDate("today")}
                    variant="ghost"
                    size="sm"
                    className="text-purple-300 hover:bg-purple-500/20 mt-1 h-8 transition-colors duration-300"
                  >
                    {t("goToToday")}
                  </Button>
                </div>

                <Button
                  onClick={() => navigateDate("next")}
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:bg-purple-500/20 h-10 w-10 lg:h-8 lg:w-8 transition-colors duration-300"
                >
                  <ChevronRight className="w-5 h-5 lg:w-4 lg:h-4" />
                </Button>
              </div>

              <div className="mt-4">
                <Progress value={getTodayProgress()} className="h-3 transition-all duration-500" />
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  {getCompletedTasks().length} de {getTodayTasks().length} completadas
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as "daily" | "weekly" | "pomodoro")}>
            <TabsList className="grid w-full grid-cols-3 bg-black/20 border-purple-500/20">
              <TabsTrigger
                value="daily"
                className="data-[state=active]:bg-purple-500/30 transition-colors duration-300"
              >
                <CalendarIcon className="w-4 h-4 mr-2" /> {t("dailyView")}
              </TabsTrigger>
              <TabsTrigger
                value="weekly"
                className="data-[state=active]:bg-purple-500/30 transition-colors duration-300"
                disabled={!user?.is_premium} // Use user.is_premium
              >
                <CalendarDays className="w-4 h-4 mr-2" /> {t("weeklyView")} {!user?.is_premium && `(${t("premium")})`}{" "}
                {/* Use user.is_premium */}
              </TabsTrigger>
              <TabsTrigger
                value="pomodoro"
                className="data-[state=active]:bg-purple-500/30 transition-colors duration-300"
                disabled={!user?.is_premium} // Use user.is_premium
              >
                <Clock className="w-4 h-4 mr-2" /> {t("pomodoroView")} {!user?.is_premium && `(${t("premium")})`}{" "}
                {/* Use user.is_premium */}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar - Responsive version */}
                <Card className="lg:col-span-2 bg-black/20 backdrop-blur-xl border-purple-500/20 animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center space-x-2">
                      <CalendarIcon className="w-5 h-5" />
                      <span>{t("calendar")}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Mobile Calendar - Compact version */}
                    <div className="lg:hidden">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        className="rounded-md border-0 w-full [&_.rdp-months]:justify-center [&_.rdp-month]:w-full [&_.rdp-table]:w-full [&_.rdp-cell]:text-center [&_.rdp-day]:h-8 [&_.rdp-day]:w-8 [&_.rdp-day]:text-sm"
                        modifiers={{
                          hasTasks: getDateWithTasks(),
                        }}
                        modifiersStyles={{
                          hasTasks: {
                            backgroundColor: currentAccentColor,
                            color: "white",
                            fontWeight: "bold",
                          },
                        }}
                      />
                    </div>

                    {/* Desktop Calendar - Full version */}
                    <div className="hidden lg:block">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        className="rounded-md border-0"
                        modifiers={{
                          hasTasks: getDateWithTasks(),
                        }}
                        modifiersStyles={{
                          hasTasks: {
                            backgroundColor: currentAccentColor,
                            color: "white",
                            fontWeight: "bold",
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Tasks */}
                <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 lg:col-span-1 animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-foreground text-lg lg:text-xl">{t("dailyTasks")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Add Task Form */}
                    <div className="space-y-3">
                      <Input
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder={
                          user?.is_premium // Use user.is_premium
                            ? t("newTaskPlaceholderPremium")
                            : t("newTaskPlaceholderFree", {
                                remaining: MAX_FREE_TASKS - tasks.filter((t) => !t.completed).length,
                              })
                        }
                        className="bg-black/30 border-purple-500/30 text-foreground placeholder:text-muted-foreground h-12 text-base transition-all duration-300 focus:border-cyan-500"
                        onKeyPress={(e) => e.key === "Enter" && addTask()}
                        disabled={!user?.is_premium && tasks.filter((t) => !t.completed).length >= MAX_FREE_TASKS} // Use user.is_premium
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Select value={newTaskPriority} onValueChange={(value: any) => setNewTaskPriority(value)}>
                          <SelectTrigger className="bg-black/30 border-purple-500/30 text-foreground h-12 transition-all duration-300 hover:border-cyan-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-purple-500/30 animate-fade-in">
                            <SelectItem value="low" className="text-green-400 h-12">
                              🟢 {t("lowPriority")}
                            </SelectItem>
                            <SelectItem value="medium" className="text-yellow-400 h-12">
                              🟡 {t("mediumPriority")}
                            </SelectItem>
                            <SelectItem value="high" className="text-red-400 h-12">
                              🔴 {t("highPriority")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
                          <SelectTrigger className="bg-black/30 border-purple-500/30 text-foreground h-12 transition-all duration-300 hover:border-cyan-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-purple-500/30 animate-fade-in">
                            {TASK_CATEGORIES.map((category) => (
                              <SelectItem key={category.id} value={category.id} className="text-foreground h-12">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-3 h-3 rounded-full ${category.color}`} />
                                  <span>{t(`${category.id}Category`)}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Reminder Time Input */}
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-sm">{t("reminderOptional")}</Label>
                        <Input
                          type="time"
                          value={newTaskReminder}
                          onChange={(e) => setNewTaskReminder(e.target.value)}
                          className="bg-black/30 border-purple-500/30 text-foreground h-12 transition-all duration-300 focus:border-cyan-500"
                          placeholder="Hora de recordatorio"
                        />
                      </div>

                      <Button
                        onClick={addTask}
                        className="w-full h-12 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-lg font-semibold transition-all duration-300"
                        disabled={!user?.is_premium && tasks.filter((t) => !t.completed).length >= MAX_FREE_TASKS} // Use user.is_premium
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        {t("addTask")}
                      </Button>
                    </div>

                    {/* Tasks List */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {getTodayTasks().map((task) => {
                        const categoryInfo = getCategoryInfo(task.category)
                        return (
                          <div
                            key={task.id}
                            className={`flex items-center space-x-3 p-4 rounded-lg border border-l-4 transition-all duration-300 ${
                              task.completed
                                ? "bg-green-500/10 border-green-500/30"
                                : "bg-gray-800/30 border-gray-700/30 hover:border-purple-500/30"
                            } ${getPriorityColor(task.priority)}`}
                          >
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => toggleTask(task.id)}
                              className="border-purple-500/50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-cyan-500 w-5 h-5 transition-all duration-300"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`text-base ${task.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
                                >
                                  {task.text}
                                </span>
                                <div className={`w-3 h-3 rounded-full ${categoryInfo.color}`} />
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                {task.priority === "high" && (
                                  <div className="flex items-center space-x-1">
                                    <AlertCircle className="w-4 h-4 text-red-400" />
                                    <span className="text-xs text-red-400">{t("highPriority")}</span>
                                  </div>
                                )}
                                {task.reminder_time && ( // Use reminder_time
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3 text-blue-400" />
                                    <span className="text-xs text-blue-400">{task.reminder_time}</span>{" "}
                                    {/* Use reminder_time */}
                                  </div>
                                )}
                                {task.notes && (
                                  <div className="flex items-center space-x-1">
                                    <span className="text-xs text-muted-foreground">📝 {t("notes")}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(task)}
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-8 w-8 transition-all duration-300"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteTask(task.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 transition-all duration-300"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}

                      {getTodayTasks().length === 0 && (
                        <div className="text-muted-foreground text-center py-8 animate-fade-in">
                          <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">{t("noTasksForDay")}</p>
                          <p className="text-sm">{t("addFirstTask")}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="mt-6">
              {user?.is_premium ? ( // Use user.is_premium
                <WeeklyView
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  tasks={tasks}
                  getTasksForDate={getTasksForDate}
                  getPriorityColor={getPriorityColor}
                  getCategoryInfo={getCategoryInfo}
                  toggleTask={toggleTask}
                  openEditDialog={openEditDialog}
                  deleteTask={deleteTask}
                />
              ) : (
                <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-8 text-center animate-fade-in">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">{t("weeklyViewTitle")}</CardTitle>
                  <CardDescription className="text-muted-foreground mb-6">{t("weeklyViewDescription")}</CardDescription>
                  <Button
                    onClick={() => setShowPricing(true)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold text-lg h-12 px-8 hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
                  >
                    {t("getPremiumNow")}
                  </Button>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="pomodoro" className="mt-6">
              {user?.is_premium ? ( // Use user.is_premium
                <PomodoroTimer />
              ) : (
                <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20 p-8 text-center animate-fade-in">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">{t("pomodoroViewTitle")}</CardTitle>
                  <CardDescription className="text-muted-foreground mb-6">
                    {t("pomodoroViewDescription")}
                  </CardDescription>
                  <Button
                    onClick={() => setShowPricing(true)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold text-lg h-12 px-8 hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
                  >
                    {t("getPremiumNow")}
                  </Button>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

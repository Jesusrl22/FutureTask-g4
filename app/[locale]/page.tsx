'use client'

import { useState, useEffect } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay, addDays, subDays, startOfDay, endOfDay, isSameDay } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarIcon, Plus, Settings, Moon, Sun, Globe, Bell, Clock, Target, Zap, Star, Crown, Palette, Volume2, VolumeX, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Filter, Search, MoreVertical, Edit, Trash2, Copy, Calendar as CalendarIconSmall, User, CreditCard, LogOut, Menu, X, Check, AlertCircle, Info, Sparkles, TrendingUp, Award, Gift, Heart, Coffee, Briefcase, Home, BookOpen, Dumbbell, Music, Camera, Gamepad2, Plane, ShoppingCart, Phone, Mail, MapPin, Clock3, Users, MessageSquare, Share2, Download, Upload, RefreshCw, Eye, EyeOff, Lock, Unlock, Shield, Wifi, WifiOff, Battery, BatteryLow, Signal, SignalLow, Bluetooth, BluetoothConnected, Headphones, Mic, MicOff, Video, VideoOff, ImageIcon, FileText, Folder, FolderOpen, Archive, Bookmark, Tag, Flag, Pin, PinOff, ThumbsUp, ThumbsDown, Smile, Frown, Meh, Angry, Laugh, Cry, Surprised, Confused, Sleepy, Sick, Cool, Nerd, Robot, Alien, Ghost, Skull, Fire, Snowflake, Sun as SunIcon, Moon as MoonIcon, Cloud, CloudRain, CloudSnow, CloudLightning, Rainbow, Umbrella, Thermometer, Wind, Compass, Mountain, Tree, Flower, Leaf, Seedling, Cactus, PalmTree, Evergreen, Deciduous, Mushroom, Shell, Paw, Feather, Bug, Butterfly, Fish, Bird, Rabbit, Turtle, Snail, Honeybee, Ladybug, Spider, Ant, Worm, Microbe, DNA, Atom, Molecule, Magnet, Zap as ZapIcon, Lightbulb, Candle, Flashlight, Lamp, Lantern, Torch, Campfire, Fireplace, Stove, Oven, Microwave, Refrigerator, Freezer, Dishwasher, WashingMachine, Dryer, Iron, Vacuum, Broom, Mop, Bucket, Soap, Towel, Toilet, Shower, Bathtub, Sink, Faucet, Pipe, Wrench, Hammer, Screwdriver, Saw, Drill, Nail, Screw, Nut, Bolt, Gear, Cog, Wheel, Tire, Car, Truck, Bus, Motorcycle, Bicycle, Scooter, Skateboard, RollerSkate, Sled, Boat, Ship, Submarine, Airplane, Helicopter, Rocket, Satellite, UFO, Train, Tram, Metro, Taxi, Ambulance, FireTruck, PoliceCar, Tractor, Bulldozer, Crane, ForkLift, Excavator, Dump, Cement, Road, Bridge, Building, House, Hut, Castle, Church, Mosque, Synagogue, Temple, Pagoda, Torii, Shrine, Statue, Monument, Fountain, Well, Tower, Lighthouse, Windmill, Factory, Warehouse, Store, Shop, Market, Bank, Hospital, School, University, Library, Museum, Theater, Cinema, Stadium, Gym, Pool, Park, Playground, Carousel, FerrisWheel, RollerCoaster, Tent, Circus, Carnival, Fair, Festival, Party, Wedding, Birthday, Christmas, Halloween, Easter, Thanksgiving, NewYear, Valentine, StPatrick, Independence, Labor, Memorial, Veterans, Presidents, MLK, Columbus, Indigenous, Earth, Environment, Recycle, Trash, Compost, Solar, Wind as WindIcon, Water, Electric, Gas, Oil, Coal, Nuclear, Renewable, Sustainable, Green, Eco, Organic, Natural, Healthy, Fresh, Clean, Pure, Safe, Secure, Protected, Private, Public, Open, Closed, Free, Paid, Premium, Pro, Basic, Standard, Advanced, Expert, Beginner, Intermediate, Easy, Hard, Simple, Complex, Fast, Slow, Quick, Instant, Delayed, Pending, Processing, Loading, Saving, Uploading, Downloading, Syncing, Connecting, Connected, Disconnected, Online, Offline, Available, Unavailable, Active, Inactive, Enabled, Disabled, On, Off, Yes, No, True, False, Good, Bad, Right, Wrong, Correct, Incorrect, Valid, Invalid, Success, Error, Warning, Info as InfoIcon, Debug, Trace, Log, Report, Analytics, Statistics, Metrics, Data, Database, Server, Cloud as CloudIcon, Network, Internet, Web, Website, App, Software, Program, Code, Script, Function, Variable, Constant, Array, Object, String, Number, Boolean, Null, Undefined, Class, Interface, Method, Property, Parameter, Argument, Return, Import, Export, Module, Package, Library, Framework, API, SDK, CLI, GUI, UI, UX, Design, Layout, Theme, Style, Color, Font, Text, ImageIcon as ImageIconIcon, Video as VideoIcon, Audio, Sound, Music as MusicIcon, Voice, Speech, Language, Translation, Dictionary, Grammar, Spell, Word, Sentence, Paragraph, Page, Book, Article, Blog, News, Magazine, Newspaper, Journal, Diary, Note, Memo, List, Todo, Task, Project, Goal, Plan, Schedule, Calendar as CalendarIconLarge, Date, Time, Hour, Minute, Second, Day, Week, Month, Year, Today, Tomorrow, Yesterday, Now, Soon, Later, Before, After, During, While, Until, Since, From, To, At, In, On, By, With, Without, For, Against, About, Around, Through, Over, Under, Above, Below, Between, Among, Inside, Outside, Near, Far, Here, There, Everywhere, Nowhere, Somewhere, Anywhere, Left, Right, Up, Down, Forward, Backward, North, South, East, West, Center, Middle, Top, Bottom, Front, Back, Side, Corner, Edge, Border, Margin, Padding, Width, Height, Length, Size, Scale, Zoom, Fit, Fill, Stretch, Shrink, Expand, Collapse, Fold, Unfold, Open as OpenIcon, Close, Show, Hide, Reveal, Conceal, Display, Render, Draw, Paint, Sketch, Doodle, Art, Craft, Create, Make, Build, Construct, Assemble, Install, Setup, Configure, Customize, Personalize, Adjust, Modify, Change, Update, Upgrade, Downgrade, Install as InstallIcon, Uninstall, Add, Remove, Delete as DeleteIcon, Insert, Append, Prepend, Replace, Substitute, Swap, Exchange, Trade, Buy, Sell, Pay, Purchase, Order, Ship, Deliver, Receive, Send, Mail as MailIcon, Email, Message, Chat, Talk, Speak, Listen, Hear, See, Look, Watch, View, Read, Write, Type, Print, Scan, Copy as CopyIcon, Paste, Cut, Undo, Redo, Save, Load, Import as ImportIcon, Export as ExportIcon, Backup, Restore, Reset, Restart, Reboot, Shutdown, Sleep, Wake, Pause as PauseIcon, Resume, Start, Stop, End, Finish, Complete, Done, Cancel, Abort, Skip, Next, Previous, First, Last, Begin, Continue, Proceed, Advance, Progress, Move, Go, Come, Stay, Wait, Hold, Keep, Store, Retrieve, Fetch, Get, Set, Put, Post, Patch, Delete as DeleteIconSmall, Head, Options, Trace as TraceIcon, Connect, Disconnect, Join, Leave, Enter, Exit, Login, Logout, Signin, Signup, Register, Subscribe, Unsubscribe, Follow, Unfollow, Like, Unlike, Love, Hate, Favorite, Unfavorite, Bookmark as BookmarkIcon, Unbookmark, Share, Unshare, Comment, Reply, Forward, Retweet, Quote, Mention, Tag as TagIcon, Untag, Block, Unblock, Mute, Unmute, Ban, Unban, Report as ReportIcon, Flag as FlagIcon, Unflag, Approve, Reject, Accept, Decline, Confirm, Deny, Allow, Forbid, Grant, Revoke, Enable, Disable as DisableIcon, Activate, Deactivate, Turn, Toggle, Switch as SwitchIcon, Flip, Rotate, Spin, Twist, Bend, Fold as FoldIcon, Unfold as UnfoldIcon, Wrap, Unwrap, Pack, Unpack, Zip, Unzip, Compress, Decompress, Encode, Decode, Encrypt, Decrypt, Hash, Verify, Validate, Authenticate, Authorize, Permission, Access, Deny as DenyIcon, Grant as GrantIcon, Role, User as UserIcon, Admin, Moderator, Guest, Member, Subscriber, Follower, Friend, Contact, Group, Team, Organization, Company, Business, Enterprise, Startup, Corporation, Agency, Firm, Studio, Lab, Workshop, Factory as FactoryIcon, Office, Store as StoreIcon, Shop as ShopIcon, Market as MarketIcon, Mall, Plaza, Square, Street, Avenue, Road as RoadIcon, Highway, Bridge as BridgeIcon, Tunnel, Intersection, Junction, Roundabout, Traffic, Light, Sign, Signal as SignalIcon, Stop as StopIcon, Yield, Merge, Turn as TurnIcon, Straight, Curve, Hill, Valley, Mountain as MountainIcon, River, Lake, Ocean, Sea, Beach, Island, Desert, Forest, Jungle, Savanna, Prairie, Tundra, Arctic, Antarctic, Equator, Tropics, Subtropics, Temperate, Polar, Climate, Weather, Season, Spring, Summer, Autumn, Winter, Rain, Snow, Sleet, Hail, Fog, Mist, Dew, Frost, Ice, Steam, Vapor, Gas as GasIcon, Liquid, Solid, Plasma, Matter, Energy, Force, Power, Strength, Weakness, Speed, Velocity, Acceleration, Momentum, Inertia, Gravity, Magnetism, Electricity, Heat, Cold, Temperature, Pressure, Density, Mass, Weight, Volume, Area, Perimeter, Diameter, Radius, Circumference, Angle, Degree, Radian, Sine, Cosine, Tangent, Logarithm, Exponential, Square, Cube, Root, Power as PowerIcon, Base, Exponent, Coefficient, Variable as VariableIcon, Constant as ConstantIcon, Equation, Formula, Expression, Function as FunctionIcon, Graph, Chart, Plot, Axis, Scale as ScaleIcon, Grid, Legend, Title, Label as LabelIcon, Caption, Heading, Subheading, Paragraph as ParagraphIcon, Sentence as SentenceIcon, Word as WordIcon, Letter, Character, Symbol, Icon, Emoji, Emoticon, Sticker, GIF, Meme, Avatar as AvatarIcon, Profile, Picture, Photo, Selfie, Portrait, Landscape, Panorama, Screenshot, Thumbnail, Preview, Gallery, Album, Collection, Playlist, Queue, History, Recent, Favorite as FavoriteIcon, Popular, Trending, Featured, Recommended, Suggested, Related, Similar, Different, Unique, Special, Rare, Common, Frequent, Occasional, Regular, Irregular, Normal, Abnormal, Typical, Atypical, Standard as StandardIcon, Custom, Default, Original, Copy as CopyIconSmall, Duplicate, Clone, Mirror, Reflection, Shadow, Silhouette, Outline, Border as BorderIcon, Frame, Background, Foreground, Layer, Overlay, Underlay, Mask, Filter as FilterIcon, Effect, Animation, Transition, Transform, Translate, Scale as ScaleIconSmall, Rotate as RotateIcon, Skew, Perspective, Matrix, Vector, Pixel, Resolution, Quality, Compression, Format, Extension, Type, Kind, Sort, Category, Class as ClassIcon, Group as GroupIcon, Set, Collection as CollectionIcon, List as ListIcon, Array as ArrayIcon, Stack, Queue as QueueIcon, Tree as TreeIcon, Graph as GraphIcon, Network as NetworkIcon, Node, Edge, Link, Connection, Relationship, Association, Dependency, Reference, Pointer, Index, Key, Value, Pair, Tuple, Record, Field, Column, Row, Table, Database as DatabaseIcon, Schema, Model, Entity, Attribute, Property as PropertyIcon, Method as MethodIcon, Function as FunctionIconSmall, Procedure, Routine, Algorithm, Logic, Condition, Loop, Iteration, Recursion, Branch, Decision, Choice, Option, Alternative, Selection, Pick, Choose, Decide, Determine, Calculate, Compute, Process, Execute, Run, Perform, Operate, Work, Function as FunctionIconLarge, Behave, Act, React, Respond, Handle, Manage, Control, Direct, Guide, Lead, Follow, Obey, Command, Order as OrderIcon, Request, Ask, Answer, Reply as ReplyIcon, Question, Query, Search as SearchIcon, Find, Locate, Discover, Explore, Investigate, Research, Study, Learn, Teach, Educate, Train, Practice, Exercise, Test, Exam, Quiz, Assessment, Evaluation, Review, Feedback, Rating, Score, Grade, Mark, Point, Credit, Reward, Prize, Award as AwardIcon, Trophy, Medal, Badge as BadgeIcon, Certificate, Diploma, Degree as DegreeIcon, Title as TitleIcon, Rank, Level, Stage, Phase, Step, Process as ProcessIcon, Procedure as ProcedureIcon, Method as MethodIconSmall, Technique, Strategy, Tactic, Approach, Way, Path, Route, Direction, Instruction, Guide as GuideIcon, Manual, Tutorial, Help, Support, Assistance, Service, Customer, Client, Patient, Student, Teacher, Instructor, Professor, Doctor, Nurse, Engineer, Developer, Designer, Artist, Writer, Author, Editor, Publisher, Journalist, Reporter, Photographer, Videographer, Filmmaker, Director, Producer, Actor, Actress, Singer, Musician, Composer, Conductor, Dancer, Choreographer, Athlete, Coach, Trainer, Manager, Leader, Boss, Employee, Worker, Staff, Team as TeamIcon, Crew, Squad, Group as GroupIconSmall, Band, Club, Society, Association as AssociationIcon, Organization as OrganizationIcon, Institution, Foundation, Charity, Nonprofit, Government, Agency as AgencyIcon, Department, Ministry, Bureau, Office as OfficeIcon, Branch, Division, Section, Unit, Component, Part, Piece, Element, Item, Object as ObjectIcon, Thing, Stuff, Material, Substance, Matter as MatterIcon, Content, Information, Data as DataIcon, Knowledge, Wisdom, Intelligence, Smart, Clever, Bright, Brilliant, Genius, Talented, Skilled, Expert as ExpertIcon, Professional, Amateur, Beginner as BeginnerIcon, Novice, Intermediate as IntermediateIcon, Advanced as AdvancedIcon, Master, Grandmaster, Champion, Winner, Loser, Player, Participant, Competitor, Opponent, Rival, Enemy, Friend as FriendIcon, Ally, Partner, Teammate, Colleague, Coworker, Neighbor, Stranger, Acquaintance, Relative, Family, Parent, Child, Sibling, Spouse, Partner as PartnerIcon, Lover, Boyfriend, Girlfriend, Husband, Wife, Son, Daughter, Father, Mother, Brother, Sister, Uncle, Aunt, Cousin, Nephew, Niece, Grandfather, Grandmother, Grandchild, Ancestor, Descendant, Generation, Age, Young, Old, Baby, Toddler, Child as ChildIcon, Teen, Adult, Senior, Elder, Elderly, Mature, Immature, Grown, Growing, Development, Growth, Evolution, Change as ChangeIcon, Transformation, Metamorphosis, Adaptation, Adjustment, Modification, Alteration, Revision, Update as UpdateIcon, Upgrade as UpgradeIcon, Improvement, Enhancement, Optimization, Refinement, Polish, Perfection, Excellence, Quality as QualityIcon, Standard as StandardIconSmall, Norm, Rule, Law, Regulation, Policy, Guideline, Principle, Value as ValueIcon, Belief, Opinion, View, Perspective, Viewpoint, Standpoint, Position, Stance, Attitude, Approach as ApproachIcon, Style as StyleIcon, Fashion, Trend, Mode, Manner, Way as WayIcon, Method as MethodIconLarge, Technique as TechniqueIcon, Skill, Ability, Capability, Capacity, Potential, Talent, Gift as GiftIcon, Strength as StrengthIcon, Weakness as WeaknessIcon, Advantage, Disadvantage, Benefit, Drawback, Pro, Con, Plus, Minus, Positive, Negative, Good as GoodIcon, Bad as BadIcon, Better, Worse, Best, Worst, Great, Terrible, Excellent, Poor, Outstanding, Mediocre, Superior, Inferior, High, Low, Top as TopIcon, Bottom as BottomIcon, Maximum, Minimum, Most, Least, More, Less, Many, Few, All, None, Some, Any, Every, Each, Both, Either, Neither, Or, And, Not, But, However, Although, Though, Despite, Regardless, Nevertheless, Nonetheless, Furthermore, Moreover, Additionally, Also, Too, As, Well, Besides, Except, Unless, If, When, Where, Why, How, What, Who, Which, Whose, Whom, That, This, These, Those, Here as HereIcon, There as ThereIcon, Everywhere as EverywhereIcon, Nowhere as NowhereIcon, Somewhere as SomewhereIcon, Anywhere as AnywhereIcon, Now as NowIcon, Then, Soon as SoonIcon, Later as LaterIcon, Early, Late, Before as BeforeIcon, After as AfterIcon, During as DuringIcon, While as WhileIcon, Until as UntilIcon, Since as SinceIcon, From as FromIcon, To as ToIcon, At as AtIcon, In as InIcon, On as OnIcon, By as ByIcon, With as WithIcon, Without as WithoutIcon, For as ForIcon, Against as AgainstIcon, About as AboutIcon, Around as AroundIcon, Through as ThroughIcon, Over as OverIcon, Under as UnderIcon, Above as AboveIcon, Below as BelowIcon, Between as BetweenIcon, Among as AmongIcon, Inside as InsideIcon, Outside as OutsideIcon, Near as NearIcon, Far as FarIcon } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'
import { WelcomeScreen } from '@/components/welcome-screen'
import { PricingSection } from '@/components/pricing-section'
import { WeeklyView } from '@/components/weekly-view'
import { PomodoroTimer } from '@/components/pomodoro-timer'
import { PayPalButton } from '@/components/paypal-button'
import { supabase } from '@/lib/supabase'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = {
  'es': es,
  'en': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface Task {
  id: string
  title: string
  description?: string
  date: Date
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
  estimatedTime?: number
  actualTime?: number
  tags: string[]
  subtasks: SubTask[]
  recurring?: 'daily' | 'weekly' | 'monthly'
  reminder?: Date
  color?: string
}

interface SubTask {
  id: string
  title: string
  completed: boolean
}

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: Task
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'es'
  notifications: boolean
  soundEnabled: boolean
  pomodoroTime: number
  shortBreakTime: number
  longBreakTime: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  longBreakInterval: number
  dailyGoal: number
  weeklyGoal: number
  backgroundGradient: string
  isPremium: boolean
  premiumExpiry?: Date
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  notifications: true,
  soundEnabled: true,
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  dailyGoal: 8,
  weeklyGoal: 40,
  backgroundGradient: 'from-purple-400 via-pink-500 to-red-500',
  isPremium: false,
}

const backgroundGradients = [
  'from-purple-400 via-pink-500 to-red-500',
  'from-blue-400 via-purple-500 to-pink-500',
  'from-green-400 via-blue-500 to-purple-500',
  'from-yellow-400 via-orange-500 to-red-500',
  'from-pink-400 via-red-500 to-yellow-500',
  'from-indigo-400 via-purple-500 to-pink-500',
  'from-teal-400 via-blue-500 to-purple-500',
  'from-orange-400 via-pink-500 to-purple-500',
]

const premiumGradients = [
  'from-gradient-to-r from-purple-900 via-blue-900 to-indigo-900',
  'from-gradient-to-r from-rose-900 via-pink-900 to-purple-900',
  'from-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900',
  'from-gradient-to-r from-amber-900 via-orange-900 to-red-900',
]

const taskCategories = [
  { id: 'work', name: 'Work', icon: Briefcase, color: 'bg-blue-500' },
  { id: 'personal', name: 'Personal', icon: User, color: 'bg-green-500' },
  { id: 'health', name: 'Health', icon: Heart, color: 'bg-red-500' },
  { id: 'learning', name: 'Learning', icon: BookOpen, color: 'bg-purple-500' },
  { id: 'fitness', name: 'Fitness', icon: Dumbbell, color: 'bg-orange-500' },
  { id: 'social', name: 'Social', icon: Users, color: 'bg-pink-500' },
  { id: 'creative', name: 'Creative', icon: Palette, color: 'bg-yellow-500' },
  { id: 'home', name: 'Home', icon: Home, color: 'bg-indigo-500' },
]

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200',
}

const soundFiles = {
  notification: '/sounds/notification.mp3',
  complete: '/sounds/complete.mp3',
  break: '/sounds/break.mp3',
  focus: '/sounds/focus.mp3',
}

export default function FutureTaskApp() {
  const t = useTranslations('common')
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'agenda'>('month')
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [showWelcome, setShowWelcome] = useState(true)
  const [showPricing, setShowPricing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showPomodoro, setShowPomodoro] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [showCompleted, setShowCompleted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentBgClass, setCurrentBgClass] = useState(preferences.backgroundGradient)

  // Form states
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [taskCategory, setTaskCategory] = useState('work')
  const [taskDate, setTaskDate] = useState(new Date())
  const [taskTime, setTaskTime] = useState('09:00')
  const [taskTags, setTaskTags] = useState('')
  const [taskEstimatedTime, setTaskEstimatedTime] = useState(30)
  const [taskRecurring, setTaskRecurring] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none')
  const [taskReminder, setTaskReminder] = useState(false)

  // Statistics
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    todayTasks: 0,
    weekTasks: 0,
    pomodoroSessions: 0,
    focusTime: 0,
    streak: 0,
  })

  useEffect(() => {
    loadTasks()
    loadPreferences()
    calculateStats()
  }, [])

  useEffect(() => {
    setCurrentBgClass(preferences.backgroundGradient)
  }, [preferences.backgroundGradient])

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedTasks = data?.map(task => ({
        ...task,
        date: new Date(task.date),
        reminder: task.reminder ? new Date(task.reminder) : undefined,
        tags: task.tags || [],
        subtasks: task.subtasks || [],
      })) || []

      setTasks(formattedTasks)
    } catch (error) {
      console.error('Error loading tasks:', error)
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      })
    }
  }

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setPreferences({
          ...defaultPreferences,
          ...data,
          premiumExpiry: data.premium_expiry ? new Date(data.premium_expiry) : undefined,
        })
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
    }
  }

  const savePreferences = async (newPreferences: UserPreferences) => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          ...newPreferences,
          premium_expiry: newPreferences.premiumExpiry?.toISOString(),
        })

      if (error) throw error

      setPreferences(newPreferences)
      toast({
        title: "Success",
        description: "Preferences saved successfully",
      })
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive",
      })
    }
  }

  const calculateStats = () => {
    const today = startOfDay(new Date())
    const weekStart = startOfWeek(today)
    const weekEnd = addDays(weekStart, 6)

    const todayTasks = tasks.filter(task => isSameDay(task.date, today))
    const weekTasks = tasks.filter(task => task.date >= weekStart && task.date <= weekEnd)
    const completedTasks = tasks.filter(task => task.completed)

    setStats({
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      todayTasks: todayTasks.length,
      weekTasks: weekTasks.length,
      pomodoroSessions: 0, // This would come from pomodoro tracking
      focusTime: 0, // This would come from time tracking
      streak: 0, // This would be calculated based on daily completion
    })
  }

  const createTask = async () => {
    if (!taskTitle.trim()) return

    const newTask: Omit<Task, 'id'> = {
      title: taskTitle,
      description: taskDescription,
      date: new Date(taskDate.toDateString() + ' ' + taskTime),
      completed: false,
      priority: taskPriority,
      category: taskCategory,
      estimatedTime: taskEstimatedTime,
      tags: taskTags.split(',').map(tag => tag.trim()).filter(Boolean),
      subtasks: [],
      recurring: taskRecurring !== 'none' ? taskRecurring : undefined,
      reminder: taskReminder ? subDays(new Date(taskDate.toDateString() + ' ' + taskTime), 1) : undefined,
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...newTask,
          date: newTask.date.toISOString(),
          reminder: newTask.reminder?.toISOString(),
        }])
        .select()
        .single()

      if (error) throw error

      const createdTask: Task = {
        ...data,
        date: new Date(data.date),
        reminder: data.reminder ? new Date(data.reminder) : undefined,
        tags: data.tags || [],
        subtasks: data.subtasks || [],
      }

      setTasks(prev => [createdTask, ...prev])
      resetTaskForm()
      setShowTaskDialog(false)
      
      toast({
        title: "Success",
        description: "Task created successfully",
      })

      if (preferences.soundEnabled) {
        playSound('notification')
      }
    } catch (error) {
      console.error('Error creating task:', error)
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      })
    }
  }

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          date: updates.date?.toISOString(),
          reminder: updates.reminder?.toISOString(),
        })
        .eq('id', taskId)

      if (error) throw error

      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      ))

      if (updates.completed && preferences.soundEnabled) {
        playSound('complete')
      }
    } catch (error) {
      console.error('Error updating task:', error)
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error

      setTasks(prev => prev.filter(task => task.id !== taskId))
      
      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting task:', error)
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  const resetTaskForm = () => {
    setTaskTitle('')
    setTaskDescription('')
    setTaskPriority('medium')
    setTaskCategory('work')
    setTaskDate(new Date())
    setTaskTime('09:00')
    setTaskTags('')
    setTaskEstimatedTime(30)
    setTaskRecurring('none')
    setTaskReminder(false)
    setEditingTask(null)
  }

  const playSound = (soundType: keyof typeof soundFiles) => {
    if (preferences.soundEnabled) {
      const audio = new Audio(soundFiles[soundType])
      audio.play().catch(console.error)
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    const matchesCompleted = showCompleted || !task.completed

    return matchesSearch && matchesCategory && matchesPriority && matchesCompleted
  })

  const calendarEvents: CalendarEvent[] = filteredTasks.map(task => ({
    id: task.id,
    title: task.title,
    start: task.date,
    end: addDays(task.date, 0),
    resource: task,
  }))

  const todayTasks = tasks.filter(task => isSameDay(task.date, new Date()))
  const upcomingTasks = tasks.filter(task => task.date > new Date() && !task.completed).slice(0, 5)

  if (showWelcome) {
    return <WelcomeScreen onComplete={() => setShowWelcome(false)} />
  }

  if (showPricing) {
    return (
      <PricingSection 
        onBack={() => setShowPricing(false)}
        onUpgrade={(plan) => {
          const newPreferences = {
            ...preferences,
            isPremium: true,
            premiumExpiry: new Date(Date.now() + (plan === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000)
          }
          savePreferences(newPreferences)
          setShowPricing(false)
          toast({
            title: "Welcome to Premium!",
            description: "You now have access to all premium features.",
          })
        }}
      />
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentBgClass} transition-all duration-500`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />

      {/* Ad Placeholder for Free Users */}
      {!preferences.isPremium && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 text-center text-sm">
          <span className="mr-2">🚀 Upgrade to Premium for an ad-free experience!</span>
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => setShowPricing(true)}
            className="ml-2"
          >
            Upgrade Now
          </Button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-white hover:bg-white/20"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">FutureTask</h1>
                {preferences.isPremium && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 w-64"
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPomodoro(true)}
                className="text-white hover:bg-white/20"
              >
                <Clock className="h-4 w-4 mr-2" />
                Pomodoro
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <div className="p-2">
                    <Label className="text-sm font-medium">Category</Label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {taskCategories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-2">
                    <Label className="text-sm font-medium">Priority</Label>
                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-completed"
                        checked={showCompleted}
                        onCheckedChange={setShowCompleted}
                      />
                      <Label htmlFor="show-completed">Show completed</Label>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={() => setShowTaskDialog(true)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setShowSettings(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowPricing(true)}>
                    <Crown className="h-4 w-4 mr-2" />
                    {preferences.isPremium ? 'Manage Premium' : 'Upgrade to Premium'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowTaskDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowPomodoro(true)}>
                    <Clock className="h-4 w-4 mr-2" />
                    Pomodoro
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSettings(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-80 p-0">
            <div className="h-full bg-white/10 backdrop-blur-md">
              <SheetHeader className="p-6 border-b border-white/20">
                <SheetTitle className="text-white">Dashboard</SheetTitle>
              </SheetHeader>
              
              <div className="p-6 space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-white">{stats.todayTasks}</div>
                      <div className="text-sm text-white/60">Today's Tasks</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-white">{stats.completedTasks}</div>
                      <div className="text-sm text-white/60">Completed</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Today's Tasks */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Today's Tasks</h3>
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {todayTasks.map(task => (
                        <div
                          key={task.id}
                          className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg border border-white/20"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateTask(task.id, { completed: !task.completed })}
                            className="p-0 h-auto text-white hover:bg-white/20"
                          >
                            {task.completed ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <div className="h-4 w-4 border border-white/40 rounded" />
                            )}
                          </Button>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm text-white ${task.completed ? 'line-through opacity-60' : ''}`}>
                              {task.title}
                            </div>
                            <div className="text-xs text-white/60">
                              {format(task.date, 'HH:mm')}
                            </div>
                          </div>
                          <Badge className={`${priorityColors[task.priority]} text-xs`}>
                            {task.priority}
                          </Badge>
                        </div>
                      ))}
                      {todayTasks.length === 0 && (
                        <div className="text-center text-white/60 py-8">
                          No tasks for today
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-white/20"
                    onClick={() => setShowTaskDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-white/20"
                    onClick={() => setShowPomodoro(true)}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Start Pomodoro
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-white/20"
                    onClick={() => setCurrentView('week')}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Week View
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* View Selector */}
            <div className="mb-6">
              <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as any)}>
                <TabsList className="bg-white/10 border-white/20">
                  <TabsTrigger value="month" className="text-white data-[state=active]:bg-white/20">
                    Month
                  </TabsTrigger>
                  <TabsTrigger value="week" className="text-white data-[state=active]:bg-white/20">
                    Week
                  </TabsTrigger>
                  <TabsTrigger value="day" className="text-white data-[state=active]:bg-white/20">
                    Day
                  </TabsTrigger>
                  <TabsTrigger value="agenda" className="text-white data-[state=active]:bg-white/20">
                    Agenda
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Calendar */}
            {currentView === 'week' ? (
              <WeeklyView
                tasks={filteredTasks}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onTaskClick={(task) => {
                  setEditingTask(task)
                  setShowTaskDialog(true)
                }}
                onTaskComplete={(taskId) => {
                  const task = tasks.find(t => t.id === taskId)
                  if (task) {
                    updateTask(taskId, { completed: !task.completed })
                  }
                }}
              />
            ) : (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <div style={{ height: '600px' }}>
                    <Calendar
                      localizer={localizer}
                      events={calendarEvents}
                      startAccessor="start"
                      endAccessor="end"
                      view={currentView}
                      onView={setCurrentView}
                      date={selectedDate}
                      onNavigate={setSelectedDate}
                      onSelectEvent={(event) => {
                        setEditingTask(event.resource)
                        setShowTaskDialog(true)
                      }}
                      eventPropGetter={(event) => ({
                        style: {
                          backgroundColor: event.resource.completed ? '#10b981' : '#8b5cf6',
                          borderColor: event.resource.completed ? '#059669' : '#7c3aed',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                        },
                      })}
                      components={{
                        event: ({ event }) => (
                          <div className="flex items-center space-x-1 text-xs">
                            <div className={`w-2 h-2 rounded-full ${
                              taskCategories.find(c => c.id === event.resource.category)?.color || 'bg-gray-500'
                            }`} />
                            <span className="truncate">{event.title}</span>
                            {event.resource.priority === 'high' && (
                              <AlertCircle className="h-3 w-3 text-red-300" />
                            )}
                          </div>
                        ),
                      }}
                      className="text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Task List for Agenda View */}
            {currentView === 'agenda' && (
              <div className="mt-6 space-y-4">
                {filteredTasks.length === 0 ? (
                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardContent className="p-12 text-center">
                      <CalendarIcon className="h-12 w-12 text-white/40 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">No tasks found</h3>
                      <p className="text-white/60 mb-4">
                        {searchQuery || filterCategory !== 'all' || filterPriority !== 'all'
                          ? 'Try adjusting your filters or search query.'
                          : 'Create your first task to get started.'}
                      </p>
                      <Button
                        onClick={() => setShowTaskDialog(true)}
                        className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  filteredTasks.map(task => {
                    const category = taskCategories.find(c => c.id === task.category)
                    const CategoryIcon = category?.icon || Briefcase

                    return (
                      <Card key={task.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateTask(task.id, { completed: !task.completed })}
                              className="p-0 h-auto text-white hover:bg-white/20 mt-1"
                            >
                              {task.completed ? (
                                <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              ) : (
                                <div className="h-5 w-5 border-2 border-white/40 rounded-full" />
                              )}
                            </Button>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className={`text-lg font-semibold text-white ${task.completed ? 'line-through opacity-60' : ''}`}>
                                  {task.title}
                                </h3>
                                <Badge className={`${priorityColors[task.priority]} text-xs`}>
                                  {task.priority}
                                </Badge>
                                {task.priority === 'high' && (
                                  <AlertCircle className="h-4 w-4 text-red-400" />
                                )}
                              </div>

                              {task.description && (
                                <p className={`text-white/70 mb-2 ${task.completed ? 'line-through opacity-60' : ''}`}>
                                  {task.description}
                                </p>
                              )}

                              <div className="flex items-center space-x-4 text-sm text-white/60">
                                <div className="flex items-center space-x-1">
                                  <CategoryIcon className="h-4 w-4" />
                                  <span>{category?.name || task.category}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <CalendarIconSmall className="h-4 w-4" />
                                  <span>{format(task.date, 'MMM d, yyyy HH:mm')}</span>
                                </div>
                                {task.estimatedTime && (
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{task.estimatedTime}m</span>
                                  </div>
                                )}
                              </div>

                              {task.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {task.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs bg-white/10 text-white/80">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {task.subtasks.length > 0 && (
                                <div className="mt-3">
                                  <div className="text-sm text-white/60 mb-1">
                                    Subtasks ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})
                                  </div>
                                  <Progress 
                                    value={(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}
                                    className="h-2 bg-white/20"
                                  />
                                </div>
                              )}
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  setEditingTask(task)
                                  setShowTaskDialog(true)
                                }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  const newTask = { ...task, id: crypto.randomUUID(), title: `${task.title} (Copy)` }
                                  setTasks(prev => [newTask, ...prev])
                                }}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => deleteTask(task.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="sm:max-w-[600px] bg-white/10 backdrop-blur-md border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Enter task title..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>

            <div>
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Enter task description..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-category">Category</Label>
                <Select value={taskCategory} onValueChange={setTaskCategory}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taskCategories.map(category => {
                      const Icon = category.icon
                      return (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="task-priority">Priority</Label>
                <Select value={taskPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setTaskPriority(value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(taskDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={taskDate}
                      onSelect={(date) => date && setTaskDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="task-time">Time</Label>
                <Input
                  id="task-time"
                  type="time"
                  value={taskTime}
                  onChange={(e) => setTaskTime(e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="task-estimated-time">Estimated Time (minutes)</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[taskEstimatedTime]}
                  onValueChange={(value) => setTaskEstimatedTime(value[0])}
                  max={480}
                  min={15}
                  step={15}
                  className="flex-1"
                />
                <span className="text-white w-16 text-right">{taskEstimatedTime}m</span>
              </div>
            </div>

            <div>
              <Label htmlFor="task-tags">Tags (comma separated)</Label>
              <Input
                id="task-tags"
                value={taskTags}
                onChange={(e) => setTaskTags(e.target.value)}
                placeholder="work, urgent, meeting..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-recurring">Recurring</Label>
                <Select value={taskRecurring} onValueChange={(value: 'none' | 'daily' | 'weekly' | 'monthly') => setTaskRecurring(value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="task-reminder"
                  checked={taskReminder}
                  onCheckedChange={setTaskReminder}
                />
                <Label htmlFor="task-reminder">Set reminder</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  resetTaskForm()
                  setShowTaskDialog(false)
                }}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Cancel
              </Button>
              <Button
                onClick={createTask}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {editingTask ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[600px] bg-white/10 backdrop-blur-md border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/10">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
              <TabsTrigger value="appearance">Theme</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications</Label>
                    <p className="text-sm text-white/60">Receive task reminders and updates</p>
                  </div>
                  <Switch
                    checked={preferences.notifications}
                    onCheckedChange={(checked) => 
                      savePreferences({ ...preferences, notifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sound Effects</Label>
                    <p className="text-sm text-white/60">Play sounds for task completion and notifications</p>
                  </div>
                  <Switch
                    checked={preferences.soundEnabled}
                    onCheckedChange={(checked) => 
                      savePreferences({ ...preferences, soundEnabled: checked })
                    }
                  />
                </div>

                <div>
                  <Label>Language</Label>
                  <Select 
                    value={preferences.language} 
                    onValueChange={(value: 'en' | 'es') => 
                      savePreferences({ ...preferences, language: value })
                    }
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Daily Goal (hours)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[preferences.dailyGoal]}
                      onValueChange={(value) => 
                        savePreferences({ ...preferences, dailyGoal: value[0] })
                      }
                      max={16}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-white w-16 text-right">{preferences.dailyGoal}h</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pomodoro" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Focus Time (minutes)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[preferences.pomodoroTime]}
                      onValueChange={(value) => 
                        savePreferences({ ...preferences, pomodoroTime: value[0] })
                      }
                      max={60}
                      min={15}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-white w-16 text-right">{preferences.pomodoroTime}m</span>
                  </div>
                </div>

                <div>
                  <Label>Short Break (minutes)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[preferences.shortBreakTime]}
                      onValueChange={(value) => 
                        savePreferences({ ...preferences, shortBreakTime: value[0] })
                      }
                      max={15}
                      min={3}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-white w-16 text-right">{preferences.shortBreakTime}m</span>
                  </div>
                </div>

                <div>
                  <Label>Long Break (minutes)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[preferences.longBreakTime]}
                      onValueChange={(value) => 
                        savePreferences({ ...preferences, longBreakTime: value[0] })
                      }
                      max={30}
                      min={10}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-white w-16 text-right">{preferences.longBreakTime}m</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-start Breaks</Label>
                    <p className="text-sm text-white/60">Automatically start break timers</p>
                  </div>
                  <Switch
                    checked={preferences.autoStartBreaks}
                    onCheckedChange={(checked) => 
                      savePreferences({ ...preferences, autoStartBreaks: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-start Pomodoros</Label>
                    <p className="text-sm text-white/60">Automatically start focus sessions after breaks</p>
                  </div>
                  <Switch
                    checked={preferences.autoStartPomodoros}
                    onCheckedChange={(checked) => 
                      savePreferences({ ...preferences, autoStartPomodoros: checked })
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Theme</Label>
                  <Select 
                    value={preferences.theme} 
                    onValueChange={(value: 'light' | 'dark' | 'system') => 
                      savePreferences({ ...preferences, theme: value })
                    }
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center space-x-2">
                          <Sun className="h-4 w-4" />
                          <span>Light</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center space-x-2">
                          <Moon className="h-4 w-4" />
                          <span>Dark</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center space-x-2">
                          <Settings className="h-4 w-4" />
                          <span>System</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Background Gradient</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {(preferences.isPremium ? [...backgroundGradients, ...premiumGradients] : backgroundGradients).map((gradient, index) => (
                      <button
                        key={index}
                        onClick={() => savePreferences({ ...preferences, backgroundGradient: gradient })}
                        className={`h-12 rounded-lg bg-gradient-to-r ${gradient} border-2 transition-all ${
                          preferences.backgroundGradient === gradient 
                            ? 'border-white scale-105' 
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        {preferences.backgroundGradient === gradient && (
                          <div className="w-full h-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  {!preferences.isPremium && (
                    <p className="text-sm text-white/60 mt-2">
                      <Crown className="h-3 w-3 inline mr-1" />
                      Premium gradients available with upgrade
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="premium" className="space-y-4">
              <div className="text-center space-y-4">
                {preferences.isPremium ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Crown className="h-6 w-6 text-yellow-400" />
                      <h3 className="text-xl font-bold text-white">Premium Active</h3>
                    </div>
                    <p className="text-white/60">
                      Your premium subscription is active until{' '}
                      {preferences.premiumExpiry && format(preferences.premiumExpiry, 'PPP')}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white/10 p-3 rounded-lg">
                        <Check className="h-4 w-4 text-green-400 mb-1" />
                        <div>Ad-free experience</div>
                      </div>
                      <div className="bg-white/10 p-3 rounded-lg">
                        <Check className="h-4 w-4 text-green-400 mb-1" />
                        <div>Premium themes</div>
                      </div>
                      <div className="bg-white/10 p-3 rounded-lg">
                        <Check className="h-4 w-4 text-green-400 mb-1" />
                        <div>Advanced analytics</div>
                      </div>
                      <div className="bg-white/10 p-3 rounded-lg">
                        <Check className="h-4 w-4 text-green-400 mb-1" />
                        <div>Priority support</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="h-6 w-6 text-purple-400" />
                      <h3 className="text-xl font-bold text-white">Upgrade to Premium</h3>
                    </div>
                    <p className="text-white/60">
                      Unlock advanced features and remove ads
                    </p>
                    <Button
                      onClick={() => setShowPricing(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      View Plans
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Pomodoro Timer Dialog */}
      <Dialog open={showPomodoro} onOpenChange={setShowPomodoro}>
        <DialogContent className="sm:max-w-[400px] bg-white/10 backdrop-blur-md border-white/20 text-white">
          <PomodoroTimer
            preferences={preferences}
            onClose={() => setShowPomodoro(false)}
            onComplete={(sessionType) => {
              if (preferences.soundEnabled) {
                playSound(sessionType === 'focus' ? 'complete' : 'break')
              }
              toast({
                title: sessionType === 'focus' ? 'Focus session complete!' : 'Break time!',
                description: sessionType === 'focus' 
                  ? 'Great job! Time for a break.' 
                  : 'Break is over. Ready to focus?',
              })
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

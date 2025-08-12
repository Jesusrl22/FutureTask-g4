import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FutureTask - Tu Asistente de Productividad",
  description: "Organiza tus tareas, alcanza tus metas y desbloquea tu potencial con FutureTask.",
  keywords: ["productividad", "tareas", "calendario", "pomodoro", "logros"],
  authors: [{ name: "FutureTask Team" }],
  creator: "FutureTask",
  publisher: "FutureTask",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://futuretask.vercel.app"),
  openGraph: {
    title: "FutureTask - Tu Asistente de Productividad",
    description: "Organiza tus tareas, alcanza tus metas y desbloquea tu potencial con FutureTask.",
    url: "https://futuretask.vercel.app",
    siteName: "FutureTask",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FutureTask - Tu Asistente de Productividad",
    description: "Organiza tus tareas, alcanza tus metas y desbloquea tu potencial con FutureTask.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

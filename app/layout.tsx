import type React from "react"
import type { Metadata } from "next"
import { Inter, Raleway } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { FloatingRadioPlayer } from "@/components/floating-radio-player"
import { AudioProvider } from "@/components/audio-context"
import { NavigationProvider } from "@/components/navigation-provider"
import { CookieConsent } from "@/components/cookie-consent"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" })

export const metadata: Metadata = {
  title: "@initpedro | Dev",
  description: "Portfolio de Pedro - Especialista em Desenvolvimento Web",
  generator: "v0.app",
  icons: {
    icon: "https://i.ibb.co/20gLBQpg/1758550635880.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      </head>
      <body className={`${inter.className} antialiased overflow-x-hidden w-full relative`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <AudioProvider>
            <NavigationProvider>
            <Navbar />
            {children}
            <FloatingActions />
            <FloatingRadioPlayer />
            <CookieConsent />
            <Footer />
            <Toaster />
            <Analytics />
            </NavigationProvider>
            </AudioProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

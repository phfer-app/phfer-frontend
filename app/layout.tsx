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
      <body className={`${inter.className} antialiased overflow-x-hidden`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <AudioProvider>
            <NavigationProvider>
            {/* Page border lines - outside padding */}
            <div className="fixed inset-0 pointer-events-none z-50">
              <div className="container mx-auto h-full relative">
                {/* Top border */}
                <div className="absolute top-0 left-0 right-0 h-px bg-border/40"></div>
                {/* Bottom border - hidden on mobile */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-border/40 hidden md:block"></div>
                {/* Left border */}
                <div className="absolute top-0 bottom-0 left-0 w-px bg-border/40"></div>
                {/* Right border */}
                <div className="absolute top-0 bottom-0 right-0 w-px bg-border/40"></div>
                
                {/* Additional decorative lines */}
                <div className="absolute top-0 left-1 right-1 h-px bg-border/20 opacity-60"></div>
                {/* Bottom decorative line - hidden on mobile */}
                <div className="absolute bottom-0 left-1 right-1 h-px bg-border/20 opacity-60 hidden md:block"></div>
                <div className="absolute top-1 bottom-1 left-0 w-px bg-border/20 opacity-60"></div>
                <div className="absolute top-1 bottom-1 right-0 w-px bg-border/20 opacity-60"></div>
              </div>
            </div>
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

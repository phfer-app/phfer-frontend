"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

const STORAGE_KEY = "cookie-consent-accepted"

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const { language } = useLanguage()
  const isPt = language === "pt"

  useEffect(() => {
    try {
      const accepted = localStorage.getItem(STORAGE_KEY)
      if (!accepted) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  const acceptCookies = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true")
    } catch {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-60">
      <div className="container mx-auto px-4 pb-4">
        <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/70 shadow-lg">
          <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <p className="text-sm text-muted-foreground flex-1">
              {isPt
                ? "Este site utiliza cookies para melhorar sua experiência. Ao continuar, você concorda com o uso de cookies. Leia mais em "
                : "This site uses cookies to improve your experience. By continuing, you agree to the use of cookies. Read more in "}
              <a href="/cookies" className="text-primary hover:underline font-medium">{isPt ? "Cookies" : "Cookies"}</a>.
            </p>
            <div className="flex items-center gap-2">
              <a href="/cookies" className="px-3 py-2 text-sm font-medium rounded-md border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-colors">
                {isPt ? "Saber mais" : "Learn more"}
              </a>
              <Button size="sm" className="rounded-md cursor-pointer" onClick={acceptCookies}>
                {isPt ? "Aceitar cookies" : "Accept cookies"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



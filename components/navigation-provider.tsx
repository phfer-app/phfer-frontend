"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type Route = "home" | "about" | "career" | "blog"

interface NavigationContextType {
  currentRoute: Route
  setCurrentRoute: (route: Route) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState<Route>("home")

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentRoute])

  return (
    <NavigationContext.Provider value={{ currentRoute, setCurrentRoute }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider")
  }
  return context
}


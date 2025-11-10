"use client"

import { useState, useEffect, RefObject } from "react"

export function useScrollAnimation(ref: RefObject<HTMLElement>): boolean {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.05, // Mais acelerado - aparece mais cedo
        rootMargin: "0px 0px -50px 0px", // Menos margem - aparece mais rápido
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [ref])

  return isVisible
}

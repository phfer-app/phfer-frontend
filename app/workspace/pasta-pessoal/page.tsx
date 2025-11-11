"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

export default function PastaPessoalPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/not-found")
      return
    }
    
    // Por enquanto, redireciona para not-found
    router.push("/not-found")
  }, [router])

  return null
}









"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { HeroSection } from "@/components/hero-section"
import { CTAParallaxSection } from "@/components/cta-parallax-section"
import { AboutSection } from "@/components/about-section"
import { ProjectsSection } from "@/components/projects-section"
import { SkillsSection } from "@/components/skills-section"
import { ExperienceSection } from "@/components/experience-section"
import { FAQSection } from "@/components/faq-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FinalCTASection } from "@/components/final-cta-section"
import { ContactSection } from "@/components/contact-section"
import { BlogSection } from "@/components/blog-section"
import { useNavigation } from "@/components/navigation-provider"

function HomePage() {
  return (
    <>
      <HeroSection />
      <CTAParallaxSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
    </>
  )
}

function AboutPage() {
  return (
    <>
      <AboutSection />
      <SkillsSection />
      <FinalCTASection />
    </>
  )
}

function CareerPage() {
  return (
    <>
      <ProjectsSection />
      <ExperienceSection />
    </>
  )
}

function BlogPage() {
  return (
    <>
      <BlogSection />
    </>
  )
}

function OAuthHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Processar código OAuth se estiver presente na URL
  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      // Redirecionar para a página de callback para processar o código
      router.replace(`/auth/callback?code=${code}`)
    }
  }, [searchParams, router])

  return null
}

export default function Home() {
  const { currentRoute } = useNavigation()

  return (
    <main className="overflow-visible">
      <Suspense fallback={null}>
        <OAuthHandler />
      </Suspense>
      {currentRoute === "home" && <HomePage />}
      {currentRoute === "about" && <AboutPage />}
      {currentRoute === "career" && <CareerPage />}
      {currentRoute === "blog" && <BlogPage />}
    </main>
  )
}

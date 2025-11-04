"use client"

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
      <ExperienceSection />
      <ProjectsSection />
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

export default function Home() {
  const { currentRoute } = useNavigation()

  return (
    <main>
      {currentRoute === "home" && <HomePage />}
      {currentRoute === "about" && <AboutPage />}
      {currentRoute === "career" && <CareerPage />}
      {currentRoute === "blog" && <BlogPage />}
    </main>
  )
}

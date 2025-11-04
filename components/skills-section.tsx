"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { SectionCorners } from "@/components/section-corners"

type SkillCategory = "all" | "front" | "back" | "other"

const skills = [
  // Frontend
  { name: "HTML5", icon: "html5", category: "front", description: "Estrutura semântica e acessível" },
  { name: "CSS3", icon: "css3", category: "front", description: "Estilos avançados e responsivos" },
  { name: "Sass/SCSS", icon: "sass", category: "front", description: "Pré-processador CSS moderno" },
  { name: "Tailwind CSS", icon: "tailwindcss", category: "front", description: "Framework CSS utilitário" },
  { name: "JavaScript", icon: "javascript", category: "front", description: "Lógica dinâmica do frontend" },
  { name: "TypeScript", icon: "typescript", category: "front", description: "JavaScript com tipagem estática" },
  { name: "React", icon: "react", category: "front", description: "Biblioteca para interfaces" },
  { name: "Next.js", icon: "nextjs", category: "front", description: "Framework React full-stack" },
  
  // Backend
  { name: "Node.js", icon: "nodejs", category: "back", description: "Runtime JavaScript no servidor" },
  { name: "Express", icon: "express", category: "back", description: "Framework web minimalista" },
  { name: "C#", icon: "csharp", category: "back", description: "Linguagem orientada a objetos" },
  { name: ".NET / ASP.NET", icon: "dotnet", category: "back", description: "Plataforma .NET Microsoft" },
  { name: "Python", icon: "python", category: "back", description: "Linguagem versátil e clara" },
  { name: "Java", icon: "java", category: "back", description: "Linguagem orientada a objetos" },
  { name: "APIs", icon: "api", category: "back", description: "Integração entre sistemas" },
  { name: "PostgreSQL", icon: "postgresql", category: "back", description: "Banco de dados relacional" },
  { name: "MySQL", icon: "mysql", category: "back", description: "Banco de dados SQL popular" },
  { name: "MongoDB", icon: "mongodb", category: "back", description: "Banco de dados NoSQL" },
  
  // Other Tools
  { name: "Git", icon: "git", category: "other", description: "Controle de versão distribuído" },
  { name: "Docker", icon: "docker", category: "other", description: "Containerização de aplicações" },
  { name: "Figma", icon: "figma", category: "other", description: "Ferramenta de design colaborativo" },
  { name: "Power BI", icon: "powerbi", category: "other", description: "Inteligência de negócios visual" },
  { name: "Netlify", icon: "netlify", category: "other", description: "Deploy e hospedagem web" },
]

const filterOptions = [
  { value: "all" as SkillCategory },
  { value: "front" as SkillCategory },
  { value: "back" as SkillCategory },
  { value: "other" as SkillCategory },
]

export function SkillsSection() {
  const [filter, setFilter] = useState<SkillCategory>("all")
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useLanguage()

  const filteredSkills = skills.filter((skill) => filter === "all" || skill.category === filter)
  const displayedSkills = isExpanded ? filteredSkills : filteredSkills.slice(0, 2)

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <SectionCorners />
      {/* Background blur elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-20 -z-10"></div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="mb-16">
          <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30" variant="outline">
            {t("skills.badge")}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            {t("skills.title")} & <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{t("skills.title2")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl text-lg">
            {t("skills.description")}
          </p>
        </div>

        {/* Main Layout - Menu + Skills Grid */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Sidebar Menu */}
          <div className="lg:w-48 shrink-0">
            <div className="space-y-2 lg:sticky lg:top-24">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    filter === option.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent hover:border-border"
                  }`}
                >
                  {t(option.value === "all" ? "skills.all" : option.value === "front" ? "skills.frontend" : option.value === "back" ? "skills.backend" : "skills.tools")}
                </button>
              ))}
            </div>
          </div>

          {/* Right Skills Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedSkills.map((skill) => (
                <div
                  key={skill.name}
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  className={`group relative p-6 rounded-xl border border-border/50 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:border-primary/50
                  `}
                >
                  {/* Top accent line */}
                  <div className={`absolute top-0 left-2 right-2 h-0.5 rounded-t-xl transition-all duration-300 ${
                    skill.category === "front" ? "bg-linear-to-r from-cyan-500 to-blue-500" : skill.category === "back" ? "bg-linear-to-r from-purple-500 to-pink-500" : "bg-linear-to-r from-amber-500 to-orange-500"
                  }`}></div>

                  <div className="flex flex-col items-center gap-4 h-full justify-between">
                    {/* Icon Container */}
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300
                        ${skill.category === "front" ? "bg-cyan-500/20 blur-lg" : skill.category === "back" ? "bg-purple-500/20 blur-lg" : "bg-amber-500/20 blur-lg"}
                      `}></div>
                      <i className={`devicon-${skill.icon}-plain colored text-5xl relative z-10 transition-transform duration-300`}></i>
                    </div>

                    {/* Skill Info */}
                    <div className="text-center w-full">
                      <h3 className="font-bold text-lg mb-3">{skill.name}</h3>
                      <p className="text-sm text-muted-foreground">{t(`skill.${skill.icon.toLowerCase()}`)}</p>
                    </div>

                    {/* Category Badge */}
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        skill.category === "front"
                          ? "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/30"
                          : skill.category === "back" ? "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30" : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {skill.category === "front" ? t("skills.category.front") : skill.category === "back" ? t("skills.category.back") : t("skills.category.other")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredSkills.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">{t("skills.no_skills_found")}</p>
              </div>
            )}

            {/* See More / Collapse Button */}
            {filteredSkills.length > 2 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="group relative px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-2 overflow-hidden shadow-2xl active:scale-95 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, hsl(260, 75%, 60%) 0%, hsl(67, 100%, 45%) 100%)",
                  }}
                >
                  <span className="relative z-10 text-white">
                    {isExpanded ? t("skills.see_less") || "Ver Menos" : t("skills.see_more") || "Ver Mais"} ({isExpanded ? filteredSkills.length : `2/${filteredSkills.length}`})
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

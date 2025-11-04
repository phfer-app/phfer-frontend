"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProjectModal } from "@/components/project-modal"
import { ArrowRight, Code2, Zap } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { SectionCorners } from "@/components/section-corners"

const projects = [
  {
    id: 1,
    title: "Portfólio Pessoal",
    description: "Meu portfólio pessoal, desenvolvido como uma vitrine do meu trabalho e habilidades como desenvolvedor.",
    image: "https://i.ibb.co/1GWXnXSm/Screenshot-1.png",
    fullDescription:
      "Meu portfólio pessoal, desenvolvido como uma vitrine do meu trabalho e habilidades como desenvolvedor. Construído com tecnologias modernas garantindo performance, responsividade e facilidade de manutenção. Aqui é possível conhecer meus projetos, minhas experiências e como transformo ideias em soluções digitais.",
    technologies: ["JavaScript", "TypeScript", "React", "HTML", "CSS", "Tailwind", "Sass"],
    category: "Full Stack",
    github: "https://github.com/initpedro/phfer",
    demo: "https://phfer.netlify.app/",
  },
  {
    id: 2,
    title: "Loja Virtual Mimo",
    description: "Loja virtual criada para proporcionar uma experiência de compra fluida e agradável.",
    image: "https://i.ibb.co/gZgxtbSM/Sem-t-tulo.png",
    fullDescription:
      "Loja virtual criada para proporcionar uma experiência de compra fluida e agradável. Com tecnologias modernas, o projeto combina funcionalidade e estética, garantindo que cada produto seja acessível e que o processo de compra seja simples e intuitivo.",
    technologies: ["JavaScript", "HTML", "CSS", "Tailwind", "Sass"],
    category: "Frontend",
    github: "https://github.com/initpedro/mimo-website",
    demo: "https://initpedro.github.io/mimo-website/",
  },
  {
    id: 3,
    title: "Jogo de Xadrez",
    description: "Jogo de Xadrez desenvolvido para terminal em C#, focado em lógica de programação.",
    image: "https://i.ibb.co/tTYL33fL/images.jpg",
    fullDescription:
      "Jogo de Xadrez desenvolvido para terminal em C#, focado em lógica de programação, estruturas de dados e aplicação de metodologias ágeis. Simula um ambiente completo de xadrez, permitindo que o jogador interaja diretamente pelo terminal.",
    technologies: ["C#"],
    category: "Backend",
    github: "https://github.com/initpedro/xadrez-terminal-csharp",
    demo: "",
  },
]

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)
  const [offset, setOffset] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const scrollProgress = Math.max(0, 1 - rect.top / window.innerHeight)
        setOffset(scrollProgress * 30)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Frontend":
        return "bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-500/30"
      case "Backend":
        return "bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30"
      case "Full Stack":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30"
      default:
        return "bg-primary/20 text-primary border-primary/30"
    }
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-24 overflow-hidden"
    >
      <SectionCorners />
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-background via-background to-secondary/5" />

      {/* Animated blobs */}
      <div
        className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50"
        style={{ transform: `translateY(${offset * 0.3}px)` }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50"
        style={{ transform: `translateY(${offset * -0.3}px)` }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30" variant="outline">
            {t("projects.badge")}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            {t("projects.title")} <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{t("projects.title2")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl text-lg">
            {t("projects.description")}
          </p>
        </div>

        {/* Staggered Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-max">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`${index === 1 ? "md:row-span-1 md:row-start-1" : ""}`}
                style={{
                  transform: `translateY(${offset * (0.1 + index * 0.05)}px)`,
                }}
              >
                <div className="group relative h-full rounded-2xl border border-border/50 overflow-hidden backdrop-blur-sm hover:border-primary/50 transition-all duration-300 bg-card/30">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-2 right-2 h-0.5 rounded-t-2xl bg-linear-to-r from-primary to-secondary transition-all duration-300" />

                  {/* Image container */}
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category badge */}
                    <Badge
                      variant="outline"
                      className={`absolute top-4 right-4 ${getCategoryColor(project.category)}`}
                    >
                      {project.category}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                        {t(`project${project.id}.title`)}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {t(`project${project.id}.description`)}
                      </p>
                    </div>

                    {/* Tech stack mini */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.technologies.slice(0, 2).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 2 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          +{project.technologies.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Button */}
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="w-full px-4 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                    >
                      {t("projects.details")}
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-20 flex justify-center">
          <a
            href="https://github.com/initpedro"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-2 overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #333 0%, #171717 100%)",
            }}
          >
            <span className="relative z-10 text-white flex items-center gap-2">
              {t("projects.github")}
              <Code2 className="h-5 w-5 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </a>
        </div>
      </div>

      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </section>
  )
}

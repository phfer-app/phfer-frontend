"use client"

import { useEffect } from "react"
import { X, Github, ExternalLink, Code2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"

interface Project {
  id: number
  title: string
  description: string
  image: string
  fullDescription: string
  technologies: string[]
  github: string
  demo: string
}

interface ProjectModalProps {
  project: Project
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden"

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEscape)
    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  const { t } = useLanguage()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
      {/* Backdrop com blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal animado - Fullscreen responsive */}
      <div className="relative w-full h-full md:h-[90vh] md:max-w-6xl bg-card rounded-none md:rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col md:flex-row">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-primary/20 hover:border-primary/50 border border-transparent flex items-center justify-center transition-all duration-300 cursor-pointer"
        >
          <X className="h-5 w-5 text-primary cursor-pointer" />
        </button>

        {/* Left: Image - Smaller width */}
        <div className="w-full md:w-2/5 lg:w-1/3 relative overflow-hidden">
          <img
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            className="w-full h-64 md:h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/40" />
        </div>

        {/* Right: Content - Larger width */}
        <div className="w-full md:w-3/5 lg:w-2/3 overflow-y-auto bg-card flex flex-col">
          <div className="p-6 md:p-8 space-y-6 flex-1">
            {/* Header */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{t(`project${project.id}.title`)}</h2>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{t(`project${project.id}.fullDescription`)}</p>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" />
                {t("project_modal.technologies")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/30 text-xs md:text-sm"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">{t("project_modal.about_project")}</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {t(`project${project.id}.description`)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 md:p-8 border-t border-border/30 space-y-3 bg-linear-to-b from-transparent to-muted/30">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-3 rounded-lg bg-primary hover:border-primary/80 border border-primary text-primary-foreground font-semibold transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-3 rounded-lg border-2 border-primary/50 hover:border-primary bg-primary/5 text-primary font-semibold transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <ExternalLink className="h-4 w-4" />
                <span>{t("project_modal.view_demo")}</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="w-full px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground bg-muted/30 hover:border-border/50 border border-transparent transition-all duration-300 text-sm cursor-pointer"
            >
              {t("project_modal.close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

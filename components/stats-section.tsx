import { Card } from "@/components/ui/card"
import { Code2, Briefcase, DollarSign, CheckCircle2, Shield, Layers } from "lucide-react"

const stats = [
  { icon: Code2, value: "+3", label: "Anos como Programador" },
  { icon: Briefcase, value: "+5", label: "Anos de Experiência" },
  { icon: DollarSign, value: "+12k", label: "Receita Gerada" },
  { icon: CheckCircle2, value: "+7", label: "Projetos Concluídos" },
]

const features = [
  { icon: Code2, label: "Software Developer" },
  { icon: Layers, label: "Múltiplos Projetos" },
  { icon: Shield, label: "Segurança" },
]

export function StatsSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="p-6 text-center transition-shadow">
                <Icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            )
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="p-6 text-center transition-shadow bg-primary/5">
                <Icon className="h-10 w-10 mx-auto mb-3 text-primary" />
                <div className="font-semibold">{feature.label}</div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

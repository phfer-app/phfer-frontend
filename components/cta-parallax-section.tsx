"use client"

import { useRef } from "react"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function CTAParallaxSection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useScrollAnimation(sectionRef)

  return (
    <section
      ref={sectionRef}
      className="relative overflow-visible bg-linear-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      {/* Decorative SVG - Top Right - Outside container to avoid clipping */}
      <div className="absolute right-0 top-0 hidden lg:block opacity-30 pointer-events-none" style={{ transform: 'translate(50%, -50%)' }}>
        <svg 
          width="1180" 
          height="819" 
          viewBox="0 0 1180 819" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_2980_381)" style={{ mixBlendMode: "multiply" }}>
            <path 
              d="M772.069 858.527H712.076L682.397 391.707L369.773 -118.82L1127.74 -118.82L808.175 391.707L772.069 858.527Z" 
              fill="currentColor"
              className="text-foreground/20"
              fillOpacity="0.5"
            />
          </g>
          <defs>
            <filter id="filter0_f_2980_381" x="150.627" y="-337.966" width="1196.26" height="1415.64" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="109.573" result="effect1_foregroundBlur_2980_381" />
            </filter>
          </defs>
        </svg>
      </div>

      <div className={`flex flex-col md:flex-row gap-16 md:gap-8 justify-between items-center py-[100px] px-6 md:px-8 lg:px-16 xl:px-[104px] relative transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>
        {/* Left Side - Title */}
        <div className="relative">
          <h2 className="text-[32px] font-semibold md:text-5xl flex flex-col leading-[120%] tracking-[-1.92px] text-foreground">
            {t("cta_parallax.title")}{" "}
            <span>{t("cta_parallax.title2")}</span>
          </h2>
          
          {/* Decorative SVG underline - hidden on mobile */}
          <div className="hidden md:block absolute -bottom-[32px] -left-[12px] text-primary">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="207" 
              height="32" 
              viewBox="0 0 207 32" 
              fill="none"
            >
              <path 
                d="M6.78386 10.0373L202.192 10.7761L29.2835 20.3483L179 20.3483" 
                stroke="currentColor"
                strokeWidth="5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Right Side - Stats */}
        <div className="flex flex-wrap gap-4">
          <div className="w-[190px] space-y-5 md:text-right">
            <p className="text-[36px] md:text-[64px] font-semibold leading-[45px] tracking-[-2.56px] text-foreground">
              <span className="hidden md:inline text-primary leading-[45px]">+</span> {t("cta_parallax.stat1_value")}
            </p>
            <p className="font-semibold leading-[11px] text-foreground">{t("cta_parallax.stat1_label")}</p>
          </div>
          
          <div className="w-[190px] space-y-5 md:text-right">
            <p className="text-[36px] md:text-[64px] font-semibold leading-[45px] tracking-[-2.56px] text-foreground">
              {t("cta_parallax.stat2_value")}<span className="text-primary">{t("cta_parallax.stat2_symbol")}</span>
            </p>
            <p className="font-semibold leading-[11px] text-foreground">{t("cta_parallax.stat2_label")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

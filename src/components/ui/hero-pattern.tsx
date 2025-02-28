"use client"

import { useEffect, useRef } from "react"

export function HeroPattern() {
  const patternRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const pattern = patternRef.current
    if (!pattern) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = pattern.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      pattern.style.setProperty("--mouse-x", `${x}px`)
      pattern.style.setProperty("--mouse-y", `${y}px`)
    }

    pattern.addEventListener("mousemove", handleMouseMove)
    return () => pattern.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div ref={patternRef} className="h-full w-full">
        {/* Grid */}
        <div className="absolute inset-0 bg-grid opacity-25" />
        
        {/* Radial Gradient */}
        <div className="absolute inset-0 bg-radial-gradient" />
        
        {/* Noise Texture */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/0" />
        
        {/* Interactive Gradient */}
        <div className="absolute inset-0 hover-card-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </div>
  )
} 
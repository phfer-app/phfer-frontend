"use client"

export function SectionDivider() {
  return (
    <div className="relative w-full py-8 md:py-16">
      {/* Lines outside padding - before container border */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top and bottom lines - full width */}
        <div className="absolute top-0 left-0 right-0 h-px bg-border/30"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-border/30"></div>
        
        {/* Vertical lines on sides - outside container */}
        <div className="absolute top-0 bottom-0 left-0 w-px bg-border/25"></div>
        <div className="absolute top-0 bottom-0 right-0 w-px bg-border/25"></div>
        
        {/* Additional vertical lines pattern */}
        <div className="absolute top-0 bottom-0 left-4 w-px bg-border/15 opacity-60"></div>
        <div className="absolute top-0 bottom-0 right-4 w-px bg-border/15 opacity-60"></div>
        <div className="absolute top-0 bottom-0 left-8 w-px bg-border/12 opacity-40"></div>
        <div className="absolute top-0 bottom-0 right-8 w-px bg-border/12 opacity-40"></div>
      </div>
      
      {/* Container with padding */}
      <div className="container mx-auto px-4 md:px-8 relative z-10 h-full">
        {/* Grid pattern - Lines inside container */}
        <div className="relative h-full w-full">
          {/* Grid background pattern */}
          <div 
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
          
          {/* Additional dense grid */}
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />
          
          {/* Vertical lines - dense pattern - side by side */}
          <div className="absolute inset-0 flex justify-start items-center">
            <div className="flex gap-2 h-full items-center w-full">
              {Array.from({ length: 50 }).map((_, i) => (
                <div 
                  key={i}
                  className="w-px h-full bg-border"
                  style={{ opacity: 0.5 + (i % 4) * 0.2 }}
                />
              ))}
            </div>
          </div>
          
          {/* Horizontal lines - dense pattern */}
          <div className="absolute inset-0 flex flex-col justify-start items-center">
            <div className="flex flex-col gap-2 w-full items-center h-full">
              {Array.from({ length: 30 }).map((_, i) => (
                <div 
                  key={i}
                  className="h-px w-full bg-border"
                  style={{ opacity: 0.5 + (i % 4) * 0.2 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


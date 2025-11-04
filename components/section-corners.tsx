"use client"

export function SectionCorners() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <div className="container mx-auto h-full relative px-4 md:px-8">
        {/* Top Left Corner - aligned with container padding */}
        <div 
          className="absolute top-0 left-4 md:left-8"
          style={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* 4-pointed star */}
          <div className="relative w-6 h-6">
            {/* Vertical line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-border/70"></div>
            {/* Horizontal line */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 h-px w-full bg-border/70"></div>
            {/* Diagonal lines */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-border/70 origin-center"
              style={{ transform: 'translate(-50%, -50%) rotate(45deg)' }}
            />
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-border/70 origin-center"
              style={{ transform: 'translate(-50%, -50%) rotate(-45deg)' }}
            />
          </div>
        </div>
        
        {/* Top Right Corner - aligned with container padding */}
        <div 
          className="absolute top-0 right-4 md:right-8"
          style={{
            transform: 'translate(50%, -50%)',
          }}
        >
          {/* 4-pointed star */}
          <div className="relative w-6 h-6">
            {/* Vertical line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-border/70"></div>
            {/* Horizontal line */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 h-px w-full bg-border/70"></div>
            {/* Diagonal lines */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-border/70 origin-center"
              style={{ transform: 'translate(-50%, -50%) rotate(45deg)' }}
            />
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-border/70 origin-center"
              style={{ transform: 'translate(-50%, -50%) rotate(-45deg)' }}
            />
          </div>
        </div>
        
        {/* Bottom Left Corner - aligned with container padding */}
        <div 
          className="absolute bottom-0 left-4 md:left-8"
          style={{
            transform: 'translate(-50%, 50%)',
          }}
        >
          {/* 4-pointed star */}
          <div className="relative w-6 h-6">
            {/* Vertical line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-border/70"></div>
            {/* Horizontal line */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 h-px w-full bg-border/70"></div>
            {/* Diagonal lines */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-border/70 origin-center"
              style={{ transform: 'translate(-50%, -50%) rotate(45deg)' }}
            />
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-border/70 origin-center"
              style={{ transform: 'translate(-50%, -50%) rotate(-45deg)' }}
            />
          </div>
        </div>
        
        {/* Bottom Right Corner - aligned with container padding */}
        <div 
          className="absolute bottom-0 right-4 md:right-8"
          style={{
            transform: 'translate(50%, 50%)',
          }}
        >
          {/* 4-pointed star */}
          <div className="relative w-6 h-6">
            {/* Vertical line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-border/70"></div>
            {/* Horizontal line */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 h-px w-full bg-border/70"></div>
            {/* Diagonal lines */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-border/70 origin-center"
              style={{ transform: 'translate(-50%, -50%) rotate(45deg)' }}
            />
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-border/70 origin-center"
              style={{ transform: 'translate(-50%, -50%) rotate(-45deg)' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}


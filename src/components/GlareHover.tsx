import { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface GlareHoverProps {
  children: React.ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  className?: string;
}

export default function GlareHover({
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.3,
  glareAngle = -30,
  glareSize = 150,
  transitionDuration = 800,
  playOnce = false,
  className = '',
}: GlareHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    // Reset position
    controls.set({ x: '-100%', y: '-100%' });
  }, [controls]);

  const handleMouseEnter = () => {
    if (playOnce && hasPlayed) return;
    
    controls.start({
      x: ['-100%', '200%'],
      y: ['-100%', '200%'],
      transition: {
        duration: transitionDuration / 1000,
        ease: 'easeInOut',
      },
    }).then(() => {
      setHasPlayed(true);
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Target Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>

      {/* Glare Effect */}
      <motion.div
        animate={controls}
        initial={{ x: '-150%', y: '-150%' }}
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          width: `${glareSize}%`,
          height: `${glareSize}%`,
          background: `linear-gradient(
            ${glareAngle}deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 45%,
            ${glareColor}${Math.floor(glareOpacity * 255).toString(16).padStart(2, '0')} 50%,
            rgba(255, 255, 255, 0) 55%,
            rgba(255, 255, 255, 0) 100%
          )`,
          transformOrigin: 'center center',
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}

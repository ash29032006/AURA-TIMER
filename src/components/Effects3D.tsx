import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { ReactNode, MouseEvent } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: number;
}

export function TiltCard({ children, className = '', glowColor = 'rgba(255,255,255,0.1)', intensity = 15 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${intensity}deg`, `-${intensity}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${intensity}deg`, `${intensity}deg`]);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const xPos = (e.clientX - rect.left) / rect.width - 0.5;
    const yPos = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPos);
    y.set(yPos);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [x, y]);

  const sheenX = useTransform(mouseXSpring, [-0.5, 0.5], ['-100%', '200%']);
  const sheenY = useTransform(mouseYSpring, [-0.5, 0.5], ['-100%', '200%']);
  const glareBackground = useTransform(
    [sheenX, sheenY],
    ([sx, sy]) => `radial-gradient(circle at ${sx} ${sy}, ${glowColor}, transparent 60%)`
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: '1200px',
      }}
      className={`relative ${className}`}
    >
      {children}
      
      {/* Glare / Sheen overlay */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-30"
        style={{
          background: glareBackground,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
      />
    </motion.div>
  );
}


/** Animated 3D CSS shape that floats and rotates */
interface FloatingShapeProps {
  shape: 'cube' | 'octahedron' | 'sphere' | 'torus' | 'pyramid';
  color: string;
  size?: number;
  className?: string;
}

export function FloatingShape({ shape, color, size = 60, className = '' }: FloatingShapeProps) {
  return (
    <div 
      className={`floating-shape ${className}`}
      style={{ 
        width: size, 
        height: size, 
        perspective: '600px',
      }}
    >
      {shape === 'cube' && <AnimatedCube color={color} size={size} />}
      {shape === 'octahedron' && <AnimatedOctahedron color={color} size={size} />}
      {shape === 'sphere' && <AnimatedSphere color={color} size={size} />}
      {shape === 'torus' && <AnimatedTorus color={color} size={size} />}
      {shape === 'pyramid' && <AnimatedPyramid color={color} size={size} />}
    </div>
  );
}

function AnimatedCube({ color, size }: { color: string; size: number }) {
  const half = size / 2;
  const faceStyle = (transform: string): React.CSSProperties => ({
    position: 'absolute',
    width: size,
    height: size,
    border: `1px solid ${color}`,
    backgroundColor: `${color}15`,
    backdropFilter: 'blur(2px)',
    transform,
    boxShadow: `inset 0 0 20px ${color}20, 0 0 10px ${color}30`,
  });
  
  return (
    <div className="animate-spin-slow" style={{ 
      width: size, height: size, position: 'relative',
      transformStyle: 'preserve-3d',
      animation: 'spin3d 12s linear infinite',
    }}>
      <div style={faceStyle(`translateZ(${half}px)`)} />
      <div style={faceStyle(`translateZ(-${half}px) rotateY(180deg)`)} />
      <div style={faceStyle(`translateX(${half}px) rotateY(90deg)`)} />
      <div style={faceStyle(`translateX(-${half}px) rotateY(-90deg)`)} />
      <div style={faceStyle(`translateY(-${half}px) rotateX(90deg)`)} />
      <div style={faceStyle(`translateY(${half}px) rotateX(-90deg)`)} />
    </div>
  );
}

function AnimatedOctahedron({ color, size }: { color: string; size: number }) {
  return (
    <div style={{ 
      width: size, height: size, position: 'relative',
      transformStyle: 'preserve-3d',
      animation: 'spin3d 10s linear infinite',
    }}>
      {/* Diamond / Octahedron made of two pyramids */}
      <div style={{
        position: 'absolute', inset: 0,
        transformStyle: 'preserve-3d',
      }}>
        {[0, 90, 180, 270].map((rot) => (
          <div key={rot} style={{
            position: 'absolute',
            width: 0, height: 0,
            left: '50%', top: '50%',
            borderLeft: `${size/2}px solid transparent`,
            borderRight: `${size/2}px solid transparent`,
            borderBottom: `${size}px solid ${color}20`,
            transform: `translate(-50%, -50%) rotateY(${rot}deg) rotateX(35deg)`,
            filter: `drop-shadow(0 0 8px ${color}60)`,
          }} />
        ))}
        {[0, 90, 180, 270].map((rot) => (
          <div key={`b-${rot}`} style={{
            position: 'absolute',
            width: 0, height: 0,
            left: '50%', top: '50%',
            borderLeft: `${size/2}px solid transparent`,
            borderRight: `${size/2}px solid transparent`,
            borderTop: `${size}px solid ${color}15`,
            transform: `translate(-50%, -50%) rotateY(${rot}deg) rotateX(-35deg)`,
            filter: `drop-shadow(0 0 8px ${color}40)`,
          }} />
        ))}
      </div>
    </div>
  );
}

function AnimatedSphere({ color, size }: { color: string; size: number }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle at 35% 35%, ${color}60, ${color}10 50%, transparent 70%)`,
      boxShadow: `0 0 30px ${color}40, inset 0 0 30px ${color}20`,
      border: `1px solid ${color}30`,
      animation: 'float 6s ease-in-out infinite, pulse-glow 3s ease-in-out infinite',
    }} />
  );
}

function AnimatedTorus({ color, size }: { color: string; size: number }) {
  const rings = 3;
  return (
    <div style={{
      width: size, height: size, position: 'relative',
      transformStyle: 'preserve-3d',
      animation: 'spin3d 14s linear infinite',
    }}>
      {Array.from({ length: rings }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          inset: size * 0.1,
          borderRadius: '50%',
          border: `2px solid ${color}${40 + i * 20}`,
          transform: `rotateX(${i * 60}deg) rotateY(${i * 30}deg)`,
          boxShadow: `0 0 15px ${color}30`,
        }} />
      ))}
    </div>
  );
}

function AnimatedPyramid({ color, size }: { color: string; size: number }) {
  return (
    <div style={{
      width: size, height: size, position: 'relative',
      transformStyle: 'preserve-3d',
      animation: 'spin3d 15s linear infinite',
    }}>
      {[0, 120, 240].map((rot) => (
        <div key={rot} style={{
          position: 'absolute',
          width: 0, height: 0,
          left: '50%', top: '50%',
          borderLeft: `${size/2}px solid transparent`,
          borderRight: `${size/2}px solid transparent`,
          borderBottom: `${size * 0.85}px solid ${color}25`,
          transform: `translate(-50%, -50%) rotateY(${rot}deg) rotateX(25deg)`,
          filter: `drop-shadow(0 0 12px ${color}50)`,
        }} />
      ))}
      <div style={{
        position: 'absolute',
        left: '50%', top: '50%',
        width: size * 0.8, height: size * 0.8,
        transform: 'translate(-50%, -50%) rotateX(90deg)',
        border: `1px solid ${color}30`,
        backgroundColor: `${color}10`,
      }} />
    </div>
  );
}


/** Floating particles that drift around */
interface ParticleFieldProps {
  color: string;
  count?: number;
}

export function ParticleField({ color, count = 20 }: ParticleFieldProps) {
  const particles = Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    delay: Math.random() * 8,
    duration: Math.random() * 10 + 8,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            boxShadow: `0 0 ${p.size * 3}px ${color}`,
          }}
          animate={{
            y: [0, -40, 0, 30, 0],
            x: [0, 20, -15, 10, 0],
            opacity: [0.2, 0.8, 0.3, 0.7, 0.2],
            scale: [1, 1.5, 0.8, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}


/** Magnetic button that follows cursor on hover — with ripple, glow, and spring effects */
interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  glowColor?: string;
}

export function MagneticButton({ children, className = '', onClick, ariaLabel, glowColor }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
    glowX.set(((e.clientX - rect.left) / rect.width) * 100);
    glowY.set(((e.clientY - rect.top) / rect.height) * 100);
  }, [x, y, glowX, glowY]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [x, y]);

  const handleClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() });
      setTimeout(() => setRipple(null), 600);
    }
    onClick?.();
  }, [onClick]);

  const gx = useTransform(glowX, (v) => `${v}%`);
  const gy = useTransform(glowY, (v) => `${v}%`);
  const glowBackground = useTransform(
    [gx, gy],
    ([px, py]) => `radial-gradient(circle at ${px} ${py}, ${glowColor || 'rgba(255,255,255,0.15)'}, transparent 60%)`
  );

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`relative overflow-hidden ${className}`}
      aria-label={ariaLabel}
    >
      {/* Cursor-following glow */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-0"
          style={{
            background: glowBackground,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      {/* Ripple burst on click */}
      {ripple && (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none z-0"
          style={{ left: ripple.x, top: ripple.y, backgroundColor: glowColor || 'rgba(255,255,255,0.3)' }}
          initial={{ width: 0, height: 0, opacity: 0.6, x: 0, y: 0 }}
          animate={{ width: 200, height: 200, opacity: 0, x: -100, y: -100 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}
      
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </motion.button>
  );
}

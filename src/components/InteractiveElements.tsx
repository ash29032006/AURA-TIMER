import { useEffect, useState, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
  color?: string;
}

/**
 * AnimatedCounter — smoothly animates between numeric values
 * Uses spring physics for natural-feeling number transitions
 */
export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 1.5,
  className = '',
  color,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const springValue = useSpring(0, { stiffness: 80, damping: 20, duration: duration * 1000 });
  const prevValueRef = useRef(0);

  useEffect(() => {
    prevValueRef.current = displayValue;
    springValue.set(value);
  }, [value, springValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Number(latest.toFixed(decimals)));
    });
    return unsubscribe;
  }, [springValue, decimals]);

  return (
    <motion.span
      className={className}
      style={color ? { color } : undefined}
      key={value}
      initial={{ opacity: 0.7, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </motion.span>
  );
}

interface KeyboardShortcutProps {
  keys: string[];
  label?: string;
  className?: string;
}

/**
 * KeyboardShortcut — shows keyboard shortcut indicators
 * Displayed near controls to hint at keyboard navigation
 */
export function KeyboardShortcut({ keys, label, className = '' }: KeyboardShortcutProps) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-hidden="true" title={label}>
      {keys.map((key, i) => (
        <span key={i}>
          <kbd className="kbd">{key}</kbd>
          {i < keys.length - 1 && <span className="text-white/20 text-[10px] mx-0.5">+</span>}
        </span>
      ))}
    </span>
  );
}

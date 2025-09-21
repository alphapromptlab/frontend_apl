import { motion } from 'motion/react';

interface NoiseOverlayProps {
  intensity?: 'light' | 'medium' | 'heavy';
  className?: string;
}

export function NoiseOverlay({ intensity = 'medium', className = '' }: NoiseOverlayProps) {
  const intensitySettings = {
    light: {
      opacity: 0.15,
      scale: 0.8,
      blur: 'blur-[0.5px]'
    },
    medium: {
      opacity: 0.25,
      scale: 1,
      blur: 'blur-[1px]'
    },
    heavy: {
      opacity: 0.35,
      scale: 1.2,
      blur: 'blur-[1.5px]'
    }
  };

  const settings = intensitySettings[intensity];

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      {/* Primary noise layer */}
      <motion.div
        className="absolute inset-0 opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(0,0,0,0.4) 0.5px, transparent 0),
            radial-gradient(circle at 3px 2px, rgba(255,255,255,0.3) 0.3px, transparent 0),
            radial-gradient(circle at 5px 4px, rgba(0,0,0,0.2) 0.4px, transparent 0),
            radial-gradient(circle at 8px 1px, rgba(255,255,255,0.2) 0.2px, transparent 0)
          `,
          backgroundSize: '16px 16px, 24px 24px, 32px 32px, 48px 48px'
        }}
        animate={{
          x: [0, -2, 1, -1, 0],
          y: [0, 1, -2, 2, 0],
          scale: [settings.scale, settings.scale * 1.02, settings.scale * 0.98, settings.scale * 1.01, settings.scale],
          opacity: [settings.opacity, settings.opacity * 1.2, settings.opacity * 0.8, settings.opacity * 1.1, settings.opacity]
        }}
        transition={{
          duration: 12,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Secondary animated noise layer */}
      <motion.div
        className="absolute inset-0 opacity-15 mix-blend-screen"
        style={{
          backgroundImage: `
            radial-gradient(circle at 2px 3px, rgba(255,255,255,0.6) 0.3px, transparent 0),
            radial-gradient(circle at 6px 1px, rgba(0,0,0,0.4) 0.4px, transparent 0),
            radial-gradient(circle at 4px 5px, rgba(255,255,255,0.3) 0.2px, transparent 0)
          `,
          backgroundSize: '20px 20px, 36px 36px, 52px 52px'
        }}
        animate={{
          x: [0, 3, -2, 1, 0],
          y: [0, -2, 3, -1, 0],
          rotate: [0, 0.5, -0.3, 0.8, 0],
          opacity: [0.15, 0.25, 0.10, 0.20, 0.15]
        }}
        transition={{
          duration: 18,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
      />

      {/* Subtle grain texture */}
      <motion.div
        className={`absolute inset-0 opacity-10 mix-blend-overlay ${settings.blur}`}
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(128,128,128,0.8) 0.2px, transparent 0),
            radial-gradient(circle at 3px 3px, rgba(192,192,192,0.6) 0.1px, transparent 0)
          `,
          backgroundSize: '8px 8px, 14px 14px'
        }}
        animate={{
          scale: [1, 1.05, 0.95, 1.02, 1],
          opacity: [0.10, 0.15, 0.08, 0.12, 0.10]
        }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </div>
  );
}
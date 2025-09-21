import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

const inspirationalTaglines = [
  "Creativity has no limits. Execution shouldn't either.",
  "Where ideas become campaigns instantly!",
  "Fuel your brand with AI. Powered by imagination.",
  "Create. Automate. Dominate.",
  "Build faster. Create smarter.",
  "Design. Write. Schedule.",
  "Launch campaigns at the speed of thought."
];

export function SplashScreen() {
  const [currentTagline, setCurrentTagline] = useState("");

  useEffect(() => {
    // Select a random tagline when component mounts
    const randomIndex = Math.floor(Math.random() * inspirationalTaglines.length);
    setCurrentTagline(inspirationalTaglines[randomIndex]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }} // Much faster fade in
      className="fixed inset-0 z-50 flex items-center justify-center bg-background dark"
    >
      <div className="text-center max-w-4xl mx-auto px-6">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1
          }}
          transition={{ 
            duration: 0.4, // Much faster animation - from 0.8s to 0.4s
            ease: [0.16, 1, 0.3, 1], // Custom easing for snappy feel
            delay: 0.1 // Small delay after container appears
          }}
          className="splash-text text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x"
        >
          {currentTagline}
        </motion.h1>
      </div>
    </motion.div>
  );
}
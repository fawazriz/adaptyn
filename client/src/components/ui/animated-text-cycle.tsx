
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

interface AnimatedTextCycleProps {
  words: string[];
  interval?: number;
  className?: string;
}

const containerVariants: Variants = {
  hidden: {
    y: -20,
    opacity: 0,
    filter: "blur(8px)",
  },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    y: 20,
    opacity: 0,
    filter: "blur(8px)",
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

export default function AnimatedTextCycle({
  words,
  interval = 5000,
  className = "",
}: AnimatedTextCycleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState("auto");
  const measureRef = useRef<HTMLDivElement>(null);

  const safeIndex = words.length > 0 ? currentIndex % words.length : 0;

  useEffect(() => {
    if (measureRef.current) {
      const elements = measureRef.current.children;

      if (elements.length > safeIndex) {
        const newWidth = elements[safeIndex].getBoundingClientRect().width;
        setWidth(`${newWidth}px`);
      }
    }
  }, [safeIndex, words]);

  useEffect(() => {
    if (words.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, words.length]);

  if (words.length === 0) return null;

  return (
    <>
      {/* Hidden measurement div */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none"
        style={{ visibility: "hidden" }}
      >
        {words.map((word, i) => (
          <span key={i} className={`font-bold ${className}`}>
            {word}
          </span>
        ))}
      </div>

      {/* Animated word */}
      <motion.span
        className="relative inline-block"
        animate={{
          width,
          transition: {
            type: "spring",
            stiffness: 150,
            damping: 15,
            mass: 1.2,
          },
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={safeIndex}
            className={`inline-block font-bold ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ whiteSpace: "nowrap" }}
          >
            {words[safeIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
}

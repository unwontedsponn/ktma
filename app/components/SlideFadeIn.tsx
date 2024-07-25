import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface SlideFadeInProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down'; // Optional, default is 'left'
  delay?: number; // Optional, default is 0.2
  className?: string; // Optional
}

const SlideFadeIn: React.FC<SlideFadeInProps> = ({ 
  children, 
  direction = 'left', 
  delay = 0.2, 
  className = '' 
}) => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });

  let initialX = 0;
  let initialY = 0;

  // Determine initial position based on direction
  switch (direction) {
    case 'left':
      initialX = -200;
      break;
    case 'right':
      initialX = 200;
      break;
    case 'up':
      initialY = -200;
      break;
    case 'down':
      initialY = 200;
      break;
    default:
      break;
  }

  const variants = {
    hidden: { x: initialX, y: initialY, opacity: 0 },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, delay: delay },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default SlideFadeIn;

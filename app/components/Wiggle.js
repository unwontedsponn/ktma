import { motion } from 'framer-motion';

export default function WiggleEffect ({ children, className }) {
  // Define the wiggle animation as a variant
  const wiggleAnimation = {
    wiggle: {
      rotate: [0, 10, -10, 10, -10, 0],
      transition: { duration: 2 },
    },
    initial: {
      rotate: 0,
    },
  };

  return (
    <motion.div
      className={`flex flex-col items-center justify-center ${className}`}
      variants={wiggleAnimation}
      initial="initial"
      whileHover="wiggle"
    >
      {children}
    </motion.div>
  );
};

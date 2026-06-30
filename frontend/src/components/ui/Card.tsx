import { type ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function Card({ children, className, delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className={clsx(
        "rounded-2xl border border-border bg-surface/80 backdrop-blur-xl p-6 shadow-soft",
        "hover:border-primary/30 transition-colors duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

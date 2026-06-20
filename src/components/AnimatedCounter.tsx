import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

type AnimatedCounterProps = {
  value: string;
  label: string;
};

function parseCounterValue(value: string) {
  const match = value.match(/^(\d+)(\+?)$/);
  if (!match) return { number: 0, suffix: value };
  return { number: Number(match[1]), suffix: match[2] || '' };
}

export default function AnimatedCounter({ value, label }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { number, suffix } = parseCounterValue(value);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || number === 0) return;

    let start = 0;
    const step = Math.max(1, Math.floor(number / 40));
    const timer = window.setInterval(() => {
      start += step;
      if (start >= number) {
        setCount(number);
        window.clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);

    return () => window.clearInterval(timer);
  }, [inView, number]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="rounded-card border border-primary/30 bg-black/70 p-6 text-center transition hover:border-accent/50 hover:shadow-glow"
    >
      <p className="text-4xl font-bold text-accent">{number ? `${count}${suffix}` : value}</p>
      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
    </motion.div>
  );
}

import { useState, useEffect, useRef } from "react";

export function useCountUp(target, duration = 1000) {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    const start = prevTarget.current;
    const diff = target - start;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + diff * ease));
      if (progress < 1) requestAnimationFrame(animate);
      else prevTarget.current = target;
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
}

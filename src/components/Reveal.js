import React, { useEffect, useRef, useState } from "react";

/**
 * Fades + lifts its children into view, the way AOS's "fade-up" does:
 * the animation re-runs every time the element re-enters the viewport,
 * in either scroll direction.
 *
 * Falls back to "always visible" when IntersectionObserver is unavailable.
 */
const Reveal = ({ children, className = "", delay = 0, as: Tag = "div" }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setShown(entry.isIntersecting),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.04 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "is-shown" : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
};

export default Reveal;

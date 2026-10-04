import React, { useCallback, useEffect, useRef, useState } from "react";

const SWIPE_THRESHOLD = 50;

/**
 * Full-screen photo viewer: swipe on touch, arrow keys on desktop,
 * tap the backdrop or Esc to close.
 *
 * @param srcFor  (index) => image url at full viewing size
 * @param count   number of photos
 */
const Lightbox = ({ index, count, srcFor, onClose, onChange }) => {
  const [loaded, setLoaded] = useState(false);
  const [drag, setDrag] = useState(0);
  const touchStart = useRef(null);

  const go = useCallback(
    (step) => {
      onChange((index + step + count) % count);
      setLoaded(false);
    },
    [index, count, onChange]
  );

  // keyboard + scroll lock, for as long as the viewer is open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };

    document.addEventListener("keydown", onKey);
    document.body.classList.add("is-locked");

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("is-locked");
    };
  }, [go, onClose]);

  // keep the neighbours warm so swiping feels instant
  useEffect(() => {
    [-1, 1].forEach((step) => {
      const img = new Image();
      img.src = srcFor((index + step + count) % count);
    });
  }, [index, count, srcFor]);

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (touchStart.current === null) return;
    setDrag(e.touches[0].clientX - touchStart.current);
  };

  const handleTouchEnd = () => {
    if (drag > SWIPE_THRESHOLD) go(-1);
    else if (drag < -SWIPE_THRESHOLD) go(1);
    touchStart.current = null;
    setDrag(0);
  };

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${count}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M5 5l14 14M19 5L5 19"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </button>

      <div
        className="lightbox-stage"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <img
          key={index}
          className={`lightbox-img ${loaded ? "is-loaded" : ""}`}
          src={srcFor(index)}
          alt={`Dayeon and Prannoy, ${index + 1} of ${count}`}
          onLoad={() => setLoaded(true)}
          style={{
            transform: `translateX(${drag}px)`,
            transition: drag ? "none" : "transform .3s var(--ease), opacity .3s",
          }}
          draggable="false"
        />
      </div>

      <button
        className="lightbox-nav lightbox-nav--prev"
        onClick={() => go(-1)}
        aria-label="Previous photo"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            d="M15 4l-8 8 8 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>

      <button
        className="lightbox-nav lightbox-nav--next"
        onClick={() => go(1)}
        aria-label="Next photo"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            d="M9 4l8 8-8 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>

      <div className="lightbox-counter">
        {index + 1} / {count}
      </div>
    </div>
  );
};

export default Lightbox;

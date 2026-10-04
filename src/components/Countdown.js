import React, { useEffect, useState } from "react";

const UNITS = [
  ["days", 86400],
  ["hours", 3600],
  ["minutes", 60],
  ["seconds", 1],
];

const remainingFrom = (target) => {
  const diff = Math.max(0, target.getTime() - Date.now());
  let left = Math.floor(diff / 1000);

  return UNITS.map(([label, size]) => {
    const value = Math.floor(left / size);
    left -= value * size;
    return { label, value };
  });
};

/** Live "time until the ceremony" strip. `target` is a Date. */
const Countdown = ({ target }) => {
  const [parts, setParts] = useState(() => remainingFrom(target));

  useEffect(() => {
    const id = setInterval(() => setParts(remainingFrom(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const past = target.getTime() - Date.now() <= 0;

  if (past) {
    return (
      <div className="countdown-done">We're married! Thank you for celebrating with us.</div>
    );
  }

  return (
    <div className="countdown" aria-label="Time remaining until the ceremony">
      {parts.map(({ label, value }) => (
        <div className="countdown-cell" key={label}>
          <span className="countdown-value">
            {String(value).padStart(2, "0")}
          </span>
          <span className="countdown-label">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;

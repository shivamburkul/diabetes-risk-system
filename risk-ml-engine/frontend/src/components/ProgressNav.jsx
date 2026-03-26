import React from "react";

const Check = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
    <polyline
      points="2 6 5 9 10 3"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ProgressNav({ items, current, completedKeys, onJump }) {
  return (
    <div className="prog-nav">
      {items.map((item, i) => {
        const isDone = completedKeys.includes(item.key);
        const isCurr = i === current;

        return (
          <React.Fragment key={item.key}>
            <div
              data-navindex={i}
              className={`pnav-item ${isDone ? "is-done" : ""} ${isCurr ? "is-current" : ""}`}
              onClick={() => onJump(i)}
              title={item.title}
            >
              <div className="pnav-label">{item.label}</div>
              <div className="pnav-circle">
                {isDone ? <Check /> : isCurr ? <div className="pnav-dot" /> : null}
              </div>
            </div>

            {i < items.length - 1 && (
              <div className={`pnav-bar ${isDone ? "is-done" : ""}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
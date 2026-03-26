import React from "react";
import { motion } from "framer-motion";

const variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -40 },
};

export default function QuestionCard({ q, value, onSelect, index, total, disabled }) {
  if (!q) return null;

  const count = q.options.length;
  const layoutClass = count === 2 ? "opts-two" : count >= 5 ? "opts-grid" : "opts-list";

  return (
    <motion.div
      key={q.id}
      className="question-card"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
    >
      <div className="q-left">
        <div className="q-top">
          <div className="q-num">
            Question {index + 1} of {total}
          </div>
          <h2 className="q-title">{q.title}</h2>
          <p className="q-desc">{q.desc}</p>
        </div>

        <div className="opts-wrap">
          <div className={layoutClass}>
            {q.options.map((opt, i) => {
              const v = String(opt.value ?? opt);
              const lbl = opt.label ?? opt;

              return (
                <motion.button
                  key={i}
                  className={`opt ${value === v ? "is-selected" : ""}`}
                  onClick={() => onSelect(v)}
                  disabled={disabled}
                  whileTap={{ scale: 0.97 }}
                >
                  {lbl}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="q-right">
        <motion.img
          className="q-sticker"
          src={q.sticker}
          alt=""
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        />
      </div>
    </motion.div>
  );
}
"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useContent } from "@/context/ContentProvider";

/**
 * Famous-quote ribbon under the navbar. Rotates every 15s with a soft
 * cross-fade — no refresh needed. Italic serif (the only italic on the site).
 */
export default function QuoteBar() {
  const { content } = useContent();
  const quotes = content.quotes?.length ? content.quotes : [];
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (quotes.length <= 1) return;
    const id = setInterval(() => setI((p) => (p + 1) % quotes.length), 15000);
    return () => clearInterval(id);
  }, [quotes.length]);

  if (!quotes.length) return null;
  const q = quotes[i];

  return (
    <div className="relative z-10 flex justify-center px-4 pt-24 sm:pt-28">
      <div className="container-x flex justify-center">
        <div className="relative flex min-h-[3.5rem] w-full max-w-3xl items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce ? undefined : { opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="quote-italic text-base text-[var(--text-dim)] sm:text-lg"
            >
              <span className="text-[var(--text)]">“{q.text}”</span>
              <span className="ml-2 not-italic">— {q.author}</span>
            </motion.blockquote>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

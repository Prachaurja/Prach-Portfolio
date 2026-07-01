"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ContributionCalendar } from "@/lib/api";

const LEVEL_BG = [
  "rgba(255,255,255,0.05)",
  "rgba(255,255,255,0.20)",
  "rgba(255,255,255,0.38)",
  "rgba(255,255,255,0.62)",
  "rgba(255,255,255,0.92)",
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function GithubHeatmap({ data }: { data: ContributionCalendar }) {
  const reduce = useReducedMotion();

  // Month labels: first week index where the month changes.
  const monthLabels: { col: number; label: string }[] = [];
  let lastMonth = -1;
  data.weeks.forEach((week, i) => {
    const first = week[0];
    if (!first) return;
    const m = new Date(first.date).getMonth();
    if (m !== lastMonth) {
      monthLabels.push({ col: i, label: MONTHS[m] });
      lastMonth = m;
    }
  });

  return (
    <div className="w-full">
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex min-w-full flex-col gap-1.5">
          {/* month row */}
          <div className="relative ml-0 h-4" style={{ paddingLeft: 0 }}>
            <div className="flex gap-[3px]">
              {data.weeks.map((_, i) => {
                const lbl = monthLabels.find((m) => m.col === i);
                return (
                  <div key={i} className="w-[11px] shrink-0 sm:w-[13px]">
                    {lbl && (
                      <span className="label-mark text-[0.6rem] tracking-[0.1em]">
                        {lbl.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* cells */}
          <motion.div
            className="flex gap-[3px]"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: reduce ? 0 : 0.003 } },
            }}
          >
            {data.weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day, di) => (
                  <motion.div
                    key={di}
                    title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                    className="h-[11px] w-[11px] rounded-[2.5px] sm:h-[13px] sm:w-[13px]"
                    style={{ background: LEVEL_BG[day.level] }}
                    variants={{
                      hidden: { opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.3 },
                      show: { opacity: 1, scale: 1 },
                    }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* legend */}
      <div className="mt-4 flex items-center justify-end gap-2 text-[0.7rem] text-[var(--text-dim)]">
        <span>Less</span>
        {LEVEL_BG.map((bg, i) => (
          <span
            key={i}
            className="h-[11px] w-[11px] rounded-[2.5px]"
            style={{ background: bg }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

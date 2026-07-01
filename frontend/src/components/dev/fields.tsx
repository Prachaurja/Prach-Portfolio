"use client";

import { useRef, useState, type ReactNode } from "react";
import { Upload, Trash2, Plus, ChevronUp, ChevronDown, X } from "lucide-react";
import { fileToDataUrl } from "@/lib/storage";

export function Labeled({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
        {label}
      </span>
      {children}
      {hint && <span className="text-xs text-[var(--text-dim)]">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-[var(--glass-border)] bg-black/40 px-3 py-2 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--teal)]";

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <Labeled label={label} hint={hint}>
      <input
        className={inputCls}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Labeled>
  );
}

export function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <Labeled label={label}>
      <input
        type="number"
        className={inputCls}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </Labeled>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <Labeled label={label}>
      <textarea
        className={`${inputCls} resize-y leading-relaxed`}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Labeled>
  );
}

/* eslint-disable @next/next/no-img-element */
export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const url = await fileToDataUrl(file);
      onChange(url);
    } catch {
      setErr("Could not process that image.");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <Labeled label={label}>
      <div className="flex items-center gap-3">
        <div className="photo-frame h-16 w-16 shrink-0 rounded-lg">
          {value ? (
            <img src={value} alt="" />
          ) : (
            <div className="photo-empty h-full w-full text-[0.6rem]">Empty</div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => ref.current?.click()}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--glass-border)] px-3 py-1.5 text-xs text-[var(--text)] hover:border-[var(--teal)]"
            >
              <Upload className="h-3.5 w-3.5" /> {busy ? "Processing…" : "Upload"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--glass-border)] px-3 py-1.5 text-xs text-[var(--text-dim)] hover:text-[#f87171]"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear
              </button>
            )}
          </div>
          {err && <span className="text-xs text-[#f87171]">{err}</span>}
        </div>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPick}
        />
      </div>
    </Labeled>
  );
}

/** Edits an array of plain strings (skills, tech, headline lines, etc.). */
export function StringList({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft("");
  };
  return (
    <Labeled label={label}>
      <div className="flex flex-wrap gap-2">
        {items.map((it, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-black/30 py-1 pl-3 pr-1.5 text-xs text-[var(--text)]"
          >
            {it}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="rounded-full p-0.5 text-[var(--text-dim)] hover:text-[#f87171]"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          className={inputCls}
          value={draft}
          placeholder={placeholder ?? "Add item…"}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 rounded-lg border border-[var(--glass-border)] px-3 text-sm text-[var(--text)] hover:border-[var(--teal)]"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </Labeled>
  );
}

/** Generic editor for an array of objects. */
export function ArrayEditor<T>({
  label,
  items,
  onChange,
  create,
  render,
  titleOf,
}: {
  label: string;
  items: T[];
  onChange: (v: T[]) => void;
  create: () => T;
  render: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
  titleOf: (item: T, i: number) => string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  const update = (i: number, patch: Partial<T>) =>
    onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
          {label}
        </span>
        <button
          type="button"
          onClick={() => {
            onChange([...items, create()]);
            setOpen(items.length);
          }}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--glass-border)] px-3 py-1.5 text-xs text-[var(--text)] hover:border-[var(--teal)]"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>

      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-[var(--glass-border)] bg-black/20">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex flex-1 items-center gap-2 text-left text-sm text-[var(--text)]"
            >
              {open === i ? (
                <ChevronUp className="h-4 w-4 shrink-0 text-[var(--text-dim)]" />
              ) : (
                <ChevronDown className="h-4 w-4 shrink-0 text-[var(--text-dim)]" />
              )}
              <span className="truncate">{titleOf(item, i) || `Item ${i + 1}`}</span>
            </button>
            <button type="button" onClick={() => move(i, -1)} className="p-1 text-[var(--text-dim)] hover:text-[var(--text)]">
              <ChevronUp className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => move(i, 1)} className="p-1 text-[var(--text-dim)] hover:text-[var(--text)]">
              <ChevronDown className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => remove(i)} className="p-1 text-[var(--text-dim)] hover:text-[#f87171]">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          {open === i && (
            <div className="flex flex-col gap-4 border-t border-[var(--glass-border)] p-4">
              {render(item, (patch) => update(i, patch))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

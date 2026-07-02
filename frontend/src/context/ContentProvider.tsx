"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/content";
import {
  fetchRemoteContent,
  readLocalContent,
  writeLocalContent,
} from "@/lib/storage";

interface ContentContextValue {
  content: SiteContent;
  loading: boolean;
  setContent: (next: SiteContent) => void;
  refresh: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

// ---- external store for localStorage, hydration-safe by construction ----
const listeners = new Set<() => void>();

// Initialise from localStorage at module-load time on the client.
// typeof-window guard keeps this safe during Next.js SSR.
let snapshot: SiteContent =
  (typeof window !== "undefined" ? readLocalContent() : null) ?? DEFAULT_CONTENT;

function emitChange() {
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return snapshot;
}

// SSR and hydration always use DEFAULT_CONTENT so server/client never disagree.
function getServerSnapshot() {
  return DEFAULT_CONTENT;
}

function setSnapshot(next: SiteContent) {
  snapshot = next;
  emitChange();
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const content = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [loading, setLoading] = useState(true);

  // Fetch remote content and update the store.
  // setState calls live inside .then()/.finally() Promise callbacks — the React
  // compiler recognises these as external-event callbacks, not synchronous
  // effect-body setState, so the cascading-render warning is avoided.
  const refresh = useCallback(() => {
    fetchRemoteContent()
      .then((remote) => {
        if (remote) {
          setSnapshot(remote);
          writeLocalContent(remote);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setContent = (next: SiteContent) => {
    setSnapshot(next);
    try {
      writeLocalContent(next);
    } catch {
      /* quota — surfaced in the Dev Tool */
    }
  };

  return (
    <ContentContext.Provider value={{ content, loading, setContent, refresh }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
  return ctx;
}
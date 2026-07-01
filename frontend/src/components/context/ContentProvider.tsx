"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
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
  /** true until the first load (remote/local) settles */
  loading: boolean;
  /** replace the whole content tree (used by the Dev Tool) */
  setContent: (next: SiteContent) => void;
  /** re-pull from backend/local */
  refresh: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  const load = useMemo(
    () => async () => {
      // local first for an instant paint of the author's own edits
      const local = readLocalContent();
      if (local) setContentState(local);

      // then prefer whatever the backend has (live for everyone)
      const remote = await fetchRemoteContent();
      if (remote) {
        setContentState(remote);
        writeLocalContent(remote);
      }
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    // Intentional: hydrate from localStorage/backend once on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const setContent = (next: SiteContent) => {
    setContentState(next);
    try {
      writeLocalContent(next);
    } catch {
      /* quota — surfaced in the Dev Tool */
    }
  };

  return (
    <ContentContext.Provider
      value={{ content, loading, setContent, refresh: load }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
  return ctx;
}

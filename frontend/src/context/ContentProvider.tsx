"use client";

import {
  createContext,
  useContext,
  useEffect,
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
  setContent: (c: SiteContent) => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(
    () => readLocalContent() ?? DEFAULT_CONTENT
  );

  useEffect(() => {
    fetchRemoteContent().then((remote) => {
      if (remote) setContentState(remote);
    });
  }, []);

  const setContent = (c: SiteContent) => {
    setContentState(c);
    writeLocalContent(c);
  };

  return (
    <ContentContext.Provider value={{ content, setContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
  return ctx;
}

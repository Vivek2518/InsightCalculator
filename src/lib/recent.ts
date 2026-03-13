import { useCallback, useMemo } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";

const STORAGE_KEY = "ganitahub:recent";
const MAX_RECENT = 8;

export function useRecent() {
  const [recent, setRecent] = useLocalStorage<string[]>(STORAGE_KEY, []);

  const recentSet = useMemo(() => new Set(recent), [recent]);

  const addRecent = useCallback((slug: string) => {
    setRecent((prev) => {
      const filtered = prev.filter((item) => item !== slug);
      const updated = [slug, ...filtered].slice(0, MAX_RECENT);
      return updated;
    });
  }, [setRecent]);

  const clearRecent = useCallback(() => setRecent([]), [setRecent]);

  return {
    recent,
    recentSet,
    addRecent,
    clearRecent,
  };
}

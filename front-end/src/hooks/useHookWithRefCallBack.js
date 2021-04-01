import { useRef, useCallback } from "react";
export function useHookWithRefCallback({ callback, cleanup }) {
  const ref = useRef(null);
  const setRef = useCallback((node) => {
    if (ref.current && cleanup) {
      cleanup(ref.current);
    }
    if (node) {
      callback(node);
    }

    ref.current = node;
  }, []);

  return [setRef];
}

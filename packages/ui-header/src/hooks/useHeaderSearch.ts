import { useCallback, useEffect, useRef, useState } from "react";

export function useHeaderSearch(onSearch?: (value: string) => void) {
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setValue(next);
      setIsOpen(next.length > 0);
      onSearch?.(next);
    },
    [onSearch]
  );

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!searchRef.current) return;
      if (!searchRef.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const reset = useCallback(() => {
    setIsSearchVisible(false);
    setIsOpen(false);
    setValue("");
  }, []);

  return {
    value,
    setValue,
    isOpen,
    setIsOpen,
    isSearchVisible,
    setIsSearchVisible,
    onChange,
    searchRef,
    reset,
  };
}

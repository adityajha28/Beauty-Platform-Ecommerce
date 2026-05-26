import { useEffect, useState } from "react";

const DEFAULT_QUERY = "(max-width: 768px)";

/** Matches mobile layout breakpoint used by Navbar / BottomNav */
export default function useIsMobile(query = DEFAULT_QUERY) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return isMobile;
}

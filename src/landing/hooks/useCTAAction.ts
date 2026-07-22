import { useRef, useCallback, useState } from "react";

interface CTAActionOptions {
  onAction: () => void;
  confirmDuration?: number;
  preventDouble?: boolean;
}

export function useCTAAction({ onAction, confirmDuration = 150, preventDouble = true }: CTAActionOptions) {
  const [isConfirming, setIsConfirming] = useState(false);
  const firedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleClick = useCallback(() => {
    if (preventDouble && firedRef.current) return;
    firedRef.current = true;
    setIsConfirming(true);

    timeoutRef.current = setTimeout(() => {
      onAction();
      setIsConfirming(false);
      setTimeout(() => { firedRef.current = false; }, 300);
    }, confirmDuration);
  }, [onAction, confirmDuration, preventDouble]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsConfirming(false);
    firedRef.current = false;
  }, []);

  return { handleClick, isConfirming, cancel };
}

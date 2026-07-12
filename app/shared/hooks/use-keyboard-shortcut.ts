import { useEffect } from "react";

/**
 * Subscribe to a keyboard shortcut. Returns cleanup automatically.
 */
export function useKeyboardShortcut(
  combo: string,
  handler: (event: KeyboardEvent) => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;

    function onKeyDown(event: KeyboardEvent) {
      const parts = combo.toLowerCase().split("+");
      const key = parts[parts.length - 1];
      const needMeta = parts.includes("meta") || parts.includes("cmd");
      const needCtrl = parts.includes("ctrl");
      const needShift = parts.includes("shift");
      const needAlt = parts.includes("alt");

      const metaOk = needMeta ? event.metaKey || event.ctrlKey : true;
      const ctrlOk = needCtrl ? event.ctrlKey : true;
      const shiftOk = needShift ? event.shiftKey : !event.shiftKey || needShift;
      const altOk = needAlt ? event.altKey : !event.altKey || needAlt;

      if (
        event.key.toLowerCase() === key &&
        metaOk &&
        (!needCtrl || ctrlOk) &&
        shiftOk &&
        altOk
      ) {
        handler(event);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [combo, handler, enabled]);
}

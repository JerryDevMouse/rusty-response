import React, { useCallback, useState } from 'react'
import getCaretCoordinates from "textarea-caret";

const VARIABLES: Record<string, string[]> = {
  server: ['id', 'user_id', 'name', 'url', 'timeout', 'interval', 'last_seen_status_code', 'last_seen_reason', 'is_turned_on', 'created_at', 'updated_at'],
  log: ['id', 'server_id', 'failed', 'status_code', 'body', 'reason', 'created_at'],
};

type Suggestion = { value: string; full: string };

const useSuggestions = (
    value: string,
    setValue: (v: string) => void,
    textareaRef: React.RefObject<HTMLTextAreaElement | null>
) => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);
    const callSetSelectedIndex = useCallback((value: number) => setSelectedIndex(value), []);

    const updateSuggestions = (el: HTMLTextAreaElement) => {
        const pos = el.selectionStart;
        const beforeCursor = el.value.substring(0, pos);

        let matches: Suggestion[] = [];

        if (/\{\{\s*([a-z]*)$/i.test(beforeCursor)) {
            const prefix = RegExp.$1;
            matches = Object.keys(VARIABLES).filter((key) => key.startsWith(prefix)).map((key) => ({
                value: key,
                full: key,
            }));
        }

        const objMatch = beforeCursor.match(/\{\{\s*(\w+)\.(\w*)$/);
        if (objMatch) {
            const [, obj, prefix] = objMatch;
            if (VARIABLES[obj]) {
                matches = VARIABLES[obj]
                    .filter(key => key.startsWith(prefix))
                    .map(key => ({ value: key, full: `${obj}.${key}` }));
                }
        }

        setSuggestions(matches);
        setSelectedIndex(0);

        if (matches.length > 0) {
            const coords = getCaretCoordinates(el, pos);
            setPopupPos({ top: coords.top + 20, left: coords.left });
        } else {
            setPopupPos(null);
        }
    };

    const applySuggestion = (s: Suggestion) => {
        const el = textareaRef.current;
        if (!el) return;

        const pos = el.selectionStart;
        const before = value.substring(0, pos);
        const after = value.substring(pos);

        let newBefore = before.replace(/\{\{\s*\w*(\.\w*)?$/, `{{${s.full}`);
        setValue(newBefore + after);

        setTimeout(() => {
            el.selectionStart = el.selectionEnd = newBefore.length;
            el.focus();
        });

        setSuggestions([]);
        setPopupPos(null);
    };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (suggestions.length > 0) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((i) => (i + 1) % suggestions.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === "Tab") {
            e.preventDefault();
            applySuggestion(suggestions[selectedIndex]);
        } else if (e.key === "Escape") {
            setSuggestions([]);
            setPopupPos(null);
        }
    }
  };

  return {
    updateSuggestions, applySuggestion, handleKeyDown, 
    popupPos, suggestions, selectedIndex,
    setSelectedIndex: callSetSelectedIndex
  }
}

export default useSuggestions
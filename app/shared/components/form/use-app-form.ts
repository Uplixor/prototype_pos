import { useEffect, useRef } from "react";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type UseFormReturn,
  type Resolver,
} from "react-hook-form";

export type UseAppFormOptions<T extends FieldValues> = {
  defaultValues: DefaultValues<T>;
  resolver?: Resolver<T>;
  /** Persist drafts locally when dirty */
  draftKey?: string;
  /** Autosave callback (debounced by caller or interval) */
  onAutosave?: (values: T) => void | Promise<void>;
  autosaveMs?: number;
};

/**
 * Enterprise form hook: RHF + optional draft persistence + dirty autosave.
 */
export function useAppForm<T extends FieldValues>({
  defaultValues,
  resolver,
  draftKey,
  onAutosave,
  autosaveMs = 1500,
}: UseAppFormOptions<T>): UseFormReturn<T> & {
  isDirty: boolean;
  isDraft: boolean;
} {
  const stored =
    typeof window !== "undefined" && draftKey
      ? window.localStorage.getItem(draftKey)
      : null;

  let initial = defaultValues;
  if (stored) {
    try {
      initial = { ...defaultValues, ...JSON.parse(stored) };
    } catch {
      initial = defaultValues;
    }
  }

  const form = useForm<T>({
    defaultValues: initial,
    resolver,
    mode: "onBlur",
  });

  const { watch, formState } = form;
  const values = watch();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDraft = Boolean(stored);

  useEffect(() => {
    if (!formState.isDirty) return;

    if (draftKey) {
      window.localStorage.setItem(draftKey, JSON.stringify(values));
    }

    if (!onAutosave) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      void onAutosave(values);
    }, autosaveMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [values, formState.isDirty, draftKey, onAutosave, autosaveMs]);

  return {
    ...form,
    isDirty: formState.isDirty,
    isDraft,
  };
}

export function clearFormDraft(draftKey: string) {
  window.localStorage.removeItem(draftKey);
}

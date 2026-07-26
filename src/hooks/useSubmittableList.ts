"use client";

import { useEffect, useState } from "react";

interface UseSubmittableListOptions<P> {
  /** GET endpoint returning `{ [listKey]: T[] }`. */
  endpoint: string;
  /** Key the GET response stores the list under, e.g. `'comments'` or `'requests'`. */
  listKey: string;
  /** POST endpoint returning `{ [itemKey]: T }`. Defaults to `endpoint`. */
  postEndpoint?: string;
  /** Key the POST response stores the created item under. */
  itemKey: string;
  /** Where a newly submitted item goes in the list: start (recipe requests) or end (comments). */
  insertAt?: "start" | "end";
  /** Extra fetch/refetch trigger — re-runs the GET when it changes (e.g. a slug). */
  deps?: unknown[];
  toPayload: (_fields: P) => unknown;
}

/** Shared fetch-list + optimistic-submit behavior for the site's anonymous comment/request boards. */
export function useSubmittableList<T, P>({
  endpoint,
  listKey,
  postEndpoint,
  itemKey,
  insertAt = "end",
  deps = [],
  toPayload,
}: UseSubmittableListOptions<P>) {
  const [items, setItems] = useState<T[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => setItems(data[listKey] ?? []))
      .catch(() => setItems([]));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps -- `load`/`endpoint` are stable per render, `deps` names what should trigger a refetch
  useEffect(load, deps);

  const submit = async (fields: P, fallbackError: string): Promise<boolean> => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(postEndpoint ?? endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(fields)),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? fallbackError);
      const data = await res.json();
      const item = data[itemKey] as T;
      setItems((prev) =>
        insertAt === "start" ? [item, ...(prev ?? [])] : [...(prev ?? []), item]
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : fallbackError);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { items, setItems, submitting, error, submit, reload: load };
}

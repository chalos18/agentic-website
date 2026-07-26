'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { getAnonName } from '@/lib/anonName';
import type { RecipeRequest } from '@/lib/recipeRequests';

export default function RequestBoard() {
  const [requests, setRequests] = useState<RecipeRequest[] | null>(null);
  const [recipeName, setRecipeName] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);

  const load = () => {
    fetch('/api/recipe-requests')
      .then((res) => res.json())
      .then((data) => setRequests(data.requests ?? []))
      .catch(() => setRequests([]));
  };

  useEffect(load, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!recipeName.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const submitterName = getAnonName();
      const res = await fetch('/api/recipe-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeName, note, submitterName }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Could not submit request');
      const { request } = await res.json();
      setRequests((prev) => [request, ...(prev ?? [])]);
      setRecipeName('');
      setNote('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: 'quoted' | 'dismissed') => {
    const res = await fetch(`/api/recipe-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminKey }),
    });
    if (res.ok) {
      setRequests((prev) =>
        (prev ?? [])
          .map((r) => (r.id === id ? { ...r, status } : r))
          .filter((r) => r.status !== 'dismissed')
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8 p-5 rounded-2xl bg-cream-deep border border-clay-line space-y-3">
        <h2 className="font-display text-lg font-semibold text-espresso">Request a recipe</h2>
        <p className="text-sm text-espresso-light">
          Tried something great, or want to see me post one of yours? Drop it here — everyone can see the list.
        </p>
        <input
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          placeholder="Recipe name"
          className="w-full p-3 bg-cream text-espresso text-sm rounded-lg border border-clay-line focus:border-terracotta focus:outline-none"
        />
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Why you'd recommend it (optional)"
          className="w-full p-3 bg-cream text-espresso text-sm rounded-lg border border-clay-line focus:border-terracotta focus:outline-none resize-none h-20"
        />
        {error && <p className="text-terracotta-dark text-xs">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !recipeName.trim()}
          className="px-4 py-2 bg-terracotta hover:bg-terracotta-dark disabled:opacity-50 text-cream rounded-lg text-sm font-semibold transition-all active:scale-95"
        >
          Submit as {typeof window !== 'undefined' ? getAnonName() : '…'}
        </button>
      </form>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-lg font-semibold text-espresso">Open requests</h2>
        <button
          onClick={() => setShowAdmin((v) => !v)}
          className="text-xs text-espresso-light/60 hover:text-espresso-light underline"
        >
          {showAdmin ? 'hide admin controls' : "I'm Ana"}
        </button>
      </div>

      {showAdmin && (
        <input
          type="password"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          placeholder="Admin passphrase"
          className="w-full mb-3 p-2 bg-cream text-espresso text-xs rounded-lg border border-clay-line focus:border-terracotta focus:outline-none"
        />
      )}

      <div className="space-y-3">
        {requests === null && <p className="text-sm text-espresso-light/70">Loading requests…</p>}
        {requests?.length === 0 && (
          <p className="text-sm text-espresso-light/70">No open requests yet — be the first.</p>
        )}
        {requests?.map((req) => (
          <div key={req.id} className="p-4 rounded-xl bg-cream border border-clay-line">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-espresso">{req.recipeName}</h3>
              {req.status === 'quoted' && (
                <span className="px-2 py-0.5 rounded-full bg-sage/20 text-sage-dark text-xs font-semibold">
                  posted!
                </span>
              )}
            </div>
            {req.note && <p className="text-sm text-espresso-light mb-2">{req.note}</p>}
            <div className="flex items-center justify-between">
              <p className="text-xs text-espresso-light/60">
                — {req.submitterName}, {new Date(req.createdAt).toLocaleDateString()}
              </p>
              {showAdmin && req.status === 'open' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(req.id, 'quoted')}
                    className="text-xs px-2 py-1 rounded-md bg-sage/20 text-sage-dark hover:bg-sage/30"
                  >
                    Mark posted
                  </button>
                  <button
                    onClick={() => updateStatus(req.id, 'dismissed')}
                    className="text-xs px-2 py-1 rounded-md bg-clay-line text-espresso-light hover:bg-espresso-light/20"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

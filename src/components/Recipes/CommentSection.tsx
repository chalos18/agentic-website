'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { getAnonName } from '@/lib/anonName';

interface Comment {
  id: string;
  slug: string;
  name: string;
  body: string;
  createdAt: string;
}

export default function CommentSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => setComments(data.comments ?? []))
      .catch(() => setComments([]));
  }, [slug]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const name = getAnonName();
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name, body }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Could not post comment');
      const { comment } = await res.json();
      setComments((prev) => [...(prev ?? []), comment]);
      setBody('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not post comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-semibold text-espresso mb-4">
        Comments {comments ? `(${comments.length})` : ''}
      </h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tried this one? Tell everyone how it went."
          className="w-full p-3 bg-cream text-espresso text-sm rounded-lg border border-clay-line focus:border-terracotta focus:outline-none resize-none h-20"
        />
        {error && <p className="text-terracotta-dark text-xs">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !body.trim()}
          className="px-4 py-2 bg-terracotta hover:bg-terracotta-dark disabled:opacity-50 text-cream rounded-lg text-sm font-semibold transition-all active:scale-95"
        >
          Post as {typeof window !== 'undefined' ? getAnonName() : '…'}
        </button>
      </form>

      <div className="space-y-3">
        {comments === null && <p className="text-sm text-espresso-light/70">Loading comments…</p>}
        {comments?.length === 0 && (
          <p className="text-sm text-espresso-light/70">No comments yet — be the first to try it.</p>
        )}
        {comments?.map((comment) => (
          <div key={comment.id} className="p-3 rounded-lg bg-cream-deep border border-clay-line">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-terracotta-dark">{comment.name}</span>
              <time className="text-xs text-espresso-light/60">
                {new Date(comment.createdAt).toLocaleDateString()}
              </time>
            </div>
            <p className="text-sm text-espresso whitespace-pre-wrap">{comment.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

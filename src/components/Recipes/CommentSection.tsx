"use client";

import { useState, type FormEvent } from "react";
import { getAnonName } from "@/lib/anonName";
import type { Comment } from "@/lib/anonymousSubmission";
import { useSubmittableList } from "@/hooks/useSubmittableList";

export default function CommentSection({ slug }: { slug: string }) {
  const [body, setBody] = useState("");
  const {
    items: comments,
    submitting,
    error,
    submit,
  } = useSubmittableList<Comment, { body: string }>({
    endpoint: `/api/comments?slug=${encodeURIComponent(slug)}`,
    postEndpoint: "/api/comments",
    listKey: "comments",
    itemKey: "comment",
    deps: [slug],
    toPayload: ({ body: text }) => ({ slug, name: getAnonName(), body: text }),
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!body.trim()) return;
    if (await submit({ body }, "Could not post comment")) setBody("");
  };

  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-semibold text-espresso mb-4">
        Comments {comments ? `(${comments.length})` : ""}
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
          Post as {typeof window !== "undefined" ? getAnonName() : "…"}
        </button>
      </form>

      <div className="space-y-3">
        {comments === null && (
          <p className="text-sm text-espresso-light/70">Loading comments…</p>
        )}
        {comments?.length === 0 && (
          <p className="text-sm text-espresso-light/70">
            No comments yet — be the first to try it.
          </p>
        )}
        {comments?.map((comment) => (
          <div
            key={comment.id}
            className="p-3 rounded-lg bg-cream-deep border border-clay-line"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-terracotta-dark">
                {comment.name}
              </span>
              <time className="text-xs text-espresso-light/60">
                {new Date(comment.createdAt).toLocaleDateString()}
              </time>
            </div>
            <p className="text-sm text-espresso whitespace-pre-wrap">
              {comment.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

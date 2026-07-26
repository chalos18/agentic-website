import { NextRequest, NextResponse } from "next/server";
import { readJson, updateJson } from "@/lib/jsonStore";
import {
  sanitizeDisplayName,
  stampSubmission,
  type Comment,
} from "@/lib/anonymousSubmission";

const STORE = "comments";
const MAX_BODY_LENGTH = 2000;

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug)
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const comments = readJson<Comment[]>(STORE, []).filter(
    (c) => c.slug === slug
  );
  return NextResponse.json({ comments });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { slug, name, body: text } = body ?? {};

  if (typeof slug !== "string" || !slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }
  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json(
      { error: "Comment cannot be empty" },
      { status: 400 }
    );
  }
  if (text.length > MAX_BODY_LENGTH) {
    return NextResponse.json({ error: "Comment is too long" }, { status: 400 });
  }

  const comment: Comment = {
    ...stampSubmission(),
    slug,
    name: sanitizeDisplayName(name),
    body: text.trim(),
  };

  await updateJson<Comment[]>(STORE, [], (comments: any) => [
    ...comments,
    comment,
  ]);

  return NextResponse.json({ comment }, { status: 201 });
}

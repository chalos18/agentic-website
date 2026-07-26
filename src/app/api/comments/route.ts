import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/jsonStore';

interface Comment {
  id: string;
  slug: string;
  name: string;
  body: string;
  createdAt: string;
}

const STORE = 'comments';
const MAX_BODY_LENGTH = 2000;

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

  const comments = readJson<Comment[]>(STORE, []).filter((c) => c.slug === slug);
  return NextResponse.json({ comments });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { slug, name, body: text } = body ?? {};

  if (typeof slug !== 'string' || !slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }
  if (typeof text !== 'string' || !text.trim()) {
    return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 });
  }
  if (text.length > MAX_BODY_LENGTH) {
    return NextResponse.json({ error: 'Comment is too long' }, { status: 400 });
  }

  const comment: Comment = {
    id: crypto.randomUUID(),
    slug,
    name: typeof name === 'string' && name.trim() ? name.trim().slice(0, 60) : 'Anonymous Cook',
    body: text.trim(),
    createdAt: new Date().toISOString(),
  };

  const comments = readJson<Comment[]>(STORE, []);
  comments.push(comment);
  writeJson(STORE, comments);

  return NextResponse.json({ comment }, { status: 201 });
}

import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/jsonStore';
import type { RecipeRequest } from '@/lib/recipeRequests';

const STORE = 'recipe-requests';

export async function GET() {
  const requests = readJson<RecipeRequest[]>(STORE, []).filter((r) => r.status !== 'dismissed');
  requests.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return NextResponse.json({ requests });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { recipeName, note, submitterName } = body ?? {};

  if (typeof recipeName !== 'string' || !recipeName.trim()) {
    return NextResponse.json({ error: 'Recipe name is required' }, { status: 400 });
  }

  const entry: RecipeRequest = {
    id: crypto.randomUUID(),
    recipeName: recipeName.trim().slice(0, 120),
    note: typeof note === 'string' ? note.trim().slice(0, 500) : '',
    submitterName:
      typeof submitterName === 'string' && submitterName.trim()
        ? submitterName.trim().slice(0, 60)
        : 'Anonymous Cook',
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  const requests = readJson<RecipeRequest[]>(STORE, []);
  requests.push(entry);
  writeJson(STORE, requests);

  return NextResponse.json({ request: entry }, { status: 201 });
}

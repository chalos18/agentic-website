import { NextRequest, NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/jsonStore';
import { RECIPE_ADMIN_KEY, type RecipeRequest } from '@/lib/recipeRequests';

const STORE = 'recipe-requests';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { status, adminKey } = body ?? {};

  if (adminKey !== RECIPE_ADMIN_KEY) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }
  if (status !== 'quoted' && status !== 'dismissed' && status !== 'open') {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const requests = readJson<RecipeRequest[]>(STORE, []);
  const entry = requests.find((r) => r.id === id);
  if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  entry.status = status;
  writeJson(STORE, requests);

  return NextResponse.json({ request: entry });
}

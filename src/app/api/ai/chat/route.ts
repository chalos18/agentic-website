export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    // TODO: replace stub with real AI integration
    return new Response(JSON.stringify({ reply: 'This is a stubbed AI response', received: body }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed' }), { status: 500 });
  }
}

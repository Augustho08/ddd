export async function GET() {
  return Response.json({ ok: true, message: 'Lista de imagens' });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return Response.json({ ok: true, body });
}

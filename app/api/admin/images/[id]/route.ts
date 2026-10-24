export async function GET(_: Request) {
  return Response.json({ ok: true, image: null });
}

export async function DELETE(_: Request) {
  return Response.json({ ok: true, deleted: true });
}

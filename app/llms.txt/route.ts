export function GET() {
  return new Response(
    "# Paano\n\nPaano is a B2B LinkedIn creator marketplace.\n\n## Public routes\n- /\n- /creators\n- /pricing\n- /about\n- /help\n",
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
}

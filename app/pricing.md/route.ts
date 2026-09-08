export function GET() {
  return new Response(
    "# Paano pricing\n\nPaano offers self-serve and managed campaign plans. Visit /pricing for details.\n",
    { headers: { "Content-Type": "text/markdown; charset=utf-8" } },
  );
}

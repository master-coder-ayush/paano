import { NextResponse } from "next/server";
export const dynamic = "force-static";
export async function GET() {
  return new NextResponse(
    `(function(){window.paano=window.paano||function(){(window.paano.q=window.paano.q||[]).push(arguments)};})();`,
    {
      headers: {
        "content-type": "application/javascript; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    },
  );
}

import { NextResponse } from "next/server";
export const dynamic = "force-static";
export async function GET() {
  return new NextResponse(
    `(function(){var s=document.currentScript,site=s&&s.getAttribute('data-site'),q=window.paano=window.paano||function(){(window.paano.q=window.paano.q||[]).push(arguments)};function send(x){if(!site)return;var track=x[0]==='track',e=track?x[1]:x[0],p=track?(x[2]||{}):(x[1]||{});fetch('/api/pixel/events',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({site:site,event:e,properties:p,debug:location.search.indexOf('paano_debug=1')>-1})}).catch(function(){})}var old=q.q||[];q.q=[];old.concat([['pageview',{}]]).forEach(send);q=function(){var x=[].slice.call(arguments);q.q=q.q||[];q.q.push(x);send(x)};window.paano=q})();`,
    {
      headers: {
        "content-type": "application/javascript; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    },
  );
}

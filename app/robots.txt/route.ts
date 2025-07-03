const baseUrl = "https://www.laboratoriolopez.com"

export function GET() {
  const content = `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml`;
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
} 
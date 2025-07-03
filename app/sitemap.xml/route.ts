import { createServerSupabaseClient } from "@/lib/supabase-client"

const baseUrl = "https://www.laboratoriolopez.com"

export async function GET() {
  const supabase = createServerSupabaseClient()

  // Rutas estáticas principales
  const staticPaths = [
    "", // home
    "/analisis",
    "/servicios",
    "/nosotros",
    "/promociones",
  ]

  // Rutas dinámicas: análisis individuales
  const { data: analyses } = await supabase
    .from("analyses")
    .select("id, name")
    .limit(1000)

  const dynamicPaths: string[] = []
  if (analyses && Array.isArray(analyses)) {
    analyses.forEach((a) => {
      const slug = String(a.name || "").toLowerCase().replace(/\s+/g, "-")
      dynamicPaths.push(`/analisis/${slug}`)
    })
  }

  const urls = [...staticPaths, ...dynamicPaths]

  const lastmod = new Date().toISOString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (path) =>
          `  <url>\n    <loc>${baseUrl}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${path === "" ? "1.0" : "0.8"}</priority>\n  </url>`
      )
      .join("\n") +
    "\n</urlset>"

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
} 
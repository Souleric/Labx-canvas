import { createServiceClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
  const { pages, slug } = await req.json() as {
    pages: Array<{ filename: string; html: string }>
    slug: string
  }

  if (!pages?.length || !slug) {
    return Response.json({ error: 'Missing pages or slug' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const results: string[] = []

  for (const { filename, html } of pages) {
    const path = `html/${slug}/${filename}`
    const blob = new Blob([html], { type: 'text/html; charset=utf-8' })
    const file = new File([blob], filename, { type: 'text/html' })

    const { data, error } = await supabase.storage
      .from('sites')
      .upload(path, file, { upsert: true, contentType: 'text/html; charset=utf-8' })

    if (error) return Response.json({ error: error.message }, { status: 500 })

    const { data: { publicUrl } } = supabase.storage.from('sites').getPublicUrl(data.path)
    results.push(publicUrl)
  }

  // Return the home page URL as the primary published URL
  return Response.json({ url: results[0], pages: results })
}

import { createServiceClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')
  const contentType = req.headers.get('content-type') || 'image/jpeg'

  if (!path) return Response.json({ error: 'Missing path' }, { status: 400 })

  const buffer = await req.arrayBuffer()
  if (!buffer.byteLength) return Response.json({ error: 'Empty file' }, { status: 400 })

  console.log('[upload] path:', path, 'contentType:', contentType, 'bytes:', buffer.byteLength)

  const supabase = createServiceClient()
  const uint8 = new Uint8Array(buffer)
  const { data, error } = await supabase.storage
    .from('Site')
    .upload(path, uint8, { upsert: true, contentType })

  if (error) {
    console.error('[upload] Supabase error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage.from('Site').getPublicUrl(data.path)
  return Response.json({ url: publicUrl })
}

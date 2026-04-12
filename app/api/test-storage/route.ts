import { createServiceClient } from '@/lib/supabase-server'

// Tiny 1×1 white JPEG
const PIXEL = Buffer.from(
  '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k=',
  'base64'
)

export async function GET() {
  const supabase = createServiceClient()

  console.log('[test-storage] SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30))
  console.log('[test-storage] SERVICE_KEY set:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

  // Test 1: flat path
  const { data: d1, error: e1 } = await supabase.storage
    .from('sites')
    .upload('test.jpg', PIXEL, { upsert: true, contentType: 'image/jpeg' })

  if (e1) {
    console.error('[test-storage] flat path failed:', JSON.stringify(e1))
    return Response.json({ test: 'flat path', error: e1.message, full: e1 }, { status: 500 })
  }

  // Test 2: nested path
  const { data: d2, error: e2 } = await supabase.storage
    .from('sites')
    .upload('images/test/pixel.jpg', PIXEL, { upsert: true, contentType: 'image/jpeg' })

  if (e2) {
    console.error('[test-storage] nested path failed:', JSON.stringify(e2))
    return Response.json({ test: 'nested path', error: e2.message, full: e2 }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage.from('sites').getPublicUrl(d2!.path)
  return Response.json({ success: true, flat: d1, nested: d2, url: publicUrl })
}

import { createServiceClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

const BUCKET = 'Site'

async function listAllFiles(supabase: ReturnType<typeof createServiceClient>, prefix: string): Promise<{ name: string; path: string; url: string; created_at: string; size: number }[]> {
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 500, sortBy: { column: 'created_at', order: 'desc' } })
  if (error || !data) return []
  const results: { name: string; path: string; url: string; created_at: string; size: number }[] = []
  for (const item of data) {
    if (item.name === '.emptyFolderPlaceholder') continue
    const fullPath = `${prefix}/${item.name}`
    if (item.id === null) {
      // it's a folder — recurse
      const nested = await listAllFiles(supabase, fullPath)
      results.push(...nested)
    } else {
      results.push({
        name: item.name,
        path: fullPath,
        url: supabase.storage.from(BUCKET).getPublicUrl(fullPath).data.publicUrl,
        created_at: item.created_at ?? '',
        size: (item.metadata as Record<string, number> | null)?.size ?? 0,
      })
    }
  }
  return results
}

export async function GET() {
  const supabase = createServiceClient()
  const files = await listAllFiles(supabase, 'images')
  files.sort((a, b) => b.created_at.localeCompare(a.created_at))
  return NextResponse.json({ files })
}

export async function DELETE(req: NextRequest) {
  const { path } = await req.json()
  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 })
  const supabase = createServiceClient()
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

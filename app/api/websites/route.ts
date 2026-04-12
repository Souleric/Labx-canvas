import { NextRequest, NextResponse } from 'next/server'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

const WEBSITES_DIR = join(process.cwd(), 'Websites')

export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get('file')

  if (file) {
    // Prevent path traversal
    if (file.includes('..') || file.includes('/') || !file.endsWith('.html')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }
    try {
      const content = await readFile(join(WEBSITES_DIR, file), 'utf-8')
      return NextResponse.json({ content })
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
  }

  try {
    const files = await readdir(WEBSITES_DIR)
    const htmlFiles = files.filter(f => f.endsWith('.html'))
    return NextResponse.json({ files: htmlFiles })
  } catch {
    return NextResponse.json({ files: [] })
  }
}

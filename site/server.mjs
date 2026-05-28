import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const port = Number(process.env.PORT || 4173)
const root = join(process.cwd(), 'dist')

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function resolvePath(url) {
  const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname)
  const requested = pathname === '/' ? '/index.html' : pathname
  const normalized = normalize(requested).replace(/^(\.\.[/\\])+/, '')
  return join(root, normalized)
}

createServer(async (req, res) => {
  try {
    const filePath = resolvePath(req.url || '/')
    const data = await readFile(filePath)
    const ext = extname(filePath)
    const headers = {
      'Content-Type': contentTypes[ext] || 'application/octet-stream',
    }
    // Permite que outros sites (ex: agregador Podcast Organizer) consumam
    // os JSONs estaticos via fetch do browser.
    if (ext === '.json') {
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    }
    res.writeHead(200, headers)
    res.end(data)
  } catch {
    const data = await readFile(join(root, 'index.html'))
    res.writeHead(200, { 'Content-Type': contentTypes['.html'] })
    res.end(data)
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`Static server listening on ${port}`)
})

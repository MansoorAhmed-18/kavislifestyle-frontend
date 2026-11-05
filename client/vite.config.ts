import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

function crossDeviceDataSyncPlugin(): Plugin {
  const resolveDbPath = (filename: string): string => {
    const candidates = [
      path.resolve(process.cwd(), filename),
      path.resolve(process.cwd(), '..', filename),
      path.resolve(import.meta.dirname || '', '..', filename),
      path.resolve('D:/kavislifestyle', filename)
    ]
    for (const c of candidates) {
      try {
        if (fs.existsSync(c)) return c
      } catch {}
    }
    return path.resolve(process.cwd(), '..', filename)
  }

  const ordersDbPath = resolveDbPath('orders-db.json')
  const usersDbPath = resolveDbPath('users-db.json')

  const readJson = (filePath: string, fallback: any = []) => {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8')
        return JSON.parse(raw)
      }
    } catch (e) {
      console.error(`[CrossDevice API] Failed to read ${filePath}`, e)
    }
    return fallback
  }

  const writeJson = (filePath: string, data: any) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (e) {
      console.error(`[CrossDevice API] Failed to write ${filePath}`, e)
    }
  }

  const parseRequestBody = (req: any): Promise<any> => {
    return new Promise((resolve) => {
      if (req.body && typeof req.body === 'object') {
        return resolve(req.body)
      }
      let rawData = ''
      req.on('data', (chunk: any) => {
        rawData += chunk
      })
      req.on('end', () => {
        if (!rawData) return resolve({})
        try {
          resolve(JSON.parse(rawData))
        } catch {
          resolve({})
        }
      })
      req.on('error', () => {
        resolve({})
      })
    })
  }

  return {
    name: 'cross-device-data-sync',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Universal CORS headers for all devices on local network
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }

        const rawUrl = req.url || '/'
        let pathname = '/'
        try {
          const parsed = new URL(rawUrl, `http://${req.headers.host || 'localhost'}`)
          pathname = parsed.pathname.replace(/\/+$/, '') || '/'
        } catch {
          pathname = rawUrl.split('?')[0].replace(/\/+$/, '') || '/'
        }

        // ==========================================
        // 1. ORDERS API (/api/orders, /api/orders/sync, /api/orders/status)
        // ==========================================
        if (pathname === '/api/orders' || pathname.startsWith('/api/orders/')) {
          // Status update (POST /api/orders/status or PUT /api/orders/:id/status)
          if ((req.method === 'POST' || req.method === 'PUT') && pathname.includes('/status')) {
            const data = await parseRequestBody(req)
            const orderId = data.orderId || pathname.split('/')[3]
            const { status, carrier, trackingNumber } = data

            const orders = readJson(ordersDbPath, [])
            let updatedOrder = null
            const nextOrders = orders.map((o: any) => {
              if (o.id === orderId || o.orderNumber === orderId) {
                updatedOrder = {
                  ...o,
                  status: status || o.status,
                  carrier: carrier || o.carrier,
                  trackingNumber: trackingNumber || o.trackingNumber,
                  updatedAt: new Date().toISOString()
                }
                return updatedOrder
              }
              return o
            })

            writeJson(ordersDbPath, nextOrders)
            console.log(`[CrossDevice API] Updated order status for ${orderId} -> ${status}`)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, order: updatedOrder, orders: nextOrders }))
            return
          }

          // GET /api/orders
          if (req.method === 'GET' && (pathname === '/api/orders' || pathname === '/api/orders/')) {
            const orders = readJson(ordersDbPath, [])
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, orders }))
            return
          }

          // POST /api/orders/sync (bulk sync from mobile or laptop)
          if (req.method === 'POST' && pathname === '/api/orders/sync') {
            const payload = await parseRequestBody(req)
            const incomingList: any[] = Array.isArray(payload)
              ? payload
              : Array.isArray(payload.orders)
              ? payload.orders
              : payload.order
              ? [payload.order]
              : []

            const existingOrders = readJson(ordersDbPath, [])
            const map = new Map<string, any>()

            // Load existing
            existingOrders.forEach((o: any) => {
              const k = o.orderNumber || o.id
              if (k) map.set(k, o)
            })

            // Merge incoming
            incomingList.forEach((inc: any) => {
              const k = inc.orderNumber || inc.id
              if (k) {
                if (map.has(k)) {
                  map.set(k, { ...map.get(k), ...inc })
                } else {
                  map.set(k, inc)
                }
              }
            })

            const merged = Array.from(map.values()).sort(
              (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )

            writeJson(ordersDbPath, merged)
            console.log(`[CrossDevice API] Bulk sync: received ${incomingList.length} orders -> total on server: ${merged.length}`)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, orders: merged }))
            return
          }

          // POST /api/orders (place new order or upsert single order)
          if (req.method === 'POST' && (pathname === '/api/orders' || pathname === '/api/orders/')) {
            const payload = await parseRequestBody(req)
            const newOrder = payload.order || payload

            if (!newOrder.id && !newOrder.orderNumber) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Order must contain id or orderNumber' }))
              return
            }

            const orders = readJson(ordersDbPath, [])
            const existingIdx = orders.findIndex(
              (o: any) => o.id === newOrder.id || o.orderNumber === newOrder.orderNumber
            )

            let nextOrders
            if (existingIdx >= 0) {
              nextOrders = orders.map((o: any, idx: number) =>
                idx === existingIdx ? { ...o, ...newOrder } : o
              )
            } else {
              nextOrders = [newOrder, ...orders]
            }

            writeJson(ordersDbPath, nextOrders)
            console.log(`[CrossDevice API] Upsert order ${newOrder.orderNumber || newOrder.id} (${newOrder.customer?.email}) -> total: ${nextOrders.length}`)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, order: newOrder, orders: nextOrders }))
            return
          }
        }

        // ==========================================
        // 2. USERS API (/api/users - Shared Accounts)
        // ==========================================
        if (pathname === '/api/users' || pathname.startsWith('/api/users/')) {
          // GET /api/users
          if (req.method === 'GET') {
            const users = readJson(usersDbPath, [])
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, users }))
            return
          }

          // POST /api/users (register or upsert user account)
          if (req.method === 'POST') {
            const userAccount = await parseRequestBody(req)
            if (!userAccount.email) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'User email is required' }))
              return
            }

            const users = readJson(usersDbPath, [])
            const normEmail = userAccount.email.toLowerCase().trim()
            const existingIdx = users.findIndex(
              (u: any) => u.email.toLowerCase().trim() === normEmail
            )

            let nextUsers
            if (existingIdx >= 0) {
              nextUsers = users.map((u: any, idx: number) =>
                idx === existingIdx ? { ...u, ...userAccount } : u
              )
            } else {
              nextUsers = [...users, userAccount]
            }

            writeJson(usersDbPath, nextUsers)
            console.log(`[CrossDevice API] Saved user account: ${userAccount.email}`)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, user: userAccount, users: nextUsers }))
            return
          }
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    crossDeviceDataSyncPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5174,
    host: true
  }
})

import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

function crossDeviceDataSyncPlugin(): Plugin {
  const ordersDbPath = path.resolve(import.meta.dirname, '../orders-db.json')
  const usersDbPath = path.resolve(import.meta.dirname, '../users-db.json')

  const readJson = (filePath: string, fallback: any = []) => {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8')
        return JSON.parse(raw)
      }
    } catch (e) {
      console.error(`Failed to read ${filePath}`, e)
    }
    return fallback
  }

  const writeJson = (filePath: string, data: any) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (e) {
      console.error(`Failed to write ${filePath}`, e)
    }
  }

  return {
    name: 'cross-device-data-sync',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
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
        // 1. ORDERS API (/api/orders, /api/orders/status)
        // ==========================================
        if (pathname === '/api/orders' || pathname.startsWith('/api/orders/')) {
          // Status update
          if ((req.method === 'POST' || req.method === 'PUT') && pathname.includes('/status')) {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              try {
                const data = JSON.parse(body || '{}')
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
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, order: updatedOrder, orders: nextOrders }))
              } catch (err: any) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: err.message }))
              }
            })
            return
          }

          // GET /api/orders
          if (req.method === 'GET' && (pathname === '/api/orders' || pathname === '/api/orders/')) {
            const orders = readJson(ordersDbPath, [])
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, orders }))
            return
          }

          // POST /api/orders (place new order or upsert existing order)
          if (req.method === 'POST' && (pathname === '/api/orders' || pathname === '/api/orders/')) {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              try {
                const newOrder = JSON.parse(body || '{}')
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
                  nextOrders = orders.map((o: any, idx: number) => (idx === existingIdx ? { ...o, ...newOrder } : o))
                } else {
                  nextOrders = [newOrder, ...orders]
                }
                writeJson(ordersDbPath, nextOrders)
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, order: newOrder, orders: nextOrders }))
              } catch (err: any) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: err.message }))
              }
            })
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
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              try {
                const userAccount = JSON.parse(body || '{}')
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
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, user: userAccount, users: nextUsers }))
              } catch (err: any) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: err.message }))
              }
            })
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

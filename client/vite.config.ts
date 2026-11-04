import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

function crossDeviceOrdersSyncPlugin(): Plugin {
  const dbPath = path.resolve(import.meta.dirname, '../orders-db.json')

  const readOrders = () => {
    try {
      if (fs.existsSync(dbPath)) {
        const raw = fs.readFileSync(dbPath, 'utf-8')
        return JSON.parse(raw)
      }
    } catch (e) {
      console.error('Failed to read orders-db.json', e)
    }
    return []
  }

  const writeOrders = (orders: any[]) => {
    try {
      fs.writeFileSync(dbPath, JSON.stringify(orders, null, 2), 'utf-8')
    } catch (e) {
      console.error('Failed to write orders-db.json', e)
    }
  }

  return {
    name: 'cross-device-orders-sync',
    configureServer(server) {
      server.middlewares.use('/api/orders', (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }

        const url = req.url || '/'

        // 1. GET /api/orders
        if (req.method === 'GET' && (url === '/' || url === '')) {
          const orders = readOrders()
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, orders }))
          return
        }

        // 2. PUT or POST to update status: /api/orders/status or /api/orders/:id/status
        if ((req.method === 'POST' || req.method === 'PUT') && url.includes('status')) {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}')
              const orderId = data.orderId || url.split('/')[1]
              const { status, carrier, trackingNumber } = data

              const orders = readOrders()
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

              writeOrders(nextOrders)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, order: updatedOrder, orders: nextOrders }))
            } catch (err: any) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: err.message }))
            }
          })
          return
        }

        // 3. POST /api/orders (place new order)
        if (req.method === 'POST' && (url === '/' || url === '')) {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const newOrder = JSON.parse(body || '{}')
              const orders = readOrders()
              const existingIdx = orders.findIndex((o: any) => o.id === newOrder.id || o.orderNumber === newOrder.orderNumber)
              let nextOrders
              if (existingIdx >= 0) {
                nextOrders = orders.map((o: any, idx: number) => idx === existingIdx ? { ...o, ...newOrder } : o)
              } else {
                nextOrders = [newOrder, ...orders]
              }
              writeOrders(nextOrders)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, order: newOrder, orders: nextOrders }))
            } catch (err: any) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: err.message }))
            }
          })
          return
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
    crossDeviceOrdersSyncPlugin()
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

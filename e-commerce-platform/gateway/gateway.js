import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'

const app = express()

// Auth service - port 8001
app.use('/api/auth', createProxyMiddleware({
  target: 'http://localhost:8001',
  changeOrigin: true
}))

// Product service - port 8002
app.use('/api/products', createProxyMiddleware({
  target: 'http://localhost:8002',
  changeOrigin: true
}))

// Cart service - port 8003
app.use('/api/cart', createProxyMiddleware({
  target: 'http://localhost:8003',
  changeOrigin: true
}))

// Order service - port 8004
app.use('/api/orders', createProxyMiddleware({
  target: 'http://localhost:8004',
  changeOrigin: true
}))

// Payment service - port 8005
app.use('/api/payments', createProxyMiddleware({
  target: 'http://localhost:8005',
  changeOrigin: true
}))

const PORT = 8000
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`)
})

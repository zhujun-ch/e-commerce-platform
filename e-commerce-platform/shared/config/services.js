// Centralized service URL configuration for microservices
// Use internal URLs (docker service names) for service-to-service communication
// Use external URLs (localhost) for client-to-service communication

const SERVICES = {
  auth: {
    url: process.env.AUTH_SERVICE_URL || 'http://localhost:8001',
    internalUrl: process.env.AUTH_SERVICE_INTERNAL_URL || 'http://auth-service:8001'
  },
  product: {
    url: process.env.PRODUCT_SERVICE_URL || 'http://localhost:8002',
    internalUrl: process.env.PRODUCT_SERVICE_INTERNAL_URL || 'http://product-service:8002'
  },
  cart: {
    url: process.env.CART_SERVICE_URL || 'http://localhost:8003',
    internalUrl: process.env.CART_SERVICE_INTERNAL_URL || 'http://cart-service:8003'
  },
  order: {
    url: process.env.ORDER_SERVICE_URL || 'http://localhost:8004',
    internalUrl: process.env.ORDER_SERVICE_INTERNAL_URL || 'http://order-service:8004'
  },
  payment: {
    url: process.env.PAYMENT_SERVICE_URL || 'http://localhost:8005',
    internalUrl: process.env.PAYMENT_SERVICE_INTERNAL_URL || 'http://payment-service:8005'
  }
};

module.exports = { SERVICES };
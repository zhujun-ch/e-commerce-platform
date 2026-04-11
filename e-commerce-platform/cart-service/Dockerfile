FROM node:18-alpine

WORKDIR /app

COPY cart-service/package*.json ./
RUN npm install --only=production

COPY cart-service/src/ ./src/
COPY shared/ ./src/shared/

EXPOSE 8003

CMD ["node", "src/index.js"]

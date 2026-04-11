FROM node:18-alpine

WORKDIR /app

COPY product-service/package*.json ./
RUN npm install --only=production

COPY product-service/src/ ./src/
COPY shared/ ./src/shared/

EXPOSE 8002

CMD ["node", "src/index.js"]

FROM node:18-alpine

WORKDIR /app

COPY order-service/package*.json ./
RUN npm install --only=production

COPY order-service/src/ ./src/
COPY shared/ ./src/shared/

EXPOSE 8004

CMD ["node", "src/index.js"]

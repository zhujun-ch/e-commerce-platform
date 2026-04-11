FROM node:18-alpine

WORKDIR /app

COPY auth-service/package*.json ./
RUN npm install --only=production

COPY auth-service/src/ ./src/
COPY shared/ ./src/shared/

EXPOSE 8001

CMD ["node", "src/index.js"]

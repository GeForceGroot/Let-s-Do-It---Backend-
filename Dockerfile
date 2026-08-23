FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package.json
COPY . .

RUN npm install --no-optional
RUN npm run build

# Runtime stage
FROM node:18-slim

WORKDIR /app

COPY --from=builder /app .

EXPOSE 3000

CMD ["node", "backend/dist/server.js"]

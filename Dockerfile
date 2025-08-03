# Stage 1: Build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Output vite.config.ts for debugging
RUN echo '--- vite.config.ts contents ---' && cat vite.config.ts && echo '--- end vite.config.ts ---'
RUN npm run build

# Stage 2: Serve the built app with a static file server
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve
EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]

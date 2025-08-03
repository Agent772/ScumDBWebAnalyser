# Stage 1: Build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve the built app with Vite preview
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json package-lock.json ./
RUN npm ci
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]

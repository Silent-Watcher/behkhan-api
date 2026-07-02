# ---- Stage 1
FROM node:24-alpine AS deps
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci

# ---- Stage 2
FROM node:24-alpine AS build
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Stage 3
FROM node:24-alpine AS prod-deps
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
ENV HUSKY=0
RUN npm ci --omit=dev

# ---- Stage 4
FROM node:24-alpine AS production
ENV NODE_ENV=production
WORKDIR /usr/src/app
RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs
COPY --from=prod-deps --chown=nodeuser:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=nodeuser:nodejs /usr/src/app/dist ./dist
COPY --from=build --chown=nodeuser:nodejs /usr/src/app/package.json ./package.json
USER nodeuser
EXPOSE 8081
CMD ["npm", "run", "start:prod"]

FROM node:24-alpine AS builder

WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app
USER node

RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000 \
    --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    npm ci

COPY --chown=node:node . .

RUN npm run build

FROM node:24-alpine AS deps

WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app
USER node

RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000 \
    --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    npm ci --omit=dev


FROM node:24-alpine AS runner

WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app
USER node

COPY --from=deps --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=node:node /usr/src/app/dist ./dist
COPY --from=builder --chown=node:node /usr/src/app/package.json ./package.json

EXPOSE 8081

CMD ["npm", "run", "start:prod"]

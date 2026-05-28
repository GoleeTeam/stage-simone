FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

ENV PNPM_IGNORE_SCRIPTS=false
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build


FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

ENV PNPM_IGNORE_SCRIPTS=false
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
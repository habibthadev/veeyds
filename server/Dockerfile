FROM node:22-bookworm-slim AS builder

RUN corepack enable

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    curl \
    unzip \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --upgrade yt-dlp --break-system-packages

RUN curl -fsSL https://deno.land/install.sh | DENO_INSTALL=/usr/local sh

WORKDIR /app

COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN bash scripts/install-bins.sh

RUN pnpm run build

RUN pnpm prune --prod

FROM node:22-bookworm-slim

ENV NODE_ENV=production

RUN corepack enable

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    unzip \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --upgrade yt-dlp --break-system-packages

RUN curl -fsSL https://deno.land/install.sh | DENO_INSTALL=/usr/local sh

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/bin ./bin
COPY --from=builder /app/package.json ./

EXPOSE 3001

CMD ["node", "dist/index.js"]

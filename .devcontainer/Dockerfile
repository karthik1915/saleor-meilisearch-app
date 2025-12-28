FROM mcr.microsoft.com/devcontainers/typescript-node:22

ENV PNPM_HOME="/home/node/.pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

RUN mkdir -p /app/.pnpm-store
RUN chown -R node:node /app/.pnpm-store

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 7000
CMD ["pnpm", "start"]

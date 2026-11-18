# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim AS build

WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci --no-audit --no-fund
COPY src/ ./src/
RUN npm run build && npm prune --omit=dev --no-audit --no-fund

FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production \
    TMPDIR=/tmp \
    HOME=/tmp \
    TEXMFVAR=/tmp/texmf-var \
    TEXMFCONFIG=/tmp/texmf-config

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
      latexmk \
      texlive-latex-base \
      texlive-latex-recommended \
      texlive-latex-extra \
      texlive-fonts-recommended \
      poppler-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules/ ./node_modules/
COPY --from=build /app/dist/ ./dist/
COPY scripts/smoke-test.cjs ./scripts/smoke-test.cjs

USER node
CMD ["node", "scripts/smoke-test.cjs"]

FROM node:22-alpine

WORKDIR /app

COPY site/package*.json ./site/
RUN cd site && npm install --no-audit --no-fund

COPY site ./site
COPY data ./data

RUN cp data/*.json site/public/ && cd site && npm run build

WORKDIR /app/site

CMD ["node", "server.mjs"]

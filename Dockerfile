FROM node:24-alpine

WORKDIR /app

COPY site/package*.json ./site/
RUN cd site && npm ci

COPY site ./site
COPY data ./data

RUN cp data/*.json site/public/ && cd site && npm run build

WORKDIR /app/site

CMD ["sh", "-c", "npm run preview -- --host 0.0.0.0 --port ${PORT:-4173}"]

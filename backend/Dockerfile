FROM oven/bun:latest
WORKDIR /app

COPY package.json ./

# Install dependencies
RUN bun install

CMD ["bun", "run", "dev"]

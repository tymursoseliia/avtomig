FROM node:20-alpine

WORKDIR /app

RUN npm install -g bun

# Cache layer for dependencies
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN bun run build

# ENV variables
ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Expose port and run using the standard Next.js built-in server (reliable static serving)
EXPOSE 3000
CMD ["npm", "run", "start"]

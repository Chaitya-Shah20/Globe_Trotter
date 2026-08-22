FROM node:22-alpine

# Install OpenSSL required by Prisma and other essentials
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy package management files
COPY package.json package-lock.json ./

# Install dependencies (using install since lockfile might be out of sync)
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

# Default command (can be overridden by docker-compose)
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]

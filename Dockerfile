FROM node:18-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Install Python and build dependencies
RUN apk add --no-cache python3 make g++ gcc

# Copy package files
COPY package*.json ./

# Install dependencies and NestJS CLI globally
RUN npm install -g @nestjs/cli && npm install --include=dev

# Copy source files
COPY . .

# Build the app
RUN npm run build

FROM node:18-alpine As production

# Set node environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Create app directory
WORKDIR /usr/src/app

# Install Python and build dependencies
RUN apk add --no-cache python3 make g++ gcc

# Copy package files
COPY package*.json ./

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Install production dependencies
RUN npm ci --only=production

# Copy built application
COPY --from=development /usr/src/app/dist ./dist

# Start the server
CMD ["node", "dist/main"] 
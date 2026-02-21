FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port (will be overridden by docker-compose)
EXPOSE 3001

# Start the application
CMD ["npm", "start"]

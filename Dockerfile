FROM node:23-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application files
COPY . .

# Expose your dev server port (adjust if different)
EXPOSE 5173

# Start app in dev mode
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
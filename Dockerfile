FROM node:18-alpine
WORKDIR /home/node/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY index.js ./

# Expose the port your app uses
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]

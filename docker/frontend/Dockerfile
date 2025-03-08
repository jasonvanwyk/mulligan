FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy source code and public files
COPY src/ ./src/
COPY public/ ./public/

# Build the app
RUN npm run build

# Install serve to run the production build
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"] 
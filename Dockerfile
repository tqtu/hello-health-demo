# Stage 1: Build React App (Vite)
FROM node:20-alpine as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker cache for faster installs
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the project (Vite outputs to 'dist' folder by default)
RUN npm run build

# Stage 2: Serve the production build with a static file server
FROM node:20-alpine

WORKDIR /app

# Install 'serve' globally to handle static file hosting
RUN npm install -g serve

# Copy the production-ready 'dist' folder from the builder stage
# We name it 'build' here so the 'serve' command matches
COPY --from=builder /app/dist ./build

# Inform Docker that the container listens on port 3000
EXPOSE 3000

# Start the server to serve the 'build' folder on port 3000
CMD ["serve", "-s", "build", "-l", "3000"]
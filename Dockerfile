# Stage 1: Build the application
FROM node:18 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create the runtime image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json to the working directory
COPY package*.json ./

# Install only production dependencies
RUN npm install

# Copy the build output from the builder stage
COPY --from=builder /usr/src/app/build ./build

# Copy the .env file to the working directory
COPY .env ./

# Set the command to run the application
CMD [ "npm", "run", "widget" ]

# Expose the necessary ports
EXPOSE 3007


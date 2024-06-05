# Use the official Node.js image as a base image
FROM node:14

# Set the working directory in the container
WORKDIR /kraftbase

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "app.js"]

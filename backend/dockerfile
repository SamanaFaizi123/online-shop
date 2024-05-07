# Use official Node.js image as base
FROM node:14

# Set working directory inside the container
WORKDIR /sr/

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy the rest of the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Command to run the backend server with nodemon
CMD ["nodemon", "app.js"]

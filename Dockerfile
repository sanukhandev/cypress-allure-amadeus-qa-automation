# Use the official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install dependencies inside the container
RUN npm ci

# Copy the rest of the application code into the container
COPY . .
ENV TERM xterm

# Install Cypress dependencies and Google Chrome
RUN apt-get update && \
    apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable

# Expose the Allure report port
EXPOSE 8080

# Define the command to run the tests and generate the Allure report
CMD ["sh", "-c", "npm run beforetest && npm run cy:run:headless && npm run aftertest"]

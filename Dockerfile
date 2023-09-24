# Use Cypress's base image as your starting point
FROM cypress/base:latest

RUN mkdir -p /usr/share/man/man1
RUN apt-get clean && \
    apt-get update --fix-missing && \
    apt-get install -f
# Install Chrome
RUN apt-get update && \
    apt-get install -y wget gnupg2 openjdk-11-jre-headless && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable

# Set JAVA_HOME
ENV JAVA_HOME /usr/lib/jvm/java-11-openjdk-amd64
# Set work directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install Cypress
RUN npm install cypress --save-dev

# Copy everything else
COPY . .

# This will install other dependencies and also ensure Cypress binary is cached
RUN npm install

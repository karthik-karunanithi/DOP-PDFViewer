FROM ubuntu:20.04
WORKDIR /app
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5003
CMD ["npm", "run","start"]
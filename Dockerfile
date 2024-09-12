FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN next build
EXPOSE 3000

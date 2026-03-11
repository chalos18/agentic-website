# Set of instructions to build a docker image
FROM node:24

WORKDIR /app

# install dependencies so they can be cached
COPY package*.json ./

RUN npm install

RUN apt-get update && apt-get install -y ffmpeg

COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

ENV PORT=8080
EXPOSE 8080

# Run the compiled JavaScript instead of ts-node
CMD ["node", "dist/index.js"]
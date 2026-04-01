from node:22-alpine as base

workdir /app

copy package*.json ./
run npm install

copy . .

run npx prisma generate
run npm run build

expose 300

cmd ["sh", "-c", "npx prisma migrate deploy && npm run start"]
FROM node:14

WORKDIR /kraftbase

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["node", "app.js"]

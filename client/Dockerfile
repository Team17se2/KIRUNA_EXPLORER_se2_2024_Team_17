FROM node:23
WORKDIR /app
COPY package*.json .
RUN npm install --ignore-scripts
COPY . .
RUN npm run build
EXPOSE 5173
CMD [ "npm", "run", "dev" ]
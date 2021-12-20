FROM node:12-alpine

# Add package file
COPY package*.json ./

# Install deps
RUN npm i

# Copy source   
COPY src ./src
COPY tsconfig.json ./tsconfig.json

RUN npm run build

CMD npm run start
FROM node:12-alpine

# Add package file
COPY package.json ./

# Install deps
RUN npm i

# Copy source
COPY src ./src
COPY pages ./pages
COPY public ./public
COPY next.config.js ./next.config.js
COPY tsconfig.json ./tsconfig.json

# Env
ENV PORT='3333'

# Build dist
RUN npm run build

# Expose port 3333
EXPOSE 3333

CMD npm run start

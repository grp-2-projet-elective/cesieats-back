FROM node:16.9.1

# Set working dir
RUN mkdir /app
WORKDIR /app

# Copy files and remove node_modules dir if accidently copied
COPY . /app
RUN rm -rf ./node_modules

# Install deps
RUN npm install

# Expose ports
EXPOSE 3030

RUN npm run build
ENTRYPOINT npm start

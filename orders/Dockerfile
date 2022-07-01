FROM node:16.10.0

# Set working dir
RUN mkdir /app
WORKDIR /app

# Copy files and remove node_modules dir if accidently copied
COPY . /app
RUN rm -rf ./node_modules

# Install deps
RUN npm install

# Expose ports
EXPOSE 4400

ENTRYPOINT npm run dev

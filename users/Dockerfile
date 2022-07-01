FROM node:16.10.0

# Set working dir
RUN mkdir /app
WORKDIR /app

# Copy files and remove node_modules dir if accidently copied 
RUN npm login https://npm.pkg.github.com/
RUN felicienfouillet
RUN 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
RUN npm set https://npm.pkg.github.com/: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
COPY . /app
RUN rm -rf ./node_modules

# Install deps
RUN npm install

# Expose ports
EXPOSE 4100

ENTRYPOINT npm run dev

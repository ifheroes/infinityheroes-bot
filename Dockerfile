# First stage: Clone the repository
FROM bitnami/git as clone_stage
RUN git clone https://github.com/ifheroes/infinityheroes-bot.git /bot

# Second stage: Build and run the Node application
FROM node:16.20.2

# Create the working directory
WORKDIR /bot

# Copy the cloned repository from the first stage
COPY --from=clone_stage /bot ./

COPY config.json /bot/src/data

# Install dependencies
RUN npm install

RUN mkdir /bot/exports

# Deploy the application (if this step is needed)
RUN npm run deploy

# Command to run the application
CMD npm run start

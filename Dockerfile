# First stage: Clone the repository
FROM bitnami/git as clone_stage
RUN git clone https://github.com/ifheroes/infinityheroes-bot.git /bot

# Second stage: Build and run the Node application with Apache and PHP
FROM node:16.20.2

# Install Apache, PHP, jq, and other dependencies
RUN apt-get update && apt-get install -y \
    apache2 \
    php \
    libapache2-mod-php \
    jq && \
    a2enmod rewrite && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Configure Apache
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf && \
    sed -i 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf && \
    sed -i 's/<VirtualHost \*:80>/<VirtualHost \*:8080>/' /etc/apache2/sites-available/000-default.conf

# Create the working directory
WORKDIR /bot

# Copy the cloned repository from the first stage
COPY --from=clone_stage /bot ./

# Copy the configuration file template
RUN cp /bot/src/data/config.json.pub /bot/src/data/config.json

# Add environment variables from compose file
ARG token
ARG clientId
ARG guildId
ARG roleId
ARG color

RUN echo "Token: ${token}"


# Update the configuration file with environment variables
RUN jq --arg token "$token" \
       --arg clientId "$clientId" \
       --arg guildId "$guildId" \
       --arg roleId "$roleId" \
       --arg color "$color" \
       '.token=$token | .clientId=$clientId | .guildId=$guildId | .roleId=$roleId | .color=$color' \
       /bot/src/data/config.json > /bot/src/data/config.json.tmp && \
    mv /bot/src/data/config.json.tmp /bot/src/data/config.json

# Copy the index.php for the API to the webserver directory
RUN mv /bot/index.php /var/www/html/

# Remove the default index.html file if it exists
RUN rm -f /var/www/html/index.html

# Install Node.js dependencies
RUN npm install

# Create the exports directory and link it to the webserver
RUN mkdir /bot/exports && \
    ln -s /bot/exports /var/www/html/exports

# Deploy the application (if this step is needed)
RUN npm run deploy

# Expose port 8080 for Apache
EXPOSE 8080

# Start Apache in the background and run the Node.js application as the primary process
CMD service apache2 start && npm run start

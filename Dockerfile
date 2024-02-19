# First stage: Clone the repository
FROM bitnami/git as clone_stage
RUN git clone https://github.com/ifheroes/infinityheroes-bot.git /bot

# Second stage: Build and run the Node application
FROM node:16.20.2

RUN apt-get update && apt-get install -y apache2 && \
    # Apache Konfiguration anpassen
    a2enmod rewrite && \
    sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf && \
    service apache2 restart && \
    # Aufräumen
    apt-get clean && rm -rf /var/lib/apt/lists/*




# Create the working directory
WORKDIR /bot

# Copy the cloned repository from the first stage
COPY --from=clone_stage /bot ./

COPY config.json /bot/src/data

# Install dependencies
RUN npm install

RUN mkdir /bot/exports && \
    ln -s /bot/exports /var/www/html/exports

# Deploy the application (if this step is needed)
RUN npm run deploy

# Apache im Hintergrund starten und Node.js-Anwendung als primären Prozess ausführen
CMD service apache2 start && npm run start



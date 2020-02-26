FROM node:12.8.0

# Arguments
ARG ssh_prv_key
ARG ssh_pub_key
ARG ssh_known_hosts
ARG host
ARG domain
ARG application
ARG env

# Add .ssh dir
RUN mkdir -p /root/.ssh && \
  chmod 0700 /root/.ssh

# Add SSH keys
RUN echo "$ssh_prv_key" > /root/.ssh/id_rsa && \
  echo "$ssh_pub_key" > /root/.ssh/id_rsa.pub && \
  echo "$ssh_known_hosts" > /root/.ssh/known_hosts && \
  chmod 600 /root/.ssh/id_rsa && \
  chmod 600 /root/.ssh/id_rsa.pub && \
  chmod 600 /root/.ssh/known_hosts

# Set workdir
WORKDIR /app
# Copy app
COPY . .

# Install rsync
RUN apt-get update && apt-get install rsync -y

RUN chmod 777 deploy/deploy.sh

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Install yarn
RUN npm install yarn -g

# Install app
RUN yarn

# Build app
RUN yarn build
RUN yarn build-migrations

# Deploy
RUN deploy/deploy.sh HOST="${host}" DOMAIN="${domain}" APPLICATION="${application}" ENV="${env}"
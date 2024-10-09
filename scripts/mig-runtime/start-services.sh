#!/bin/bash

# This script is used to start the service on dev and production environments
# Don't use this script locally

# Inputs
SERVICE_NAME=$1
COMPOSE_OPTS="${@:2}"  # Additional options to pass to docker compose

echo "Starting $SERVICE_NAME..."
echo "COMPOSE_OPTS set to $COMPOSE_OPTS"

# Change to the service directory
cd /$SERVICE_NAME

# Import common functions and variables
source ./scripts/utils.sh

# Export .env environment variables
eval $(cat ./.env | grep -v '^#' | tr -d '\r')
echo "LUI_ENV set to $LUI_ENV"

# Export the variables so they're available to docker-compose
export LUI_API_BASE_URL

echo "Pull the latest image"
docker pull $ARTIFACT_REPO_URL/$SERVICE_NAME:latest
echo "Starting services with docker-compose"
docker compose up -d $COMPOSE_OPTS
echo "Services started successfully"

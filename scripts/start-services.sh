#!/bin/bash

# This script is used to start all services on dev and production environments, don't use locally

# Exit on errors
set -e

# Go to the /lumino-dashboard directory, where we've loaded all necessary files to run the Dashboard
cd /lumino-dashboard

# Inputs
COMPOSE_OPTS=$1  # Additional options to pass to docker compose

# Constants
LOCAL_ENV="local"

if [[ "$LUI_ENV" == "" ]]; then
  LUI_ENV="$LOCAL_ENV"
fi

# Export .env environment variables; note, we aren't aware of which environment
# we're running on before importing LUI_ENV from .env,
# so we can't cd to /pipeline-zen-jobs conditionally above
eval $(cat ./.env | grep -v '^#' | tr -d '\r')
echo "LUI_ENV set to $LUI_ENV"

# Export the variables so they're available to docker-compose
export LUI_API_BASE_URL

# Configure docker to use gcloud as a credential helper
gcloud auth configure-docker us-central1-docker.pkg.dev --quiet

echo "Pull the latest image"
docker pull us-central1-docker.pkg.dev/neat-airport-407301/lum-docker-images/lumino-dashboard:latest
echo "Starting services with docker-compose"
docker compose up -d $COMPOSE_OPTS

echo "Dashboard services started successfully"

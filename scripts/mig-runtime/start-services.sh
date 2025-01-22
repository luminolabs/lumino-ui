#!/bin/bash

# This script is used to start the service in dev and prod (on GCP) only
# Don't use this script locally

# Exit on errors
set -e

# Export all variables
set -o allexport

# Constants
SERVICE_NAME='lumino-dashboard'
ENV_VAR_PREFIX='LUI'
RESOURCES_PROJECT_ID="neat-airport-407301"
REGION="us-central1"
ARTIFACT_REPO_URL="$REGION-docker.pkg.dev/$RESOURCES_PROJECT_ID/lum-docker-images"

# Inputs
COMPOSE_OPTS="${@:1}"  # Options to pass to docker compose

echo "Starting $SERVICE_NAME..."
echo "ENV_VAR_PREFIX set to $ENV_VAR_PREFIX"
echo "COMPOSE_OPTS set to $COMPOSE_OPTS"

echo "Pulling env variables from metadata server"
LUI_ENV=$(curl -s -H "Metadata-Flavor: Google" "http://metadata.google.internal/computeMetadata/v1/instance/attributes/${ENV_VAR_PREFIX}_ENV")
echo "LUI_ENV set to $LUI_ENV"

CODE_REPO_DIR="/$SERVICE_NAME"
echo "Changing directory to $CODE_REPO_DIR"
cd "$CODE_REPO_DIR" || exit 0

# Set the project ID and service account based on the environment
PROJECT_ID="eng-ai-$LUI_ENV"
CLOUDSDK_CORE_ACCOUNT="$SERVICE_NAME-sa@$PROJECT_ID.iam.gserviceaccount.com"
echo "PROJECT_ID set to $PROJECT_ID"
echo "CLOUDSDK_CORE_ACCOUNT set to $CLOUDSDK_CORE_ACCOUNT"

echo "Fetching secrets and configuration from Secret Manager"
SECRET_NAME="$SERVICE_NAME-config"
SECRET_PAYLOAD=$(gcloud secrets versions access latest --secret=$SECRET_NAME --project=$PROJECT_ID)
eval "$SECRET_PAYLOAD"

echo "Pulling the latest docker image"
docker pull $ARTIFACT_REPO_URL/$SERVICE_NAME:latest
echo "Starting services with docker-compose"
docker compose up --no-deps -d $COMPOSE_OPTS

echo "Services started successfully"

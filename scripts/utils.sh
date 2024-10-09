#!/bin/bash

# This script contains common functions and variables that are used across multiple scripts

PROJECT_ID="neat-airport-407301"
ARTIFACT_REPO_URL="us-central1-docker.pkg.dev/neat-airport-407301/lum-docker-images"
WORK_ZONE="us-central1-a"
BUILD_VM="scheduler-zen"
SERVICE_NAME="lumino-dashboard"

# Exit on errors
set -e
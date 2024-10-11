#!/bin/bash

# This script is used to orchestrate the build process
# Run this script locally, before running deploy-to-mig.sh

# Prerequisites:
# - You need to be in `builders` and `docker` groups in the builder VM
# - You need your github private key in ~/.ssh/id_rsa in the builder VM
# Contact Vasilis if you need help with this

# Import common functions and variables
source ./scripts/utils.sh  # Sets $SERVICE_NAME

stty -echo  # Hide the user input, so the password is not displayed
gcloud compute ssh $BUILD_VM --project=$PROJECT_ID --zone=$WORK_ZONE \
      --command="SERVICE_NAME=$SERVICE_NAME /$SERVICE_NAME/scripts/release-deploy/_git-pull.sh"
stty echo  # Restore the user input
gcloud compute ssh $BUILD_VM --project=$PROJECT_ID --zone=$WORK_ZONE \
      --command="SERVICE_NAME=$SERVICE_NAME /$SERVICE_NAME/scripts/release-deploy/_make-docker-image.sh"
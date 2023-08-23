#!/bin/bash

# Set the repository URL
# REPO_URL="https://github.com/SkyOps117/skyops117.github.io"

# Navigate into the cloned repository
# cd "skyops117.github.io" 

# Initialize .git folder
#git init

# Add all modified files
git add .

# Commit the changes with a timestamp
#TIMESTAMP=$(date +"%Y-%m-%d_%H:%M:%S")
#COMMIT_MESSAGE="Auto-commit on $TIMESTAMP"
#git commit -m "$COMMIT_MESSAGE"
git commit -m "Auto-Commit"
# Push the changes to the remote repository
#git push origin main
git push

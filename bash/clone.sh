REPO_URL="https://github.com/SkyOps117/skyops117.github.io"

# Clone the repository if it doesn't exist locally
if [ ! -d "skyops117.github.io" ]; then
  git clone $REPO_URL "skyops117.github.io"
fi

# Navigate into the cloned repository
cd "skyops117.github.io"

# Pull the latest changes from the remote repository
git pull origin main

# Add all modified files
git add .

# Commit the changes with a timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
COMMIT_MESSAGE="Auto-commit on $TIMESTAMP"
git commit -m "$COMMIT_MESSAGE"

# Push the changes to the remote repository
git push origin main
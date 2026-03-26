#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB_DIR="$REPO_ROOT/web"
DOCKERFILE_PATH="$REPO_ROOT/scripts/Dockerfile"
IMAGE_TAG="memos:dev"
ARCHIVE_NAME="memos.tar.gz"
REMOTE_HOST="root@192.168.2.202"
REMOTE_DIR="/docker"

# Allow overriding defaults via env vars.
IMAGE_TAG="${IMAGE_TAG_OVERRIDE:-$IMAGE_TAG}"
REMOTE_HOST="${REMOTE_HOST_OVERRIDE:-$REMOTE_HOST}"
REMOTE_DIR="${REMOTE_DIR_OVERRIDE:-$REMOTE_DIR}"
ARCHIVE_NAME="${ARCHIVE_NAME_OVERRIDE:-$ARCHIVE_NAME}"

cleanup() {
  if [[ -f "$REPO_ROOT/$ARCHIVE_NAME" ]]; then
    rm -f "$REPO_ROOT/$ARCHIVE_NAME"
  fi
}

trap cleanup EXIT

echo "[1/8] Running frontend release build..."
cd "$WEB_DIR"
pnpm release

echo "[2/8] Building Docker image: $IMAGE_TAG"
cd "$REPO_ROOT"
docker build -t "$IMAGE_TAG" -f "$DOCKERFILE_PATH" .

echo "[3/8] Saving Docker image to archive: $ARCHIVE_NAME"
docker save "$IMAGE_TAG" | gzip > "$ARCHIVE_NAME"

echo "[4/8] Ensuring remote directory exists: $REMOTE_HOST:$REMOTE_DIR"
ssh "$REMOTE_HOST" "mkdir -p '$REMOTE_DIR'"

echo "[5/8] Uploading archive to remote host..."
scp "$ARCHIVE_NAME" "$REMOTE_HOST:$REMOTE_DIR/"

echo "[6/8] Loading image on remote host..."
ssh "$REMOTE_HOST" "docker load -i '$REMOTE_DIR/$ARCHIVE_NAME'"

echo "[7/8] Cleaning up local build changes..."
git checkout -- ./server/router/frontend/dist/index.html

echo "[8/8] Done. Local archive will be cleaned up automatically."

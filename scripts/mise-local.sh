#!/bin/sh
# Keep migration tools and mise state inside the workspace.
set -eu
blog_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
export MISE_DATA_DIR="$blog_dir/migration/mise/data"
export MISE_STATE_DIR="$blog_dir/migration/mise/state"
export MISE_CACHE_DIR="$blog_dir/migration/mise/cache"
export MISE_CONFIG_DIR="$blog_dir/migration/mise/config"
cd "$blog_dir"
exec mise "$@"

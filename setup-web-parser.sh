#!/usr/bin/env bash
# This script checks if the 'uv' command is available, and if so, it runs the main.py script in the web-parser project.
set -e 

if command -v uv >/dev/null 2>&1; then
    echo "Uv is installed..."
    uv --version
else
    echo "Uv is NOT installed"
    echo "You can install it with:"
    echo "curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi 
# Check if the project exists.  
if [ -d "web-parser" ]; then
    cd web-parser
    uv sync
    sleep 2 # Wait for a moment to ensure dependencies are installed
    uv run main.py 
else
    echo "web-parser project not found. Please make sure the web-parser folder exists."
    exit 1
fi



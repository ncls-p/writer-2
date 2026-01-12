#!/bin/bash

# Quick setup script for Writer Docker deployment

set -e

echo "🚀 Writer Docker Setup"
echo "====================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "deploy/docker-compose.dev.yml" ]; then
    echo "❌ Please run this script from the project root directory."
    exit 1
fi

# Ask which environment
echo "Which environment do you want to set up?"
echo "1) Development (with debug tools)"
echo "2) Production (optimized, secure)"
read -p "Choose [1-2]: " env_choice

if [ "$env_choice" = "1" ]; then
    COMPOSE_FILE="deploy/docker-compose.dev.yml"
    ENV_FILE="deploy/.env"
elif [ "$env_choice" = "2" ]; then
    COMPOSE_FILE="deploy/docker-compose.prod.yml"
    ENV_FILE="deploy/.env"
else
    echo "❌ Invalid choice."
    exit 1
fi

# Check if .env exists
if [ ! -f "$ENV_FILE" ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp deploy/.env.example "$ENV_FILE"
    echo "⚠️  Please edit $ENV_FILE and configure your environment variables."
    echo ""
    read -p "Press Enter to open $ENV_FILE in your editor..."

    # Try to open in default editor
    if [ -n "$EDITOR" ]; then
        $EDITOR "$ENV_FILE"
    elif command -v code &> /dev/null; then
        code "$ENV_FILE"
    elif command -v nano &> /dev/null; then
        nano "$ENV_FILE"
    else
        echo "Please edit $ENV_FILE manually and run this script again."
        exit 1
    fi
fi

# Start services
echo ""
echo "🏗️  Building and starting services..."
echo ""

# Pull images
echo "📦 Pulling latest images..."
docker compose -f "$COMPOSE_FILE" pull

# Build app image
echo "🔨 Building application image..."
docker compose -f "$COMPOSE_FILE" build

# Start services
echo "▶️  Starting services..."
docker compose -f "$COMPOSE_FILE" up -d

# Wait for services
echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Show status
echo ""
echo "📊 Service Status:"
docker compose -f "$COMPOSE_FILE" ps

echo ""
echo "✅ Setup complete!"
echo ""
echo "Access the application at: http://localhost:3000"
echo ""
echo "Useful commands:"
echo "  View logs:    docker compose -f $COMPOSE_FILE logs -f"
echo "  Stop services: docker compose -f $COMPOSE_FILE down"
echo "  Restart app:   docker compose -f $COMPOSE_FILE restart app"
echo ""

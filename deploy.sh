#!/bin/bash

# DietKem Docker Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    print_status "Creating .env file from template..."
    cp env.example .env
    print_warning "Please edit .env file with your configuration before continuing!"
    exit 1
fi

# Load environment variables
source .env

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running or not accessible!"
        exit 1
    fi
    print_status "Docker is running"
}

# Function to create SSL directory
setup_ssl() {
    if [ ! -d "ssl" ]; then
        print_status "Creating SSL directory..."
        mkdir -p ssl
        print_warning "Please add your SSL certificates to the ssl/ directory:"
        print_warning "  - ssl/cert.pem (SSL certificate)"
        print_warning "  - ssl/key.pem (SSL private key)"
        print_warning "Or use self-signed certificates for testing:"
        print_warning "  openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl/key.pem -out ssl/cert.pem"
    fi
}

# Function to build and start services
deploy() {
    print_status "Building and starting services..."
    
    # Build images
    print_status "Building Docker images..."
    docker-compose build
    
    # Start services
    print_status "Starting services..."
    docker-compose up -d
    
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Check service health
    print_status "Checking service health..."
    
    # Check API health
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        print_status "API is healthy"
    else
        print_warning "API health check failed"
    fi
    
    # Check web health
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        print_status "Web is healthy"
    else
        print_warning "Web health check failed"
    fi
    
    print_status "Deployment completed!"
    print_status "Services available at:"
    print_status "  - Web: http://localhost:3000"
    print_status "  - API: http://localhost:3001"
    print_status "  - Health: http://localhost:3001/health"
}

# Function to stop services
stop() {
    print_status "Stopping services..."
    docker-compose down
    print_status "Services stopped"
}

# Function to restart services
restart() {
    print_status "Restarting services..."
    docker-compose restart
    print_status "Services restarted"
}

# Function to view logs
logs() {
    print_status "Showing logs..."
    docker-compose logs -f
}

# Function to update services
update() {
    print_status "Updating services..."
    docker-compose pull
    docker-compose build --no-cache
    docker-compose up -d
    print_status "Services updated"
}

# Function to backup database
backup() {
    print_status "Creating database backup..."
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    docker-compose exec -T postgres pg_dump -U ${POSTGRES_USER:-dietkem_user} ${POSTGRES_DB:-dietkem} > "backups/$BACKUP_FILE"
    print_status "Backup created: backups/$BACKUP_FILE"
}

# Function to restore database
restore() {
    if [ -z "$1" ]; then
        print_error "Please specify backup file: $0 restore <backup_file>"
        exit 1
    fi
    
    print_status "Restoring database from $1..."
    docker-compose exec -T postgres psql -U ${POSTGRES_USER:-dietkem_user} ${POSTGRES_DB:-dietkem} < "backups/$1"
    print_status "Database restored"
}

# Function to show status
status() {
    print_status "Service status:"
    docker-compose ps
}

# Main script logic
case "$1" in
    "deploy")
        check_docker
        setup_ssl
        deploy
        ;;
    "stop")
        stop
        ;;
    "restart")
        restart
        ;;
    "logs")
        logs
        ;;
    "update")
        update
        ;;
    "backup")
        mkdir -p backups
        backup
        ;;
    "restore")
        restore $2
        ;;
    "status")
        status
        ;;
    "help"|"--help"|"-h"|"")
        echo "DietKem Docker Deployment Script"
        echo ""
        echo "Usage: $0 <command>"
        echo ""
        echo "Commands:"
        echo "  deploy    - Build and start all services"
        echo "  stop      - Stop all services"
        echo "  restart   - Restart all services"
        echo "  logs      - Show service logs"
        echo "  update    - Update and rebuild services"
        echo "  backup    - Create database backup"
        echo "  restore   - Restore database from backup"
        echo "  status    - Show service status"
        echo "  help      - Show this help message"
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac 
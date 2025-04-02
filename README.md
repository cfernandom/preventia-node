# Preventia Backend Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Preventia backend using Docker and Docker Compose.

## Prerequisites
Ensure that you have the following installed on your system:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Deployment Steps

### 1. Clone the Repository
```sh
git clone https://github.com/cfernandom/preventia-node
cd preventia-node
```

### 2. Build and Start the Container
Run the following command to build and start the backend service:
```sh
docker-compose up -d --build
```
- The `-d` flag runs the container in detached mode.
- The `--build` flag ensures the container is rebuilt if there are changes.

### 3. Verify Running Containers
Check if the container is running with:
```sh
docker ps
```
You should see `preventia-backend` listed as an active container.

### 4. Access the Backend API
The backend will be available at:
```
http://localhost:3000
```

### 5. Stopping the Container
To stop the backend service, run:
```sh
docker-compose down
```
This will stop and remove the container.

### 6. Restarting the Container
To restart the backend after stopping it, use:
```sh
docker-compose up -d
```

## Configuration
Ensure that you have an `.env` file in the project root with the necessary environment variables.

## Logs & Debugging
To check logs, run:
```sh
docker logs -f preventia-backend
```

## Notes
- The service is configured to restart automatically unless manually stopped (`restart: unless-stopped`).
- Ensure port `3000` is not in use before starting the container.

## License
This project is licensed under [Your License Name].


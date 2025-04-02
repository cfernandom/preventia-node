# Preventia Backend Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Preventia backend using Docker and Docker Compose, supporting both development and production environments via Docker Compose profiles.

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

### 2. Setup Environment Variables
Ensure that you have an `.env` file in the project root with the necessary environment variables. Example:
```sh
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

### 3. Running in Development Mode
Use the `dev` profile to run the backend with hot reloading and mounted volumes:
```sh
docker-compose --profile dev up -d --build
```
- This starts the backend in development mode with Prisma and automatic reloads.
- The code changes are reflected without needing to restart the container.

### 4. Running in Production Mode
Use the `prod` profile to run the backend with an optimized Docker image:
```sh
docker-compose --profile prod up -d --build
```
- This builds the backend for production.
- No source code mounting, ensuring a stable environment.

### 5. Verify Running Containers
Check if the containers are running with:
```sh
docker ps
```
You should see `preventia-backend` or `preventia-backend-dev` listed as an active container depending on the profile used.

### 6. Access the Backend API
The backend will be available at:
```
http://localhost:3000
```

### 7. Stopping the Containers
To stop all running services, use:
```sh
docker-compose down
```
This stops and removes all containers.

### 8. Restarting the Containers
To restart the backend after stopping it, use:
```sh
docker-compose --profile dev up -d  # For development
```
```sh
docker-compose --profile prod up -d  # For production
```

## Logs & Debugging
To check logs for the backend container, run:
```sh
docker logs -f preventia-backend  # For production
```
```sh
docker logs -f preventia-backend-dev  # For development
```

## Notes
- The service is configured to restart automatically unless manually stopped (`restart: unless-stopped`).
- Ensure port `3000` is not in use before starting the container.
- If using Prisma, ensure that `npx prisma generate` is executed inside the container before running the application.

## License
This project is licensed under [Your License Name].


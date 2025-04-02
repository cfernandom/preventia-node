#!/bin/sh
set -e

# Espera a que la base de datos esté lista
echo "Waiting for database..."
until nc -z -v -w30 db 5432
do
  echo "Waiting for Postgres database connection..."
  sleep 1
done
echo "Database is ready!"

# Ejecuta las migraciones de Prisma
echo "Running Prisma migrations..."
npx prisma migrate deploy --schema=/app/prisma/schema.prisma

# Genera el cliente de Prisma
echo "Generating Prisma Client..."
npx prisma generate --schema=/app/prisma/schema.prisma

# Inicia la aplicación
exec "$@"
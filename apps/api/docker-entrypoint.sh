#!/bin/bash

if [ ! -f vendor/autoload.php ]; then
    echo "vendor/ not found. Running composer install..."
    composer install --no-interaction --prefer-dist --no-progress
fi

for i in $(seq 1 30); do
    if php artisan migrate --force 2>/dev/null; then
        echo "Migrations completed."
        break
    fi
    echo "Waiting for database... ($i/30)"
    sleep 2
done

exec "$@"

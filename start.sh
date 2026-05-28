#!/bin/bash

echo "INFO - Iniciando ambiente do Microserviço Kine..."

docker compose up -d

echo "INFO - Aguardando banco de dados..."
sleep 5

docker compose exec api php artisan migrate --force

echo "SUCCESS - Ambiente pronto!"

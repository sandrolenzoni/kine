<?php

namespace App\Domain\Log;

interface LogRepository
{
    public function create(Log $log): Log;

    public function listAll(): array;

    public function listByTaskId(int $taskId): array;

    public function getById(int $id): ?Log;
}

<?php

namespace App\Domain\Task;

interface TaskRepository
{
    public function create(Task $task): Task;

    public function update(Task $task): bool;

    /**
     * @return array<Task>
     */
    public function listAll(): array;

    public function getById(int $id): ?Task;

}

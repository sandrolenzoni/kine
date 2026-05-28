<?php

namespace App\Domain\Task;

class Task
{
    public function __construct(
        public ?int $id,
        public int $task_code,
        public ?string $name = null,
        public array $payload = [],
        public TaskPriority $priority = TaskPriority::DEFAULT,
        public TaskType $type = TaskType::EMAIL,
        public TaskStatus $status = TaskStatus::PENDING,
        public ?float $average_time = null,
        public ?float $size_kb = null,
        public ?string $created_at = null,
        public ?string $updated_at = null,
        public ?string $deleted_at = null
    ) {}
}

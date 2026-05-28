<?php

namespace App\Domain\Log;

use App\Domain\Task\TaskStatus;
use JsonSerializable;

class Log implements JsonSerializable
{
    public function __construct(
        public ?int $id,
        public readonly int $taskId,
        public readonly TaskStatus $fromStatus,
        public readonly TaskStatus $toStatus,
        public array $details = [],
        public ?string $created_at = null,
        public ?string $updated_at = null,
        public ?string $deleted_at = null,
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'task_id' => $this->taskId,
            'from_status' => $this->fromStatus->value,
            'to_status' => $this->toStatus->value,
            'details' => $this->details,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}

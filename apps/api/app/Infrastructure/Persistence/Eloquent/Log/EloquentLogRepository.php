<?php

namespace App\Infrastructure\Persistence\Eloquent\Log;

use App\Domain\Log\Log;
use App\Domain\Log\LogRepository;
use App\Domain\Task\TaskStatus;

class EloquentLogRepository implements LogRepository
{
    public function create(Log $log): Log
    {
        $model = LogModel::create([
            'task_id' => $log->taskId,
            'from_status' => $log->fromStatus->value,
            'to_status' => $log->toStatus->value,
            'details' => $log->details,
        ]);

        return $this->mapToDomain($model);
    }

    public function listByTaskId(int $taskId): array
    {
        return LogModel::where('task_id', $taskId)
            ->get()
            ->map(fn($model) => $this->mapToDomain($model))
            ->toArray();
    }

    public function getById(int $id): ?Log
    {
        $model = LogModel::find($id);

        return $model ? $this->mapToDomain($model) : null;
    }

    public function listAll(): array
    {
        return LogModel::orderBy('created_at', 'desc')
            ->get()
            ->map(fn($model) => $this->mapToDomain($model))
            ->toArray();
    }

    private function mapToDomain(LogModel $model): Log
    {
        $details = $model->details;
        if (is_string($details)) {
            $decoded = json_decode($details, true);
            $details = is_array($decoded) ? $decoded : [];
        }

        return new Log(
            id: $model->id,
            taskId: $model->task_id,
            fromStatus: $model->from_status,
            toStatus: $model->to_status,
            details: $details ?? [],
            created_at: $model->created_at?->format('Y-m-d\TH:i:s\Z'),
            updated_at: $model->updated_at?->format('Y-m-d\TH:i:s\Z'),
            deleted_at: $model->deleted_at?->format('Y-m-d\TH:i:s\Z'),
        );
    }
}

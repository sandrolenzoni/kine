<?php

namespace App\Infrastructure\Persistence\Eloquent\Task;

use App\Domain\Task\Task;
use App\Domain\Task\TaskRepository;
use App\Infrastructure\Persistence\Eloquent\Task\TaskModel;
use Illuminate\Support\Facades\Redis;

class EloquentTaskRepository implements TaskRepository
{
    public function getById(int $id): ?Task
    {
        $model = TaskModel::find($id);

        if (!$model) {
            return null;
        }

        return $this->mapToDomain($model);
    }

    public function create(Task $task): Task
    {
        $model = TaskModel::create([
            'task_code' => $task->task_code,
            'name' => $task->name,
            'type' => $task->type->value,
            'priority' => $task->priority->value,
            'status' => $task->status->value,
            'payload' => $task->payload,
            'average_time' => $task->average_time,
            'size_kb' => $task->size_kb,
        ]);

        try {
            Redis::hset(
                'tasks:status',
                $model->id,
                json_encode([
                    'status' => 'pending',
                    'start' => microtime(true),
                    'priority' => $task->priority->value,
                ]),
            );
        } catch (\Throwable $e) {
        }

        return $this->mapToDomain($model);
    }

    public function update(Task $task): bool
    {
        $model = TaskModel::find($task->id);

        if (!$model) {
            return false;
        }

        return $model->update([
            'name' => $task->name,
            'type' => $task->type->value,
            'priority' => $task->priority->value,
            'status' => $task->status->value,
            'payload' => $task->payload,
            'average_time' => $task->average_time,
            'size_kb' => $task->size_kb,
        ]);
    }

    /**
     * @return Task[]
     */
    public function listAll(): array
    {
        return TaskModel::orderBy('created_at', 'desc')
            ->get()
            ->map(fn(TaskModel $model) => $this->mapToDomain($model))
            ->toArray();
    }

    private function mapToDomain(TaskModel $model): Task
    {
        return new Task(
            id: $model->id,
            task_code: $model->task_code,
            name: $model->name,
            type: $model->type,
            priority: $model->priority,
            payload: $model->payload,
            status: $model->status,
            average_time: $model->average_time,
            size_kb: $model->size_kb,
            created_at: $model->created_at?->format('Y-m-d\TH:i:s\Z'),
            updated_at: $model->updated_at?->format('Y-m-d\TH:i:s\Z'),
            deleted_at: $model->deleted_at?->format('Y-m-d\TH:i:s\Z'),
        );
    }
}

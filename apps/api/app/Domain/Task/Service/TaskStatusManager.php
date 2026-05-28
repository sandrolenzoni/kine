<?php

namespace App\Domain\Task\Service;

use App\Domain\Log\Log;
use App\Domain\Log\LogRepository;
use App\Domain\Task\Task;
use App\Domain\Task\TaskRepository;
use App\Domain\Task\TaskStatus;
use App\Events\TaskStatusChanged;
use Illuminate\Support\Facades\Redis;

class TaskStatusManager
{
    public function __construct(
        private TaskRepository $taskRepo,
        private LogRepository $logRepo,
    ) {}

    public function update(Task $task, TaskStatus $newStatus, array $details = []): void
    {
        $oldStatus = $task->status;

        $task->status = $newStatus;
        $this->taskRepo->update($task);

        $this->logRepo->create(
            new Log(null, $task->id, $oldStatus, $newStatus, $details),
        );

        $this->updateRedisStatus($task, $oldStatus, $newStatus);

        try {
            event(new TaskStatusChanged($task));
        } catch (\Throwable $e) {
        }
    }

    private function updateRedisStatus(Task $task, TaskStatus $oldStatus, TaskStatus $newStatus): void
    {
        try {
            $existing = Redis::hget('tasks:status', $task->id);
            $data = $existing ? json_decode($existing, true) : [];
            $data['status'] = $newStatus->value;

            Redis::hset(
                'tasks:status',
                $task->id,
                json_encode($data),
            );
            Redis::rpush(
                "tasks:log:{$task->id}",
                json_encode([
                    'from' => $oldStatus->value,
                    'to' => $newStatus->value,
                ]),
            );
        } catch (\Throwable $e) {
            // Redis unavailable — status updated in DB only
        }
    }
}

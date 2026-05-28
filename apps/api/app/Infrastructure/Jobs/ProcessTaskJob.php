<?php

namespace App\Infrastructure\Jobs;

use App\Domain\Log\Log;
use App\Domain\Log\LogRepository;
use App\Domain\Task\Service\TaskStatusManager;
use App\Domain\Task\Strategies\TaskStrategy;
use App\Domain\Task\Strategies\Types\EmailStrategy;
use App\Domain\Task\Strategies\Types\PushStrategy;
use App\Domain\Task\Strategies\Types\ReportStrategy;
use App\Domain\Task\TaskRepository;
use App\Domain\Task\TaskStatus;
use App\Domain\Task\TaskType;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class ProcessTaskJob implements ShouldQueue
{
    use Dispatchable, Queueable;

    public int $tries = 5;

    public array $backoff = [5, 10, 20, 40, 80];

    public function __construct(
        private int $taskId,
    ) {}

    public function handle(
        TaskRepository $taskRepo,
        TaskStatusManager $statusManager,
        LogRepository $logRepo,
    ): void {
        $task = $taskRepo->getById($this->taskId);

        if (! $task) {
            return;
        }

        $startTime = microtime(true);
        $statusManager->update($task, TaskStatus::PROCESSING);

        $payload = array_merge($task->payload, [
            '_taskId' => $task->id,
            '_taskCode' => $task->task_code,
        ]);

        try {
            $this->resolveStrategy($task->type)->execute($payload);

            $elapsed = round((microtime(true) - $startTime) * 1000, 2);
            $task->average_time = $elapsed;
            $taskRepo->update($task);

            $statusManager->update($task, TaskStatus::COMPLETED);
        } catch (\Throwable $e) {
            $elapsed = round((microtime(true) - $startTime) * 1000, 2);
            $task->average_time = $elapsed;
            $taskRepo->update($task);

            $statusManager->update($task, TaskStatus::FAILED, [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e;
        }
    }

    private function resolveStrategy(TaskType $type): TaskStrategy
    {
        return match ($type) {
            TaskType::EMAIL => app(EmailStrategy::class),
            TaskType::REPORT => app(ReportStrategy::class),
            TaskType::PUSH => app(PushStrategy::class),
        };
    }
}

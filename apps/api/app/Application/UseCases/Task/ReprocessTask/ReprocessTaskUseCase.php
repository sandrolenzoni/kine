<?php

namespace Application\UseCases\Task\ReprocessTask;

use App\Domain\Task\Task;
use App\Domain\Task\TaskRepository;
use App\Domain\Task\TaskStatus;
use App\Infrastructure\Jobs\ProcessTaskJob;

class ReprocessTaskUseCase
{
    public function __construct(
        private TaskRepository $repository,
    ) {}

    public function execute(int $taskId): ?Task
    {
        $task = $this->repository->getById($taskId);

        if (! $task) {
            return null;
        }

        if ($task->status !== TaskStatus::FAILED) {
            return null;
        }

        $task->status = TaskStatus::PENDING;
        $task->average_time = null;
        $this->repository->update($task);

        $queue = $task->priority->value === 'high' ? 'high' : 'default';

        try {
            ProcessTaskJob::dispatch($task->id)->onQueue($queue);
        } catch (\Throwable) {
        }

        return $task;
    }
}

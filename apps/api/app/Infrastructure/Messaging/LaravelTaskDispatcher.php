<?php

namespace App\Infrastructure\Messaging;

use Application\Interfaces\TaskDispatcherInterface;
use Application\UseCases\Task\CreateTask\CreateTaskJob;
use App\Domain\Task\Task;

class LaravelTaskDispatcher implements TaskDispatcherInterface
{
    public function dispatch(Task $task): void
    {
        $queue = $task->priority->value === 'high' ? 'high' : 'default';

        CreateTaskJob::dispatch(
            taskId: $task->id,
            queueName: $queue,
        )->onQueue($queue);
    }
}

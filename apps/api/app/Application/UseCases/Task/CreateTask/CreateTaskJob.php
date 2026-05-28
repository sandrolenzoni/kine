<?php

namespace Application\UseCases\Task\CreateTask;

use App\Infrastructure\Jobs\ProcessTaskJob;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class CreateTaskJob implements ShouldQueue
{
    use Dispatchable, Queueable;
    public function __construct(
        private int $taskId,
        private string $queueName = 'default',
    ) {
        $this->onQueue($queueName);
    }

    public function handle(): void
    {
        ProcessTaskJob::dispatch($this->taskId)->onQueue($this->queueName);
    }
}

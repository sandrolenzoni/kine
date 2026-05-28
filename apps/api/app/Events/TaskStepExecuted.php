<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskStepExecuted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $taskId,
        public string $strategy,
        public string $step,
        public array $details,
    ) {}

    public function broadcastOn(): array
    {
        return [new Channel('tasks.'.$this->taskId)];
    }

    public function broadcastAs(): string
    {
        return 'TaskStepExecuted';
    }
}

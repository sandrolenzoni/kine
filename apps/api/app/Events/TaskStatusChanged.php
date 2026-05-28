<?php

namespace App\Events;

use App\Domain\Task\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskStatusChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Task $task) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('tasks'),
            new Channel('tasks.'.$this->task->id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'TaskStatusChanged';
    }
}

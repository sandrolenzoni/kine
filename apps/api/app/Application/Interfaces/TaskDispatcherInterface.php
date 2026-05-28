<?php

namespace Application\Interfaces;

use App\Domain\Task\Task;

interface TaskDispatcherInterface
{
    public function dispatch(Task $task): void;
}

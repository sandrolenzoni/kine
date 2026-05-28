<?php

namespace App\Domain\Task;

enum TaskPriority: string
{
    case HIGH = 'high';
    case DEFAULT = 'default';
}

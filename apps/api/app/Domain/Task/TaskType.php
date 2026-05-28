<?php

namespace App\Domain\Task;

enum TaskType: string
{
    case EMAIL = 'email';
    case REPORT = 'report';
    case PUSH = 'push';
}

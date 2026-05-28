<?php

namespace App\Infrastructure\Persistence\Eloquent\Task;

use App\Domain\Task\TaskPriority;
use App\Domain\Task\TaskStatus;
use App\Domain\Task\TaskType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskModel extends Model
{
    use SoftDeletes;

    protected $table = 'tasks';

    protected $fillable = [
        'task_code',
        'name',
        'type',
        'priority',
        'status',
        'payload',
        'average_time',
        'size_kb',
    ];

    protected $casts = [
        'type' => TaskType::class,
        'priority' => TaskPriority::class,
        'status' => TaskStatus::class,
        'payload' => 'array',
        'average_time' => 'float',
        'size_kb' => 'float',
        'deleted_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}

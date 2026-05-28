<?php

namespace App\Infrastructure\Persistence\Eloquent\Log;

use App\Domain\Task\TaskStatus;
use Illuminate\Database\Eloquent\Model;

class LogModel extends Model
{

    protected $table = 'task_logs';

    protected $fillable = ['task_id', 'from_status', 'to_status', 'details'];

    /**
     * O Eloquent fará o cast automático entre string/enum no banco
     * e o objeto Enum no seu código PHP.
     */
    protected function casts(): array
    {
        return [
            'from_status' => TaskStatus::class,
            'to_status' => TaskStatus::class,
            'details' => 'array',
        ];
    }
}

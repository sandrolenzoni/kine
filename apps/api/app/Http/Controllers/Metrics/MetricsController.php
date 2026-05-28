<?php

namespace App\Http\Controllers\Metrics;

use App\Domain\Task\TaskStatus;
use App\Http\Controllers\Controller;
use App\Infrastructure\Persistence\Eloquent\Task\TaskModel;
use Illuminate\Http\JsonResponse;

class MetricsController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $total = TaskModel::count();
        $pending = TaskModel::where('status', TaskStatus::PENDING->value)->count();
        $processing = TaskModel::where('status', TaskStatus::PROCESSING->value)->count();
        $completed = TaskModel::where('status', TaskStatus::COMPLETED->value)->count();
        $failed = TaskModel::where('status', TaskStatus::FAILED->value)->count();

        $failureRate = $total > 0
            ? round(($failed / $total) * 100, 2)
            : 0;

        $averageTime = TaskModel::whereNotNull('average_time')
            ->avg('average_time');

        return response()->json([
            'total_tasks' => $total,
            'pending' => $pending,
            'processing' => $processing,
            'completed' => $completed,
            'failed' => $failed,
            'failure_rate' => $failureRate,
            'average_time' => $averageTime ? round($averageTime, 2) : null,
        ]);
    }
}

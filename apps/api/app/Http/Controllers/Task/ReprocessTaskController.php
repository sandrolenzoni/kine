<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use Application\UseCases\Task\ReprocessTask\ReprocessTaskUseCase;
use Illuminate\Http\JsonResponse;

class ReprocessTaskController extends Controller
{
    public function __construct(
        private ReprocessTaskUseCase $useCase,
    ) {}

    public function __invoke(int $id): JsonResponse
    {
        $task = $this->useCase->execute($id);

        if (! $task) {
            return response()->json(['error' => 'Task not found or not eligible for retry'], 400);
        }

        return response()->json($task, 200);
    }
}

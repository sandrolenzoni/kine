<?php

namespace App\Http\Controllers\Task;

use App\Domain\Log\LogRepository;
use App\Http\Controllers\Controller;
use Application\UseCases\Task\GetTask\GetTaskUseCase;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

#[OA\Get(
    path: '/api/tasks/{id}',
    summary: 'Retorna uma tarefa com sua timeline de logs',
    tags: ['Tasks'],
    parameters: [
        new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
    ],
    responses: [
        new OA\Response(response: 200, description: 'Tarefa encontrada'),
        new OA\Response(response: 404, description: 'Tarefa não encontrada'),
    ]
)]
class GetTaskController extends Controller
{
    public function __construct(
        private GetTaskUseCase $useCase,
        private LogRepository $logRepo,
    ) {}

    public function __invoke(int $id): JsonResponse
    {
        $task = $this->useCase->execute($id);

        if (! $task) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        $logs = $this->logRepo->listByTaskId($id);

        return response()->json([
            'task' => $task,
            'logs' => $logs,
        ], 200);
    }
}

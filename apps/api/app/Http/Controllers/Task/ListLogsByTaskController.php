<?php

namespace App\Http\Controllers\Task;

use App\Domain\Log\LogRepository;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

#[OA\Get(
    path: '/api/tasks/{taskId}/logs',
    summary: 'Retorna os logs de execução de uma tarefa',
    tags: ['Tasks'],
    parameters: [
        new OA\Parameter(name: 'taskId', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
    ],
    responses: [
        new OA\Response(response: 200, description: 'Logs encontrados'),
        new OA\Response(response: 404, description: 'Tarefa não encontrada'),
    ]
)]
class ListLogsByTaskController extends Controller
{
    public function __construct(private LogRepository $logRepo) {}

    public function __invoke(int $taskId): JsonResponse
    {
        $logs = $this->logRepo->listByTaskId($taskId);

        return response()->json(['logs' => $logs], 200);
    }
}

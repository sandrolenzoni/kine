<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use Application\UseCases\Task\ListAllTasks\ListAllTasksUseCase;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

#[OA\Get(
    path: '/api/tasks',
    summary: 'Lista todas as tarefas',
    tags: ['Tasks'],
    responses: [
        new OA\Response(response: 200, description: 'Lista de tasks retornada com sucesso'),
    ]
)]
class ListAllTaskController extends Controller
{
    public function __construct(private ListAllTasksUseCase $useCase) {}

    public function __invoke(): JsonResponse
    {
        $tasks = $this->useCase->execute();

        return response()->json($tasks, 200);
    }
}

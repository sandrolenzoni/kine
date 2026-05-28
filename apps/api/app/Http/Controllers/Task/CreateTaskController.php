<?php

namespace App\Http\Controllers\Task;

use App\Domain\Task\TaskPriority;
use App\Domain\Task\TaskType;
use App\Http\Controllers\Controller;
use Application\UseCases\Task\CreateTask\CreateTaskDTO;
use Application\UseCases\Task\CreateTask\CreateTaskUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;
use OpenApi\Attributes as OA;

#[OA\Post(
    path: '/api/tasks',
    summary: 'Criar uma nova tarefa',
    tags: ['Tasks'],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: '#/components/schemas/CreateTaskDTO')
    ),
    responses: [
        new OA\Response(response: 201, description: 'Tarefa criada com sucesso'),
    ]
)]
class CreateTaskController extends Controller
{
    public function __construct(
        private CreateTaskUseCase $useCase,
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'type' => ['required', new Enum(TaskType::class)],
            'priority' => ['required', new Enum(TaskPriority::class)],
            'payload' => ['required'],
        ]);

        $payload = $validated['payload'];
        if (is_string($payload)) {
            $decoded = json_decode($payload, true);
            $payload = is_array($decoded) ? $decoded : ['value' => $payload];
        }

        $dto = new CreateTaskDTO(
            name: $validated['name'],
            type: TaskType::from($validated['type']),
            priority: TaskPriority::from($validated['priority']),
            payload: $payload,
        );

        $task = $this->useCase->execute($dto);

        return response()->json($task, 201);
    }
}

<?php

namespace Application\UseCases\Task\CreateTask;

use App\Domain\Task\TaskPriority;
use App\Domain\Task\TaskType;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'CreateTaskDTO',
    title: 'CreateTaskDTO',
    description: 'DTO para criação de uma nova tarefa de sistema'
)]
readonly class CreateTaskDTO
{
    public function __construct(
        #[OA\Property(description: 'Nome da tarefa', maxLength: 100, example: 'Enviar e-mail de boas-vindas')]
        public string $name,

        #[OA\Property(description: "Tipo da tarefa: 'email' ou 'report'", example: 'email')]
        public TaskType $type,

        #[OA\Property(description: "Prioridade da tarefa: 'high' ou 'default'", example: 'high')]
        public TaskPriority $priority,

        #[OA\Property(
            description: 'Dados necessários para a execução da tarefa',
            type: 'object',
            example: ['subject' => 'Bem vindo', 'body' => 'Olá...', 'recipients' => ['user@test.com']]
        )]
        public array $payload,
    ) {}
}

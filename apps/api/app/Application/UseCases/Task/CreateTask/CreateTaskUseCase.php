<?php

namespace Application\UseCases\Task\CreateTask;

use App\Domain\Task\Task;
use App\Domain\Task\TaskCodeGenerator;
use App\Domain\Task\TaskRepository;
use App\Domain\Task\TaskStatus;
use Application\Interfaces\TaskDispatcherInterface;
use Illuminate\Support\Facades\DB;

class CreateTaskUseCase
{
    public function __construct(
        private TaskCodeGenerator $codeGenerator,
        private TaskRepository $repository,
        private TaskDispatcherInterface $dispatcher,
    ) {}

    public function execute(CreateTaskDTO $dto): Task
    {
        $payloadSize = mb_strlen(json_encode($dto->payload), '8bit');
        $sizeKb = round(($payloadSize / 1024), 2);

        $task = new Task(
            id: null,
            task_code: $this->codeGenerator->generate(),
            name: $dto->name,
            payload: $dto->payload,
            priority: $dto->priority,
            type: $dto->type,
            status: TaskStatus::PENDING,
            size_kb: max(0.01, $sizeKb),
        );

        return DB::transaction(function () use ($task) {
            $persistedTask = $this->repository->create($task);

            try {
                $this->dispatcher->dispatch($persistedTask);
            } catch (\Throwable) {
            }

            return $persistedTask;
        });
    }
}

<?php

namespace Application\UseCases\Task\GetTask;

use App\Domain\Task\Task;
use App\Domain\Task\TaskRepository;

class GetTaskUseCase
{
    public function __construct(private TaskRepository $repository) {}

    public function execute(int $id): ?Task
    {
        return $this->repository->getById($id);
    }
}

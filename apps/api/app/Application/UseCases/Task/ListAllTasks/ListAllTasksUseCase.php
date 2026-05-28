<?php

namespace Application\UseCases\Task\ListAllTasks;

use App\Domain\Task\Task;
use App\Domain\Task\TaskRepository;

class ListAllTasksUseCase
{
    public function __construct(private TaskRepository $repository) {}

    /**
     * @return array<Task>
     */
    public function execute(): array
    {
        $tasks = $this->repository->listAll();

        return $tasks;
    }
}

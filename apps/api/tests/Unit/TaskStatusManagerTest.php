<?php

namespace Tests\Unit;

use App\Domain\Log\Log;
use App\Domain\Log\LogRepository;
use App\Domain\Task\Task;
use App\Domain\Task\TaskRepository;
use App\Domain\Task\TaskStatus;
use App\Domain\Task\Service\TaskStatusManager;
use PHPUnit\Framework\TestCase;

class TaskStatusManagerTest extends TestCase
{
    public function test_update_transitions_status_and_creates_log(): void
    {
        $task = new Task(
            id: 1,
            task_code: 12345,
            name: 'Test',
            status: TaskStatus::PENDING,
        );

        $taskRepo = $this->createMock(TaskRepository::class);
        $taskRepo->expects($this->once())
            ->method('update')
            ->with($this->callback(fn(Task $t) => $t->status === TaskStatus::PROCESSING));

        $logRepo = $this->createMock(LogRepository::class);
        $logRepo->expects($this->once())
            ->method('create')
            ->with($this->callback(fn(Log $log) =>
                $log->taskId === 1
                && $log->fromStatus === TaskStatus::PENDING
                && $log->toStatus === TaskStatus::PROCESSING
            ));

        $manager = new TaskStatusManager($taskRepo, $logRepo);
        $manager->update($task, TaskStatus::PROCESSING);
    }

    public function test_update_with_details_passes_them_to_log(): void
    {
        $task = new Task(
            id: 2,
            task_code: 67890,
            name: 'Failure Test',
            status: TaskStatus::PROCESSING,
        );

        $taskRepo = $this->createMock(TaskRepository::class);
        $taskRepo->method('update')->willReturn(true);

        $logRepo = $this->createMock(LogRepository::class);
        $logRepo->expects($this->once())
            ->method('create')
            ->with($this->callback(fn(Log $log) =>
                $log->details === ['error' => 'Something went wrong']
            ));

        $manager = new TaskStatusManager($taskRepo, $logRepo);
        $manager->update($task, TaskStatus::FAILED, ['error' => 'Something went wrong']);
    }
}

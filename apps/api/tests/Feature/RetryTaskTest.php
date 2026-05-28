<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Infrastructure\Persistence\Eloquent\Task\TaskModel;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RetryTaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_retry_failed_task_returns_200(): void
    {
        $task = TaskModel::create([
            'task_code' => 44444,
            'name' => 'Failed Task',
            'type' => 'email',
            'priority' => 'high',
            'status' => 'failed',
            'payload' => ['to' => 'fail@test.com'],
        ]);

        $response = $this->postJson("/api/tasks/{$task->id}/retry");

        $response->assertStatus(200);
        $response->assertJsonFragment(['status' => 'pending']);
    }

    public function test_retry_completed_task_returns_400(): void
    {
        $task = TaskModel::create([
            'task_code' => 55555,
            'name' => 'Completed Task',
            'type' => 'email',
            'priority' => 'default',
            'status' => 'completed',
            'payload' => ['to' => 'done@test.com'],
        ]);

        $response = $this->postJson("/api/tasks/{$task->id}/retry");
        $response->assertStatus(400);
    }
}

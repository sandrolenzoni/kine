<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Infrastructure\Persistence\Eloquent\Task\TaskModel;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GetTaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_task_with_logs(): void
    {
        $task = TaskModel::create([
            'task_code' => 33333,
            'name' => 'Detail Test',
            'type' => 'push',
            'priority' => 'default',
            'status' => 'completed',
            'payload' => ['message' => 'test'],
        ]);

        $response = $this->getJson("/api/tasks/{$task->id}");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'task' => ['id', 'task_code', 'name', 'status'],
            'logs',
        ]);
    }

    public function test_returns_404_for_nonexistent_task(): void
    {
        $response = $this->getJson('/api/tasks/99999');
        $response->assertStatus(404);
    }
}

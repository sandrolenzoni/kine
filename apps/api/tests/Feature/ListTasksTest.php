<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Infrastructure\Persistence\Eloquent\Task\TaskModel;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ListTasksTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_tasks(): void
    {
        TaskModel::create([
            'task_code' => 11111,
            'name' => 'Task 1',
            'type' => 'email',
            'priority' => 'high',
            'status' => 'completed',
            'payload' => ['to' => 'a@b.com'],
        ]);

        TaskModel::create([
            'task_code' => 22222,
            'name' => 'Task 2',
            'type' => 'report',
            'priority' => 'default',
            'status' => 'pending',
            'payload' => ['period' => 'month'],
        ]);

        $response = $this->getJson('/api/tasks');

        $response->assertStatus(200);
        $response->assertJsonCount(2);
    }
}

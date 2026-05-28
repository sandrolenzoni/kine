<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Infrastructure\Persistence\Eloquent\Task\TaskModel;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MetricsTest extends TestCase
{
    use RefreshDatabase;

    public function test_metrics_returns_expected_structure(): void
    {
        TaskModel::create([
            'task_code' => 10001,
            'name' => 'Completed',
            'type' => 'email',
            'priority' => 'high',
            'status' => 'completed',
            'payload' => [],
            'average_time' => 100.5,
        ]);

        TaskModel::create([
            'task_code' => 10002,
            'name' => 'Failed',
            'type' => 'email',
            'priority' => 'high',
            'status' => 'failed',
            'payload' => [],
        ]);

        TaskModel::create([
            'task_code' => 10003,
            'name' => 'Pending',
            'type' => 'email',
            'priority' => 'default',
            'status' => 'pending',
            'payload' => [],
        ]);

        $response = $this->getJson('/api/metrics');

        $response->assertStatus(200);
        $response->assertJson([
            'total_tasks' => 3,
            'pending' => 1,
            'completed' => 1,
            'failed' => 1,
            'processing' => 0,
        ]);
        $response->assertJsonStructure([
            'total_tasks',
            'pending',
            'processing',
            'completed',
            'failed',
            'failure_rate',
            'average_time',
        ]);
    }
}

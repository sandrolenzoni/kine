<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CreateTaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_a_task(): void
    {
        $response = $this->postJson('/api/tasks', [
            'name' => 'Test Task',
            'type' => 'email',
            'priority' => 'high',
            'payload' => ['to' => 'test@example.com', 'subject' => 'Hello'],
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'id',
            'task_code',
            'name',
            'status',
            'priority',
            'type',
            'payload',
        ]);
        $response->assertJsonFragment(['name' => 'Test Task']);
        $response->assertJsonFragment(['status' => 'pending']);
    }

    public function test_requires_valid_payload(): void
    {
        $response = $this->postJson('/api/tasks', [
            'name' => '',
            'type' => 'invalid',
            'priority' => 'invalid',
            'payload' => 'not-an-array',
        ]);

        $response->assertStatus(422);
    }
}

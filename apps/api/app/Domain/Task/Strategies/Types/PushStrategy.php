<?php

namespace App\Domain\Task\Strategies\Types;

use App\Domain\Log\LogRepository;
use App\Domain\Task\Strategies\SimulatesSteps;
use App\Domain\Task\Strategies\TaskStrategy;

class PushStrategy implements TaskStrategy
{
    use SimulatesSteps;

    public function __construct(
        private LogRepository $logRepo,
    ) {}

    public function execute(array $payload): void
    {
        $taskId = $payload['_taskId'];
        $deviceToken = $payload['device_token'] ?? 'unknown-device';
        $message = $payload['message'] ?? 'Você tem uma nova notificação.';

        $this->simulateSteps($taskId, 'push', [
            [
                'name' => 'validating_token',
                'min_delay' => 50,
                'max_delay' => 200,
                'fail_chance' => 3,
                'details' => ['device_token' => substr($deviceToken, 0, 16) . '...', 'platform' => rand(0, 1) ? 'ios' : 'android'],
            ],
            [
                'name' => 'connecting',
                'min_delay' => 100,
                'max_delay' => 800,
                'fail_chance' => 4,
                'details' => ['service' => rand(0, 1) ? 'APNs' : 'FCM', 'priority' => 'high'],
            ],
            [
                'name' => 'sending',
                'min_delay' => 200,
                'max_delay' => 1500,
                'fail_chance' => 6,
                'details' => ['device_token' => substr($deviceToken, 0, 16) . '...', 'message_length' => strlen($message)],
            ],
            [
                'name' => 'done',
                'min_delay' => 30,
                'max_delay' => 100,
                'fail_chance' => 0,
                'details' => ['notification_id' => bin2hex(random_bytes(16)), 'delivered' => true],
            ],
        ], $this->logRepo);
    }
}

<?php

namespace App\Domain\Task\Strategies\Types;

use App\Domain\Log\LogRepository;
use App\Domain\Task\Strategies\SimulatesSteps;
use App\Domain\Task\Strategies\TaskStrategy;

class EmailStrategy implements TaskStrategy
{
    use SimulatesSteps;

    public function __construct(
        private LogRepository $logRepo,
    ) {}

    public function execute(array $payload): void
    {
        $taskId = $payload['_taskId'];
        $to = $payload['to'] ?? 'unknown@example.com';
        $subject = $payload['subject'] ?? 'No subject';

        $this->simulateSteps($taskId, 'email', [
            [
                'name' => 'validating',
                'min_delay' => 100,
                'max_delay' => 400,
                'fail_chance' => 2,
                'details' => ['to' => $to, 'subject' => $subject],
            ],
            [
                'name' => 'connecting',
                'min_delay' => 200,
                'max_delay' => 1500,
                'fail_chance' => 5,
                'details' => ['host' => 'smtp.example.com', 'port' => 587],
            ],
            [
                'name' => 'sending',
                'min_delay' => 500,
                'max_delay' => 3000,
                'fail_chance' => 8,
                'details' => ['to' => $to, 'size_kb' => rand(5, 120)],
            ],
            [
                'name' => 'done',
                'min_delay' => 50,
                'max_delay' => 200,
                'fail_chance' => 0,
                'details' => ['to' => $to, 'message_id' => bin2hex(random_bytes(16))],
            ],
        ], $this->logRepo);
    }
}

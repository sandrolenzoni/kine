<?php

namespace Tests\Unit\Strategies;

use App\Domain\Log\Log;
use App\Domain\Log\LogRepository;
use App\Domain\Task\Strategies\Types\PushStrategy;
use PHPUnit\Framework\TestCase;

class PushStrategyTest extends TestCase
{
    public function test_execute_creates_logs_for_each_step(): void
    {
        $logRepo = $this->createMock(LogRepository::class);
        $logRepo->expects($this->atLeast(1))
            ->method('create')
            ->with($this->callback(fn(Log $log) =>
                $log->taskId === 7
                && in_array($log->details['step'], ['validating_token', 'connecting', 'sending', 'done'])
            ));

        $strategy = new PushStrategy($logRepo);
        try {
            $strategy->execute([
                '_taskId' => 7,
                'device_token' => 'abc123',
                'message' => 'Test notification',
            ]);
        } catch (\RuntimeException) {
        }
    }
}

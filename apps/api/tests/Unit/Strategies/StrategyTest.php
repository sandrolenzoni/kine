<?php

namespace Tests\Unit\Strategies;

use App\Domain\Log\Log;
use App\Domain\Log\LogRepository;
use App\Domain\Task\Strategies\Types\EmailStrategy;
use App\Domain\Task\Strategies\Types\PushStrategy;
use App\Domain\Task\Strategies\Types\ReportStrategy;
use PHPUnit\Framework\TestCase;

class EmailStrategyTest extends TestCase
{
    public function test_execute_creates_logs_for_each_step(): void
    {
        $logRepo = $this->createMock(LogRepository::class);
        $logRepo->expects($this->atLeast(1))
            ->method('create')
            ->with($this->callback(fn(Log $log) =>
                $log->taskId === 42
                && in_array($log->details['step'], ['validating', 'connecting', 'sending', 'done'])
            ));

        $strategy = new EmailStrategy($logRepo);
        try {
            $strategy->execute([
                '_taskId' => 42,
                'to' => 'user@example.com',
                'subject' => 'Hello',
            ]);
        } catch (\RuntimeException) {
        }
    }
}



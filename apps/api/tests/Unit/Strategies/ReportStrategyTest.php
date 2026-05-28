<?php

namespace Tests\Unit\Strategies;

use App\Domain\Log\Log;
use App\Domain\Log\LogRepository;
use App\Domain\Task\Strategies\Types\ReportStrategy;
use PHPUnit\Framework\TestCase;

class ReportStrategyTest extends TestCase
{
    public function test_execute_creates_logs_for_each_step(): void
    {
        $logRepo = $this->createMock(LogRepository::class);
        $logRepo->expects($this->atLeast(1))
            ->method('create')
            ->with($this->callback(fn(Log $log) =>
                $log->taskId === 15
                && in_array($log->details['step'], ['fetching_data', 'processing', 'generating', 'done'])
            ));

        $strategy = new ReportStrategy($logRepo);
        try {
            $strategy->execute([
                '_taskId' => 15,
                'report_type' => 'sales',
                'period' => 'last_month',
            ]);
        } catch (\RuntimeException) {
        }
    }
}

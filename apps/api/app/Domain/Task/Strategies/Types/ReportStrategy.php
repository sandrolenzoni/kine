<?php

namespace App\Domain\Task\Strategies\Types;

use App\Domain\Log\LogRepository;
use App\Domain\Task\Strategies\SimulatesSteps;
use App\Domain\Task\Strategies\TaskStrategy;

class ReportStrategy implements TaskStrategy
{
    use SimulatesSteps;

    public function __construct(
        private LogRepository $logRepo,
    ) {}

    public function execute(array $payload): void
    {
        $taskId = $payload['_taskId'];
        $reportType = $payload['report_type'] ?? 'general';
        $period = $payload['period'] ?? 'last_month';

        $this->simulateSteps($taskId, 'report', [
            [
                'name' => 'fetching_data',
                'min_delay' => 500,
                'max_delay' => 3000,
                'fail_chance' => 5,
                'details' => ['report_type' => $reportType, 'period' => $period, 'rows' => rand(100, 50000)],
            ],
            [
                'name' => 'processing',
                'min_delay' => 800,
                'max_delay' => 4000,
                'fail_chance' => 8,
                'details' => ['aggregations' => 'sum,avg,count', 'groups' => rand(3, 20)],
            ],
            [
                'name' => 'generating',
                'min_delay' => 1000,
                'max_delay' => 5000,
                'fail_chance' => 10,
                'details' => ['format' => 'pdf', 'pages' => rand(5, 60), 'size_kb' => rand(50, 2000)],
            ],
            [
                'name' => 'done',
                'min_delay' => 100,
                'max_delay' => 300,
                'fail_chance' => 0,
                'details' => ['report_id' => bin2hex(random_bytes(8)), 'storage_path' => "/reports/{$reportType}/2026/05/"],
            ],
        ], $this->logRepo);
    }
}

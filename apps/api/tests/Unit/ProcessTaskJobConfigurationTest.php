<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class ProcessTaskJobConfigurationTest extends TestCase
{
    public function test_job_has_exponential_backoff(): void
    {
        $job = new \App\Infrastructure\Jobs\ProcessTaskJob(1);

        $this->assertEquals(5, $job->tries, 'ProcessTaskJob deve tentar 5 vezes');
        $this->assertCount(5, $job->backoff, 'Deve ter 5 valores de backoff');
        $this->assertEquals([5, 10, 20, 40, 80], $job->backoff, 'Backoff deve ser exponencial: 5, 10, 20, 40, 80');
    }
}

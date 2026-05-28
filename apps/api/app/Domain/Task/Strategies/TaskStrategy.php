<?php

namespace App\Domain\Task\Strategies;

interface TaskStrategy
{
    public function execute(array $payload): void;
}

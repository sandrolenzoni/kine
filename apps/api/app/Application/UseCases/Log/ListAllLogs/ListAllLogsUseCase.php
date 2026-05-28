<?php

namespace Application\UseCases\Log\ListAllLogs;

use App\Domain\Log\LogRepository;
use App\Domain\Log\Log;

class ListAllLogsUseCase
{
    public function __construct(
        private LogRepository $repository
    ) {
    }

    /**
     * @return array<Log>
     */

    public function execute(): array
    {
        $logs = $this->repository->listAll();
        return $logs;
    }
}
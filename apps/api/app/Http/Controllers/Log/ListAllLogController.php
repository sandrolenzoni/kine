<?php

namespace App\Http\Controllers\Log;

use App\Http\Controllers\Controller;
use Application\UseCases\Log\ListAllLogs\ListAllLogsUseCase;
use Illuminate\Http\JsonResponse;

class ListAllLogController extends Controller
{
    public function __construct(
        private ListAllLogsUseCase $useCase
    ) {
    }

    public function __invoke(): JsonResponse
    {
        $logs = $this->useCase->execute();

        return response()->json($logs, 200);
    }
}
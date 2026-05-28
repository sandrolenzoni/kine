<?php

use App\Http\Controllers\Metrics\MetricsController;

Route::prefix('tasks')->group(base_path('routes/api/tasks.php'));
Route::prefix('logs')->group(base_path('routes/api/logs.php'));
Route::get('/metrics', MetricsController::class);
Broadcast::routes();

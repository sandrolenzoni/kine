<?php

use App\Http\Controllers\Task\CreateTaskController;
use App\Http\Controllers\Task\GetTaskController;
use App\Http\Controllers\Task\ListAllTaskController;
use App\Http\Controllers\Task\ListLogsByTaskController;
use App\Http\Controllers\Task\ReprocessTaskController;
use Illuminate\Support\Facades\Route;

Route::get('/', ListAllTaskController::class);
Route::post('/', CreateTaskController::class);
Route::get('/{id}', GetTaskController::class);
Route::get('/{taskId}/logs', ListLogsByTaskController::class);
Route::post('/{id}/retry', ReprocessTaskController::class);

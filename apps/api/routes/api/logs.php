<?php

use App\Http\Controllers\Log\ListAllLogController;
use Illuminate\Support\Facades\Route;

Route::get('/', ListAllLogController::class);
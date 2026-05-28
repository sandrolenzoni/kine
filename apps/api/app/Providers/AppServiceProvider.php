<?php

namespace App\Providers;

use App\Domain\Log\LogRepository;
use App\Domain\Task\TaskRepository;
use App\Infrastructure\Messaging\LaravelTaskDispatcher;
use App\Infrastructure\Persistence\Eloquent\Log\EloquentLogRepository;
use App\Infrastructure\Persistence\Eloquent\Task\EloquentTaskRepository;
use Application\Interfaces\TaskDispatcherInterface;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(TaskRepository::class, EloquentTaskRepository::class);
        $this->app->bind(LogRepository::class, EloquentLogRepository::class);
        $this->app->bind(TaskDispatcherInterface::class, LaravelTaskDispatcher::class);
    }
}

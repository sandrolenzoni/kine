<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_logs', function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId('task_id')
                ->constrained('tasks')
                ->onDelete('cascade');
            $table
                ->enum('from_status', [
                    'pending',
                    'processing',
                    'completed',
                    'failed',
                ])
                ->default('pending');
            $table
                ->enum('to_status', [
                    'pending',
                    'processing',
                    'completed',
                    'failed',
                ])
                ->default('processing');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();

            $table->index('task_id');
            $table->index('from_status');
            $table->index('to_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_logs');
    }
};

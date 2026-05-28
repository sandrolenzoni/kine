<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->float('average_time', 8, 2)->nullable()->after('status');
            $table->float('size_kb', 8, 2)->nullable()->after('average_time');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn(['average_time', 'size_kb']);
        });
    }
};

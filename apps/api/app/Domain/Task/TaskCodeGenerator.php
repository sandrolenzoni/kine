<?php

namespace App\Domain\Task;

class TaskCodeGenerator
{
    public static function generate(): int
    {
        $time = time();
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $ipPart = (int) explode('.', $ip)[3];
        $pcCode = hexdec(substr(md5(gethostname()), 0, 4));

        return (int) ($time.$ipPart.($pcCode % 1000));
    }
}

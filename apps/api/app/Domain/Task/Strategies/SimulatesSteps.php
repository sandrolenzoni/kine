<?php

namespace App\Domain\Task\Strategies;

use App\Domain\Log\Log;
use App\Domain\Log\LogRepository;
use App\Domain\Task\TaskStatus;
use App\Events\TaskStepExecuted;
use Illuminate\Support\Facades\Redis;

trait SimulatesSteps
{
    private function simulateSteps(
        int $taskId,
        string $strategy,
        array $steps,
        LogRepository $logRepo,
    ): void {
        foreach ($steps as $step) {
            ['name' => $name, 'min_delay' => $minDelay, 'max_delay' => $maxDelay, 'fail_chance' => $failChance] = $step;

            $delay = rand($minDelay, $maxDelay);
            $details = array_merge($step['details'] ?? [], ['step' => $name]);

            try {
                broadcast(new TaskStepExecuted(
                    taskId: $taskId,
                    strategy: $strategy,
                    step: $name,
                    details: $details,
                ));
            } catch (\Throwable) {
            }

            $logRepo->create(new Log(
                id: null,
                taskId: $taskId,
                fromStatus: TaskStatus::PROCESSING,
                toStatus: TaskStatus::PROCESSING,
                details: $details,
            ));

            try {
                Redis::rpush("tasks:log:{$taskId}", json_encode(array_merge(
                    ['type' => 'strategy', 'strategy' => $strategy],
                    $details,
                )));
            } catch (\Throwable) {
            }

            if ($delay > 0) {
                usleep($delay * 1000);
            }

            if (mt_rand(1, 100) <= $failChance) {
                $errorMessages = [
                    'email' => [
                        'Falha na conexão SMTP: timeout após 30 segundos',
                        'Endereço de email inválido rejeitado pelo servidor',
                        'Limite de taxa excedido, tente novamente mais tarde',
                        'Servidor de email retornou erro 554: Transaction failed',
                        'Certificado SSL expirado para o servidor de saída',
                    ],
                    'report' => [
                        'Consulta SQL excedeu o limite de memória',
                        'Falha ao gerar PDF: fonte não encontrada',
                        'Base de dados retornou dados inconsistentes',
                        'Timeout na geração do relatório (limite de 60s)',
                        'Erro de permissão ao escrever arquivo temporário',
                    ],
                    'push' => [
                        'Token do dispositivo expirado ou revogado',
                        'Serviço APNs/FCM retornou erro de autenticação',
                        'Payload excede o tamanho máximo permitido (4KB)',
                        'Dispositivo destino não está mais registrado',
                        'Limite de requisições por segundo excedido',
                    ],
                ];

                $messages = $errorMessages[$strategy] ?? $errorMessages['email'];
                throw new \RuntimeException($messages[array_rand($messages)]);
            }
        }
    }
}

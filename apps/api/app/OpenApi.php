<?php

namespace App;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    title: 'Kine API Documentation',
    description: 'Documentação da API Kine'
)]
#[OA\Server(
    url: 'http://localhost:8000',
    description: 'API Server'
)]
class OpenApi {}

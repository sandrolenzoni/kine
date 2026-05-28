<?php

return [
    'default' => 'api',

    'documentations' => [
        'api' => [
            'api' => [
                'title' => 'Kine API Documentation',
            ],
            'routes' => [
                'api' => 'api/documentation',
            ],
            'paths' => [
                'use_absolute_path' => env('L5_SWAGGER_USE_ABSOLUTE_PATH', true),
                'docs_json' => 'api-docs.json',
                'docs_yaml' => 'api-docs.yaml',
                'format_to_use_for_docs' => env('L5_FORMAT_TO_USE_FOR_DOCS', 'json'),
                'annotations' => [base_path('app')],
                'excludes' => [],
                'base' => env('L5_SWAGGER_BASE_PATH', null),
                'docs' => storage_path('api-docs'),
            ],
            'scanOptions' => [
                'exclude' => [base_path('app/Providers')],
                'open_api_spec_version' => env('L5_SWAGGER_OPEN_API_SPEC_VERSION', '3.0.0'),
            ],
        ],
    ],

    'defaults' => [
        'routes' => [
            'docs' => 'docs',
            'oauth2_callback' => 'api/oauth2-callback',
            'middleware' => [
                'api' => [],
                'asset' => [],
                'docs' => [],
                'oauth2_callback' => [],
            ],
        ],
        'paths' => [
            'docs' => storage_path('api-docs'),
            'views' => base_path('resources/views/vendor/l5-swagger'),
            'base' => env('L5_SWAGGER_BASE_PATH', null),
            'excludes' => [],
        ],

        // Correção crítica: estrutura necessária para evitar o erro array_column
        'securityDefinitions' => [
            'securitySchemes' => [],
            'security' => [],
        ],

        'generate_always' => env('APP_DEBUG', false),
        'generate_yaml_copy' => false,
        'proxy' => false,
        'operations_sort' => env('L5_SWAGGER_OPERATIONS_SORT', null),
        'validator_url' => env('L5_SWAGGER_VALIDATOR_URL', null),
        'additional_config_url' => env('L5_SWAGGER_ADDITIONAL_CONFIG_URL', null),

        'ui' => [
            'display' => [
                'dark_mode' => env('L5_SWAGGER_UI_DARK_MODE', true),
                'doc_expansion' => 'list',
                'filter' => true,
            ],
            'authorization' => [
                'persist_authorization' => true,
                'oauth2' => ['use_pkce_with_authorization_code_grant' => false],
            ],
        ],
        'constants' => [
            'L5_SWAGGER_CONST_HOST' => env('APP_URL', 'http://localhost:8000'),
        ],
    ],
];

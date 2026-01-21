<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use OpenApi\Attributes as OA;

#[OA\Get(
    path: '/health',
    operationId: 'healthCheck',
    tags: ['Health'],
    summary: 'Health check',
    description: 'Check API health status including database and cache connections',
    responses: [
        new OA\Response(
            response: 200,
            description: 'Health status',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'status', type: 'string', enum: ['ok', 'degraded', 'error'], example: 'ok'),
                    new OA\Property(property: 'database', type: 'string', enum: ['connected', 'error'], example: 'connected'),
                    new OA\Property(property: 'cache', type: 'string', enum: ['connected', 'error'], example: 'connected'),
                    new OA\Property(property: 'timestamp', type: 'string', format: 'date-time'),
                    new OA\Property(property: 'version', type: 'string', example: '1.0.0'),
                ]
            )
        )
    ]
)]
class HealthController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $status = 'ok';
        $database = 'connected';
        $cache = 'connected';

        // Check database connection
        try {
            DB::connection()->getPdo();
        } catch (\Exception $e) {
            $database = 'error';
            $status = 'degraded';
        }

        // Check cache connection
        try {
            Cache::store()->get('health-check');
        } catch (\Exception $e) {
            $cache = 'error';
            $status = 'degraded';
        }

        return response()->json([
            'status' => $status,
            'database' => $database,
            'cache' => $cache,
            'timestamp' => now()->toIso8601String(),
            'version' => config('app.version', '1.0.0'),
        ]);
    }
}

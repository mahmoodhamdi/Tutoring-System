<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class RequestLogging
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);

        $response = $next($request);

        $duration = round((microtime(true) - $startTime) * 1000, 2);

        $this->logRequest($request, $response, $duration);

        return $response;
    }

    /**
     * Log the request details.
     */
    protected function logRequest(Request $request, Response $response, float $duration): void
    {
        $context = [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'path' => $request->path(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status' => $response->getStatusCode(),
            'duration_ms' => $duration,
        ];

        // Add user info if authenticated
        if ($request->user()) {
            $context['user_id'] = $request->user()->id;
            $context['user_role'] = $request->user()->role ?? 'unknown';
        }

        // Log level based on status code
        $level = $this->getLogLevel($response->getStatusCode());

        // Don't log health check endpoints
        if ($this->shouldSkip($request)) {
            return;
        }

        Log::channel('api')->log($level, 'API Request', $context);

        // Log slow requests separately
        if ($duration > 1000) {
            Log::channel('api')->warning('Slow API Request', [
                ...$context,
                'threshold_ms' => 1000,
            ]);
        }
    }

    /**
     * Get log level based on HTTP status code.
     */
    protected function getLogLevel(int $statusCode): string
    {
        if ($statusCode >= 500) {
            return 'error';
        }

        if ($statusCode >= 400) {
            return 'warning';
        }

        return 'info';
    }

    /**
     * Determine if the request should be skipped from logging.
     */
    protected function shouldSkip(Request $request): bool
    {
        $skipPaths = [
            'health',
            'api/documentation',
            'api/docs',
        ];

        foreach ($skipPaths as $path) {
            if ($request->is($path) || $request->is("api/{$path}")) {
                return true;
            }
        }

        return false;
    }
}

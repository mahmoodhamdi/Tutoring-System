<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class PerformanceMonitoring
{
    /**
     * Slow query threshold in milliseconds.
     */
    protected int $slowQueryThreshold = 100;

    /**
     * Maximum queries before warning.
     */
    protected int $maxQueriesThreshold = 50;

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Enable query logging in non-production environments
        if (config('app.env') !== 'production' || config('app.debug')) {
            DB::enableQueryLog();
        }

        $response = $next($request);

        $this->analyzeQueries($request);

        return $response;
    }

    /**
     * Analyze the queries executed during the request.
     */
    protected function analyzeQueries(Request $request): void
    {
        $queries = DB::getQueryLog();
        $totalQueries = count($queries);
        $slowQueries = [];
        $totalTime = 0;

        foreach ($queries as $query) {
            $totalTime += $query['time'];

            if ($query['time'] > $this->slowQueryThreshold) {
                $slowQueries[] = [
                    'sql' => $query['query'],
                    'time_ms' => $query['time'],
                    'bindings' => config('app.debug') ? $query['bindings'] : '[hidden]',
                ];
            }
        }

        // Log slow queries
        if (!empty($slowQueries)) {
            Log::channel('performance')->warning('Slow queries detected', [
                'path' => $request->path(),
                'method' => $request->method(),
                'slow_queries' => $slowQueries,
                'threshold_ms' => $this->slowQueryThreshold,
            ]);
        }

        // Log if too many queries (N+1 problem indicator)
        if ($totalQueries > $this->maxQueriesThreshold) {
            Log::channel('performance')->warning('High query count detected (possible N+1)', [
                'path' => $request->path(),
                'method' => $request->method(),
                'query_count' => $totalQueries,
                'total_time_ms' => $totalTime,
                'threshold' => $this->maxQueriesThreshold,
            ]);
        }

        // Clear the query log
        DB::flushQueryLog();
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Http\Request;

class ApiAuthenticate extends Authenticate
{
    /**
     * Handle an incoming request.
     */
    public function handle($request, Closure $next, ...$guards)
    {
        // For API requests, ensure we're authenticating against sanctum guard
        if (empty($guards)) {
            $guards = ['sanctum'];
        }

        // This will authenticate the request or throw AuthenticationException
        $this->authenticate($request, $guards);

        return $next($request);
    }

    /**
     * Get the path the user should be redirected to when they are not authenticated.
     * For API requests, we return null which causes an AuthenticationException to be thrown.
     */
    protected function redirectTo(Request $request): ?string
    {
        // For API/JSON requests, don't redirect - let the exception handler deal with it
        return null;
    }
}

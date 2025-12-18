<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Support\Facades\Log;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        // Don't exempt admin routes - Inertia.js handles CSRF automatically
        // 'admin/login',
        // 'admin/logout',
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     *
     * @throws \Illuminate\Session\TokenMismatchException
     */
    public function handle($request, \Closure $next)
    {
        try {
            return parent::handle($request, $next);
        } catch (TokenMismatchException $e) {
            // Log CSRF mismatch for debugging
            Log::warning('CSRF token mismatch', [
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'is_ajax' => $request->ajax(),
                'x_requested_with' => $request->header('X-Requested-With'),
                'x_csrf_token' => $request->header('X-CSRF-TOKEN') ? 'present' : 'missing',
                'x_xsrf_token' => $request->header('X-XSRF-TOKEN') ? 'present' : 'missing',
                'form_token' => $request->input('_token') ? 'present' : 'missing',
                'session_token' => session()->token() ? 'present' : 'missing',
                'session_id' => session()->getId(),
            ]);

            // For AJAX requests, return JSON response instead of 419 page
            if ($request->ajax() || $request->wantsJson() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
                return response()->json([
                    'success' => false,
                    'error' => 'CSRF token mismatch. Please refresh the page and try again.',
                    'csrf_error' => true,
                ], 419);
            }
            
            throw $e;
        }
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\AdminUser;

class AdminAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Check admin guard only - no fallback to web guard
        $user = Auth::guard('admin')->user();
        
        if (!$user || !in_array($user->role, [AdminUser::ROLE_ADMIN, AdminUser::ROLE_SUPER_ADMIN])) {
            return redirect('/admin/login');
        }
        
        return $next($request);
    }
}

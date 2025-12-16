<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\AdminUser;

/**
 * Middleware to restrict access to super_admin users only.
 * Used for sensitive operations like user management.
 * 
 * @see Requirements 9.1
 */
class SuperAdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::guard('admin')->user();
        
        if (!$user || $user->role !== AdminUser::ROLE_SUPER_ADMIN) {
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            
            return redirect('/admin/dashboard')
                ->with('error', 'Anda tidak memiliki akses ke halaman ini');
        }
        
        return $next($request);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function showLogin()
    {
        return inertia('Admin/Auth/Login');
    }

    public function login(Request $request)
    {
        // Debug logging
        Log::info('Admin login attempt', ['email' => $request->email]);

        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Debug: Check credentials
        Log::info('Login credentials check', $credentials);

        // Use admin guard with AdminUser model
        if (Auth::guard('admin')->attempt($credentials)) {
            $user = Auth::guard('admin')->user();
            Log::info('Auth successful', ['user' => $user->email, 'role' => $user->role]);

            // Check if user is active - block deactivated users
            if (!$user->is_active) {
                Log::warning('User not active', ['email' => $user->email]);
                Auth::guard('admin')->logout();
                return back()->withErrors([
                    'email' => 'Akun Anda telah dinonaktifkan. Hubungi administrator.',
                ]);
            }

            // Check if user has valid admin role
            if (in_array($user->role, [AdminUser::ROLE_ADMIN, AdminUser::ROLE_SUPER_ADMIN])) {
                $request->session()->regenerate();
                $user->update(['last_login_at' => now()]);
                \Log::info('Redirecting to dashboard');
                return redirect()->intended('/admin/dashboard');
            }

            \Log::warning('Invalid role', ['role' => $user->role]);
            Auth::guard('admin')->logout();
            return back()->withErrors([
                'email' => 'Anda tidak memiliki akses admin.',
            ]);
        }

        \Log::warning('Login failed', ['email' => $request->email]);
        return back()->withErrors([
            'email' => 'Email atau password salah.',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/admin/login');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function showLogin()
    {
        return inertia('Admin/Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Use admin guard with AdminUser model
        if (Auth::guard('admin')->attempt($credentials)) {
            $user = Auth::guard('admin')->user();
            
            // Check if user is active - block deactivated users
            if (!$user->is_active) {
                Auth::guard('admin')->logout();
                return back()->withErrors([
                    'email' => 'Akun Anda telah dinonaktifkan. Hubungi administrator.',
                ]);
            }
            
            // Check if user has valid admin role
            if (in_array($user->role, [AdminUser::ROLE_ADMIN, AdminUser::ROLE_SUPER_ADMIN])) {
                $request->session()->regenerate();
                $user->update(['last_login_at' => now()]);
                return redirect()->intended('/admin/dashboard');
            }
            
            Auth::guard('admin')->logout();
            return back()->withErrors([
                'email' => 'Anda tidak memiliki akses admin.',
            ]);
        }

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

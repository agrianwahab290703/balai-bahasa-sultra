# Admin CRUD System Implementation Plan

> **For Droid:** REQUIRED SUB-SKILL: Use `executing-plans` skill to implement this plan task-by-task.

**Goal:** Membangun sistem admin CRUD komprehensif untuk website Balai Bahasa Sulawesi Tenggara dengan kemampuan manajemen konten penuh dan modul dinamis.

**Architecture:** Laravel 12 backend dengan React frontend, menggunakan Spatie Laravel Permission untuk authorization, dan Rich Editor untuk konten management.

**Tech Stack:** Laravel, React, Inertia.js, Tailwind CSS, Spatie Laravel Permission, Intervention Image

---

### Task 1: Setup Admin Authentication System

**Files:**
- Create: `app/Http/Controllers/Admin/AuthController.php`
- Create: `app/Http/Middleware/AdminAuthMiddleware.php`
- Create: `database/migrations/add_admin_role_to_users_table.php`
- Create: `routes/web_admin.php`
- Create: `resources/js/Pages/Admin/Auth/Login.jsx`

#### Step 1: Write failing test

```php
// tests/Feature/AdminAuthTest.php
public function test_admin_login_page_loads()
{
    $response = $this->get('/admin/login');
    $response->assertStatus(200);
}

public function test_admin_can_login_with_valid_credentials()
{
    $admin = User::factory()->create(['role' => 'admin']);
    $response = $this->post('/admin/login', [
        'email' => $admin->email,
        'password' => 'password'
    ]);
    $response->assertRedirect('/admin/dashboard');
}
```

#### Step 2: Run test to verify it fails

Run: `php artisan test tests/Feature/AdminAuthTest.php`
Expected: FAIL - Route and controller don't exist

#### Step 3: Create migration for admin role

```php
// database/migrations/add_admin_role_to_users_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'super_admin', 'user'])->default('user');
            $table->timestamp('last_login_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'last_login_at']);
        });
    }
};
```

#### Step 4: Create AuthController

```php
// app/Http/Controllers/Admin/AuthController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
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

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            
            $user = Auth::user();
            if (in_array($user->role, ['admin', 'super_admin'])) {
                $user->update(['last_login_at' => now()]);
                return redirect()->intended('/admin/dashboard');
            }
            
            Auth::logout();
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
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/admin/login');
    }
}
```

#### Step 5: Create middleware

```php
// app/Http/Middleware/AdminAuthMiddleware.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check() || !in_array(Auth::user()->role, ['admin', 'super_admin'])) {
            return redirect('/admin/login');
        }
        return $next($request);
    }
}
```

#### Step 6: Register middleware

Add to `app/Http/Kernel.php` in $middlewareAliases:
```php
'admin.auth' => \App\Http\Middleware\AdminAuthMiddleware::class,
```

#### Step 7: Create admin routes

```php
// routes/web_admin.php
use App\Http\Controllers\Admin\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    
    Route::middleware(['admin.auth'])->group(function () {
        Route::get('/dashboard', function () {
            return inertia('Admin/Dashboard');
        })->name('dashboard');
    });
});
```

#### Step 8: Include admin routes in main routes

Add to `routes/web.php`:
```php
require __DIR__.'/web_admin.php';
```

#### Step 9: Create login component

```jsx
// resources/js/Pages/Admin/Auth/Login.jsx
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '@/Layouts/AdminLayout';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <Layout>
            <Head title="Admin Login" />
            
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Admin Login
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={submit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
```

#### Step 10: Create AdminLayout

```jsx
// resources/js/Layouts/AdminLayout.jsx
import React from 'react';
import { Head } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>Admin - Balai Bahasa Sultra</title>
            </Head>
            
            <div className="flex">
                {/* Sidebar will be added in next task */}
                <div className="flex-1 p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
```

#### Step 11: Run test to verify it passes

Run: `php artisan test tests/Feature/AdminAuthTest.php`
Expected: PASS

#### Step 12: Commit

```bash
git add database/migrations/add_admin_role_to_users_table.php
git add app/Http/Controllers/Admin/AuthController.php
git add app/Http/Middleware/AdminAuthMiddleware.php
git add routes/web_admin.php
git add resources/js/Pages/Admin/Auth/Login.jsx
git add resources/js/Layouts/AdminLayout.jsx
git add app/Http/Kernel.php
git add routes/web.php
git commit -m "feat: implement admin authentication system"
```

### Task 2: Create Admin Dashboard

**Files:**
- Create: `resources/js/Pages/Admin/Dashboard.jsx`
- Create: `app/Http/Controllers/Admin/DashboardController.php`
- Create: `app/Models/Statistic.php`
- Modify: `routes/web_admin.php`

#### Step 1: Write failing test

```php
// tests/Feature/AdminDashboardTest.php
public function test_admin_dashboard_loads()
{
    $admin = User::factory()->create(['role' => 'admin']);
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    $response->assertStatus(200);
}

public function test_dashboard_shows_statistics()
{
    $admin = User::factory()->create(['role' => 'admin']);
    $response = $this->actingAs($admin)->get('/admin/dashboard');
    $response->assertInertia(function ($page) {
        return $page->component('Admin/Dashboard') &&
               isset($page->props('statistics'));
    });
}
```

#### Step 2: Run test to verify it fails

Run: `php artisan test tests/Feature/AdminDashboardTest.php`
Expected: FAIL - DashboardController doesn't exist

#### Step 3: Create DashboardController

```php
// app/Http/Controllers/Admin/DashboardController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\Pengumuman;
use App\Models\Gallery;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $statistics = [
            'total_berita' => Berita::count(),
            'published_berita' => Berita::where('status', 'publish')->count(),
            'total_pengumuman' => Pengumuman::count(),
            'active_pengumuman' => Pengumuman::where('status', 'active')->count(),
            'total_foto' => Gallery::count(),
            'recent_activities' => $this->getRecentActivities(),
        ];

        return inertia('Admin/Dashboard', compact('statistics'));
    }

    private function getRecentActivities()
    {
        // Implementation will be added in Activity Log task
        return collect([]);
    }
}
```

#### Step 4: Create Dashboard component

```jsx
// resources/js/Pages/Admin/Dashboard.jsx
import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/AdminLayout';
import { Hugeicons } from 'hugeicons-react';

export default function Dashboard({ statistics }) {
    const statCards = [
        {
            title: 'Total Berita',
            value: statistics.total_berita,
            icon: <Hugeicons.NewsPaper01 className="w-8 h-8 text-blue-500" />,
            color: 'bg-blue-50',
        },
        {
            title: 'Pengumuman Aktif',
            value: statistics.active_pengumuman,
            icon: <Hugeicons.Notification02 className="w-8 h-8 text-green-500" />,
            color: 'bg-green-50',
        },
        {
            title: 'Total Foto',
            value: statistics.total_foto,
            icon: <Hugeicons.Image01 className="w-8 h-8 text-purple-500" />,
            color: 'bg-purple-50',
        },
    ];

    return (
        <Layout>
            <Head title="Dashboard Admin" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                    
                    {/* Statistics Cards */}
                    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {statCards.map((card, index) => (
                            <div key={index} className={`${card.color} overflow-hidden rounded-lg shadow`}>
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            {card.icon}
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    {card.title}
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {card.value}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8">
                        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                                <Hugeicons.PlusSign className="mr-2 -ml-1 h-5 w-5" />
                                Tambah Berita
                            </button>
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                                <Hugeicons.PlusSign className="mr-2 -ml-1 h-5 w-5" />
                                Tambah Pengumuman
                            </button>
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
                                <Hugeicons.Upload03 className="mr-2 -ml-1 h-5 w-5" />
                                Upload Foto
                            </button>
                            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                <Hugeicons.Settings01 className="mr-2 -ml-1 h-5 w-5" />
                                Pengaturan
                            </button>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="mt-8">
                        <h2 className="text-lg font-medium text-gray-900">Aktivitas Terbaru</h2>
                        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                            <ul className="divide-y divide-gray-200">
                                <li className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-900">Tidak ada aktivitas terbaru</p>
                                        <p className="text-sm text-gray-500">-</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
```

#### Step 5: Update admin routes

Modify `routes/web_admin.php`:
```php
use App\Http\Controllers\Admin\DashboardController;

// Replace the dashboard route:
Route::middleware(['admin.auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});
```

#### Step 6: Run test to verify it passes

Run: `php artisan test tests/Feature/AdminDashboardTest.php`
Expected: PASS

#### Step 7: Commit

```bash
git add app/Http/Controllers/Admin/DashboardController.php
git add resources/js/Pages/Admin/Dashboard.jsx
git add routes/web_admin.php
git add tests/Feature/AdminDashboardTest.php
git commit -m "feat: implement admin dashboard with statistics"
```

### Task 3: Create Pengumuman Model and Migration

**Files:**
- Create: `app/Models/Pengumuman.php`
- Create: `database/migrations/create_pengumuman_table.php`
- Create: `tests/Unit/PengumumanTest.php`

#### Step 1: Write failing test

```php
// tests/Unit/PengumumanTest.php
public function test_pengumuman_can_be_created()
{
    $pengumuman = Pengumuman::factory()->create();
    $this->assertDatabaseHas('pengumuman', [
        'id' => $pengumuman->id,
        'judul' => $pengumuman->judul,
    ]);
}

public function test_pengumuman_status_defaults_to_draft()
{
    $pengumuman = Pengumuman::factory()->create();
    $this->assertEquals('draft', $pengumuman->status);
}
```

#### Step 2: Run test to verify it fails

Run: `php artisan test tests/Unit/PengumumanTest.php`
Expected: FAIL - Model and table don't exist

#### Step 3: Create migration

```php
// database/migrations/create_pengumuman_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengumuman', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('slug')->unique();
            $table->longText('konten');
            $table->enum('tipe', ['umum', 'urgent', 'tanggal_spesifik'])->default('umum');
            $table->date('tanggal_berlaku')->nullable();
            $table->enum('status', ['draft', 'active', 'expired'])->default('draft');
            $table->integer('prioritas')->default(0);
            $table->text('meta_description')->nullable();
            $table->string('created_by');
            $table->string('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengumuman');
    }
};
```

#### Step 4: Create model

```php
// app/Models/Pengumuman.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pengumuman extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'judul',
        'slug',
        'konten',
        'tipe',
        'tanggal_berlaku',
        'status',
        'prioritas',
        'meta_description',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'tanggal_berlaku' => 'date',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function getIsActiveAttribute()
    {
        return $this->status === 'active' && 
               (!$this->tanggal_berlaku || $this->tanggal_berlaku >= now());
    }
}
```

#### Step 5: Create factory

```php
// database/factories/PengumumanFactory.php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PengumumanFactory extends Factory
{
    public function definition(): array
    {
        return [
            'judul' => fake()->sentence(),
            'slug' => fake()->slug(),
            'konten' => fake()->paragraphs(3),
            'tipe' => fake()->randomElement(['umum', 'urgent', 'tanggal_spesifik']),
            'tanggal_berlaku' => fake()->optional(0.7)->date(),
            'status' => 'draft',
            'prioritas' => fake()->numberBetween(0, 5),
            'meta_description' => fake()->sentence(),
            'created_by' => User::factory(),
        ];
    }
}
```

#### Step 6: Run test to verify it passes

Run: `php artisan test tests/Unit/PengumumanTest.php`
Expected: PASS

#### Step 7: Commit

```bash
git add database/migrations/create_pengumuman_table.php
git add app/Models/Pengumuman.php
git add database/factories/PengumumanFactory.php
git add tests/Unit/PengumumanTest.php
git commit -m "feat: create pengumuman model and migration"
```

### Task 4: Create Pengumuman CRUD Controller

**Files:**
- Create: `app/Http/Controllers/Admin/PengumumanController.php`
- Create: `tests/Feature/Admin/PengumumanTest.php`
- Modify: `routes/web_admin.php`

#### Step 1: Write failing test

```php
// tests/Feature/Admin/PengumumanTest.php
public function test_pengumuman_index_can_be_rendered()
{
    $admin = User::factory()->create(['role' => 'admin']);
    Pengumuman::factory()->count(5)->create();
    
    $response = $this->actingAs($admin)->get('/admin/pengumuman');
    $response->assertStatus(200);
}

public function test_can_create_pengumuman()
{
    $admin = User::factory()->create(['role' => 'admin']);
    $data = [
        'judul' => 'Test Pengumuman',
        'konten' => 'Ini adalah konten test',
        'tipe' => 'umum',
        'status' => 'active',
    ];
    
    $response = $this->actingAs($admin)->post('/admin/pengumuman', $data);
    $response->assertRedirect('/admin/pengumuman');
    $this->assertDatabaseHas('pengumuman', ['judul' => 'Test Pengumuman']);
}
```

#### Step 2: Run test to verify it fails

Run: `php artisan test tests/Feature/Admin/PengumumanTest.php`
Expected: FAIL - Routes and controller don't exist

#### Step 3: Create controller

```php
// app/Http/Controllers/Admin/PengumumanController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pengumuman;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class PengumumanController extends Controller
{
    public function index(Request $request)
    {
        $query = Pengumuman::query();
        
        if ($request->filled('search')) {
            $query->where('judul', 'like', '%' . $request->search . '%')
                  ->orWhere('konten', 'like', '%' . $request->search . '%');
        }
        
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->filled('tipe')) {
            $query->where('tipe', $request->tipe);
        }
        
        $pengumuman = $query->orderBy('prioritas', 'desc')
                           ->orderBy('created_at', 'desc')
                           ->paginate(10);
        
        return inertia('Admin/Pengumuman/Index', compact('pengumuman'));
    }

    public function create()
    {
        return inertia('Admin/Pengumuman/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'tipe' => 'required|in:umum,urgent,tanggal_spesifik',
            'tanggal_berlaku' => 'nullable|date',
            'status' => 'required|in:draft,active',
            'prioritas' => 'nullable|integer|min:0|max:10',
            'meta_description' => 'nullable|string|max:255',
        ]);

        $validated['slug'] = Str::slug($validated['judul']);
        $validated['created_by'] = Auth::id();
        
        Pengumuman::create($validated);
        
        return redirect()->route('admin.pengumuman.index')
                    ->with('success', 'Pengumuman berhasil ditambahkan');
    }

    public function show(Pengumuman $pengumuman)
    {
        return inertia('Admin/Pengumuman/Show', compact('pengumuman'));
    }

    public function edit(Pengumuman $pengumuman)
    {
        return inertia('Admin/Pengumuman/Edit', compact('pengumuman'));
    }

    public function update(Request $request, Pengumuman $pengumuman)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'tipe' => 'required|in:umum,urgent,tanggal_spesifik',
            'tanggal_berlaku' => 'nullable|date',
            'status' => 'required|in:draft,active,expired',
            'prioritas' => 'nullable|integer|min:0|max:10',
            'meta_description' => 'nullable|string|max:255',
        ]);

        $validated['slug'] = Str::slug($validated['judul']);
        $validated['updated_by'] = Auth::id();
        
        $pengumuman->update($validated);
        
        return redirect()->route('admin.pengumuman.index')
                    ->with('success', 'Pengumuman berhasil diperbarui');
    }

    public function destroy(Pengumuman $pengumuman)
    {
        $pengumuman->delete();
        
        return redirect()->route('admin.pengumuman.index')
                    ->with('success', 'Pengumuman berhasil dihapus');
    }

    public function bulkAction(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|in:publish,unpublish,delete',
            'pengumuman_ids' => 'required|array',
            'pengumuman_ids.*' => 'exists:pengumuman,id',
        ]);

        $pengumuman = Pengumuman::whereIn('id', $validated['pengumuman_ids']);

        switch ($validated['action']) {
            case 'publish':
                $pengumuman->update(['status' => 'active']);
                $message = 'Pengumuman berhasil dipublish';
                break;
            case 'unpublish':
                $pengumuman->update(['status' => 'draft']);
                $message = 'Pengumuman berhasil diunpublish';
                break;
            case 'delete':
                $pengumuman->delete();
                $message = 'Pengumuman berhasil dihapus';
                break;
        }

        return redirect()->route('admin.pengumuman.index')
                    ->with('success', $message);
    }
}
```

#### Step 4: Add routes

Modify `routes/web_admin.php`:
```php
use App\Http\Controllers\Admin\PengumumanController;

// Add inside admin.auth middleware group:
Route::prefix('pengumuman')->name('pengumuman.')->group(function () {
    Route::get('/', [PengumumanController::class, 'index'])->name('index');
    Route::get('/create', [PengumumanController::class, 'create'])->name('create');
    Route::post('/', [PengumumanController::class, 'store'])->name('store');
    Route::get('/{pengumuman}', [PengumumanController::class, 'show'])->name('show');
    Route::get('/{pengumuman}/edit', [PengumumanController::class, 'edit'])->name('edit');
    Route::put('/{pengumuman}', [PengumumanController::class, 'update'])->name('update');
    Route::delete('/{pengumuman}', [PengumumanController::class, 'destroy'])->name('destroy');
    Route::post('/bulk-action', [PengumumanController::class, 'bulkAction'])->name('bulk-action');
});
```

#### Step 5: Run test to verify it passes

Run: `php artisan test tests/Feature/Admin/PengumumanTest.php`
Expected: PASS

#### Step 6: Commit

```bash
git add app/Http/Controllers/Admin/PengumumanController.php
git add tests/Feature/Admin/PengumumanTest.php
git add routes/web_admin.php
git commit -m "feat: implement pengumuman CRUD controller"
```

### Task 5: Create Pengumuman Views

**Files:**
- Create: `resources/js/Pages/Admin/Pengumuman/Index.jsx`
- Create: `resources/js/Pages/Admin/Pengumuman/Create.jsx`
- Create: `resources/js/Pages/Admin/Pengumuman/Edit.jsx`
- Create: `resources/js/Components/Admin/Pengumuman/Form.jsx`

#### Step 1: Create list view component

```jsx
// resources/js/Pages/Admin/Pengumuman/Index.jsx
import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '@/Layouts/AdminLayout';
import { Hugeicons } from 'hugeicons-react';

export default function Index({ pengumuman }) {
    const [selectedItems, setSelectedItems] = useState([]);
    
    const { delete: destroy } = useForm();
    
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(pengumuman.data.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };
    
    const handleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleBulkAction = (action) => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('admin.pengumuman.bulk-action');
        
        const actionInput = document.createElement('input');
        actionInput.type = 'hidden';
        actionInput.name = 'action';
        actionInput.value = action;
        form.appendChild(actionInput);
        
        selectedItems.forEach(id => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'pengumuman_ids[]';
            input.value = id;
            form.appendChild(input);
        });
        
        document.body.appendChild(form);
        form.submit();
    };

    return (
        <Layout>
            <Head title="Kelola Pengumuman" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Pengumuman</h1>
                        <Link
                            href={route('admin.pengumuman.create')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            <Hugeicons.PlusSign className="mr-2 -ml-1 h-5 w-5" />
                            Tambah Pengumuman
                        </Link>
                    </div>
                    
                    {/* Filters */}
                    <div className="mt-6 bg-white shadow rounded-lg p-4">
                        <form className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Cari pengumuman..."
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                defaultValue={new URLSearchParams(window.location.search).get('search')}
                            />
                            <select className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option value="">Semua Status</option>
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="expired">Expired</option>
                            </select>
                            <select className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option value="">Semua Tipe</option>
                                <option value="umum">Umum</option>
                                <option value="urgent">Urgent</option>
                                <option value="tanggal_spesifik">Tanggal Spesifik</option>
                            </select>
                            <button type="submit" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                                <Hugeicons.Search01 className="h-5 w-5" />
                            </button>
                        </form>
                    </div>

                    {/* Bulk Actions */}
                    {selectedItems.length > 0 && (
                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-800">
                                    {selectedItems.length} item terpilih
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleBulkAction('publish')}
                                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                    >
                                        Publish
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('unpublish')}
                                        className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                                    >
                                        Unpublish
                                    </button>
                                    <button
                                        onClick={() => handleBulkAction('delete')}
                                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Table */}
                    <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={selectedItems.length === pengumuman.data.length}
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Judul
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipe
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dibuat
                                    </th>
                                    <th className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pengumuman.data.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => handleSelectItem(item.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {item.judul}
                                            </div>
                                            {item.tanggal_berlaku && (
                                                <div className="text-sm text-gray-500">
                                                    Berlaku: {new Date(item.tanggal_berlaku).toLocaleDateString('id-ID')}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                                                item.tipe === 'urgent' ? 'bg-red-100 text-red-800' :
                                                item.tipe === 'tanggal_spesifik' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {item.tipe}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                                                item.status === 'active' ? 'bg-green-100 text-green-800' :
                                                item.status === 'expired' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(item.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route('admin.pengumuman.show', item.id)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    <Hugeicons.Eye className="h-5 w-5" />
                                                </Link>
                                                <Link
                                                    href={route('admin.pengumuman.edit', item.id)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <Hugeicons.Edit02 className="h-5 w-5" />
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Hapus pengumuman ini?')) {
                                                            destroy.delete(route('admin.pengumuman.destroy', item.id));
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Hugeicons.TrashFull className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
```

#### Step 2: Create form component

```jsx
// resources/js/Components/Admin/Pengumuman/Form.jsx
import React, { useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Hugeicons } from 'hugeicons-react';

export default function Form({ pengumuman = null }) {
    const { props } = usePage();
    
    const { data, setData, post, put, processing, errors } = useForm({
        judul: pengumuman?.judul || '',
        konten: pengumuman?.konten || '',
        tipe: pengumuman?.tipe || 'umum',
        tanggal_berlaku: pengumuman?.tanggal_berlaku || '',
        status: pengumuman?.status || 'draft',
        prioritas: pengumuman?.prioritas || 0,
        meta_description: pengumuman?.meta_description || '',
    });

    const submit = (e) => {
        e.preventDefault();
        
        if (pengumuman) {
            put(route('admin.pengumuman.update', pengumuman.id));
        } else {
            post(route('admin.pengumuman.store'));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <label htmlFor="judul" className="block text-sm font-medium text-gray-700">
                    Judul
                </label>
                <input
                    id="judul"
                    type="text"
                    value={data.judul}
                    onChange={(e) => setData('judul', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.judul && (
                    <p className="mt-2 text-sm text-red-600">{errors.judul}</p>
                )}
            </div>

            <div>
                <label htmlFor="tipe" className="block text-sm font-medium text-gray-700">
                    Tipe
                </label>
                <select
                    id="tipe"
                    value={data.tipe}
                    onChange={(e) => setData('tipe', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="umum">Umum</option>
                    <option value="urgent">Urgent</option>
                    <option value="tanggal_spesifik">Tanggal Spesifik</option>
                </select>
                {errors.tipe && (
                    <p className="mt-2 text-sm text-red-600">{errors.tipe}</p>
                )}
            </div>

            <div>
                <label htmlFor="konten" className="block text-sm font-medium text-gray-700">
                    Konten
                </label>
                <textarea
                    id="konten"
                    rows={8}
                    value={data.konten}
                    onChange={(e) => setData('konten', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.konten && (
                    <p className="mt-2 text-sm text-red-600">{errors.konten}</p>
                )}
            </div>

            <div>
                <label htmlFor="tanggal_berlaku" className="block text-sm font-medium text-gray-700">
                    Tanggal Berlaku (opsional)
                </label>
                <input
                    id="tanggal_berlaku"
                    type="date"
                    value={data.tanggal_berlaku}
                    onChange={(e) => setData('tanggal_berlaku', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.tanggal_berlaku && (
                    <p className="mt-2 text-sm text-red-600">{errors.tanggal_berlaku}</p>
                )}
            </div>

            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                </label>
                <select
                    id="status"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    {pengumuman && <option value="expired">Expired</option>}
                </select>
                {errors.status && (
                    <p className="mt-2 text-sm text-red-600">{errors.status}</p>
                )}
            </div>

            <div>
                <label htmlFor="prioritas" className="block text-sm font-medium text-gray-700">
                    Prioritas (0-10)
                </label>
                <input
                    id="prioritas"
                    type="number"
                    min="0"
                    max="10"
                    value={data.prioritas}
                    onChange={(e) => setData('prioritas', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.prioritas && (
                    <p className="mt-2 text-sm text-red-600">{errors.prioritas}</p>
                )}
            </div>

            <div>
                <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700">
                    Meta Description (opsional)
                </label>
                <input
                    id="meta_description"
                    type="text"
                    value={data.meta_description}
                    onChange={(e) => setData('meta_description', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.meta_description && (
                    <p className="mt-2 text-sm text-red-600">{errors.meta_description}</p>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    <Hugeicons.SaveFloppyDisk className="mr-2 -ml-1 h-5 w-5" />
                    {processing ? 'Menyimpan...' : (pengumuman ? 'Update' : 'Simpan')}
                </button>
            </div>
        </form>
    );
}
```

#### Step 3: Create create view

```jsx
// resources/js/Pages/Admin/Pengumuman/Create.jsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/Layouts/AdminLayout';
import Form from '@/Components/Admin/Pengumuman/Form';

export default function Create() {
    return (
        <Layout>
            <Head title="Tambah Pengumuman" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Tambah Pengumuman</h1>
                        <Link
                            href={route('admin.pengumuman.index')}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <Hugeicons.ArrowLeft className="mr-2 -ml-1 h-5 w-5" />
                            Kembali
                        </Link>
                    </div>
                    
                    <div className="bg-white shadow rounded-lg p-6">
                        <Form />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
```

#### Step 4: Create edit view

```jsx
// resources/js/Pages/Admin/Pengumuman/Edit.jsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/Layouts/AdminLayout';
import Form from '@/Components/Admin/Pengumuman/Form';

export default function Edit({ pengumuman }) {
    return (
        <Layout>
            <Head title={`Edit Pengumuman: ${pengumuman.judul}`} />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Edit Pengumuman</h1>
                        <Link
                            href={route('admin.pengumuman.index')}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <Hugeicons.ArrowLeft className="mr-2 -ml-1 h-5 w-5" />
                            Kembali
                        </Link>
                    </div>
                    
                    <div className="bg-white shadow rounded-lg p-6">
                        <Form pengumuman={pengumuman} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
```

#### Step 5: Run tests to verify they pass

Run: `php artisan test tests/Feature/Admin/PengumumanTest.php`
Expected: PASS

#### Step 6: Commit

```bash
git add resources/js/Pages/Admin/Pengumuman/Index.jsx
git add resources/js/Pages/Admin/Pengumuman/Create.jsx
git add resources/js/Pages/Admin/Pengumuman/Edit.jsx
git add resources/js/Components/Admin/Pengumuman/Form.jsx
git commit -m "feat: implement pengumuman CRUD views"
```

---

**Plan complete and saved to `docs/plans/2025-12-13-admin-crud-implementation-plan.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**

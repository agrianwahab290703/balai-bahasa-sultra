<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\BeritaController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\PengumumanController;
use App\Http\Controllers\Admin\PpidDocumentController;
use App\Http\Controllers\Admin\ProfileContentController;
use App\Http\Controllers\Admin\SearchController;
use App\Http\Controllers\Admin\SsdController;
use App\Http\Controllers\Admin\StandarPelayananController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    
    Route::middleware(['admin.auth'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        
        // Global Search route
        Route::get('/search', [SearchController::class, 'search'])->name('search');
        
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

        // Media Library routes
        Route::prefix('media')->name('media.')->group(function () {
            Route::get('/', [MediaController::class, 'index'])->name('index');
            Route::post('/upload', [MediaController::class, 'upload'])->name('upload');
            Route::get('/{media}', [MediaController::class, 'show'])->name('show');
            Route::delete('/{media}', [MediaController::class, 'destroy'])->name('destroy');
            Route::post('/bulk-delete', [MediaController::class, 'bulkDelete'])->name('bulk-delete');
        });

        // Berita (News) routes
        Route::prefix('berita')->name('berita.')->group(function () {
            Route::get('/', [BeritaController::class, 'index'])->name('index');
            Route::get('/create', [BeritaController::class, 'create'])->name('create');
            Route::post('/', [BeritaController::class, 'store'])->name('store');
            Route::get('/{berita}', [BeritaController::class, 'show'])->name('show');
            Route::get('/{berita}/edit', [BeritaController::class, 'edit'])->name('edit');
            Route::put('/{berita}', [BeritaController::class, 'update'])->name('update');
            Route::delete('/{berita}', [BeritaController::class, 'destroy'])->name('destroy');
            Route::post('/bulk-action', [BeritaController::class, 'bulkAction'])->name('bulk-action');
        });

        // Gallery routes
        Route::prefix('gallery')->name('gallery.')->group(function () {
            Route::get('/', [GalleryController::class, 'index'])->name('index');
            Route::get('/create', [GalleryController::class, 'create'])->name('create');
            Route::post('/', [GalleryController::class, 'store'])->name('store');
            Route::get('/{gallery}', [GalleryController::class, 'show'])->name('show');
            Route::get('/{gallery}/edit', [GalleryController::class, 'edit'])->name('edit');
            Route::put('/{gallery}', [GalleryController::class, 'update'])->name('update');
            Route::delete('/{gallery}', [GalleryController::class, 'destroy'])->name('destroy');
            Route::post('/reorder', [GalleryController::class, 'reorder'])->name('reorder');
            Route::post('/{gallery}/toggle-featured', [GalleryController::class, 'toggleFeatured'])->name('toggle-featured');
            Route::post('/{gallery}/toggle-active', [GalleryController::class, 'toggleActive'])->name('toggle-active');
            Route::post('/bulk-action', [GalleryController::class, 'bulkAction'])->name('bulk-action');
        });

        // PPID Document routes
        Route::prefix('ppid')->name('ppid.')->group(function () {
            Route::get('/', [PpidDocumentController::class, 'index'])->name('index');
            Route::get('/create', [PpidDocumentController::class, 'create'])->name('create');
            Route::post('/', [PpidDocumentController::class, 'store'])->name('store');
            Route::get('/{ppid}', [PpidDocumentController::class, 'show'])->name('show');
            Route::get('/{ppid}/edit', [PpidDocumentController::class, 'edit'])->name('edit');
            Route::put('/{ppid}', [PpidDocumentController::class, 'update'])->name('update');
            Route::delete('/{ppid}', [PpidDocumentController::class, 'destroy'])->name('destroy');
            Route::get('/{ppid}/download', [PpidDocumentController::class, 'download'])->name('download');
            Route::post('/{ppid}/toggle-active', [PpidDocumentController::class, 'toggleActive'])->name('toggle-active');
            Route::post('/bulk-action', [PpidDocumentController::class, 'bulkAction'])->name('bulk-action');
        });

        // SSD (FAQ) routes
        Route::prefix('ssd')->name('ssd.')->group(function () {
            Route::get('/', [SsdController::class, 'index'])->name('index');
            Route::get('/create', [SsdController::class, 'create'])->name('create');
            Route::post('/', [SsdController::class, 'store'])->name('store');
            Route::get('/{ssd}', [SsdController::class, 'show'])->name('show');
            Route::get('/{ssd}/edit', [SsdController::class, 'edit'])->name('edit');
            Route::put('/{ssd}', [SsdController::class, 'update'])->name('update');
            Route::delete('/{ssd}', [SsdController::class, 'destroy'])->name('destroy');
            Route::post('/reorder', [SsdController::class, 'reorder'])->name('reorder');
            Route::post('/{ssd}/toggle-active', [SsdController::class, 'toggleActive'])->name('toggle-active');
            Route::post('/bulk-action', [SsdController::class, 'bulkAction'])->name('bulk-action');
        });

        // Standar Pelayanan routes
        Route::prefix('standar-pelayanan')->name('standar-pelayanan.')->group(function () {
            Route::get('/', [StandarPelayananController::class, 'index'])->name('index');
            Route::get('/create', [StandarPelayananController::class, 'create'])->name('create');
            Route::post('/', [StandarPelayananController::class, 'store'])->name('store');
            Route::get('/{standarPelayanan}', [StandarPelayananController::class, 'show'])->name('show');
            Route::get('/{standarPelayanan}/edit', [StandarPelayananController::class, 'edit'])->name('edit');
            Route::put('/{standarPelayanan}', [StandarPelayananController::class, 'update'])->name('update');
            Route::delete('/{standarPelayanan}', [StandarPelayananController::class, 'destroy'])->name('destroy');
            Route::get('/{standarPelayanan}/download', [StandarPelayananController::class, 'download'])->name('download');
            Route::post('/reorder', [StandarPelayananController::class, 'reorder'])->name('reorder');
            Route::post('/{standarPelayanan}/toggle-active', [StandarPelayananController::class, 'toggleActive'])->name('toggle-active');
            Route::post('/bulk-action', [StandarPelayananController::class, 'bulkAction'])->name('bulk-action');
        });

        // Profile Content routes
        Route::prefix('profile-content')->name('profile-content.')->group(function () {
            Route::get('/', [ProfileContentController::class, 'index'])->name('index');
            Route::get('/create', [ProfileContentController::class, 'create'])->name('create');
            Route::post('/', [ProfileContentController::class, 'store'])->name('store');
            Route::get('/{profileContent}', [ProfileContentController::class, 'show'])->name('show');
            Route::get('/{profileContent}/edit', [ProfileContentController::class, 'edit'])->name('edit');
            Route::put('/{profileContent}', [ProfileContentController::class, 'update'])->name('update');
            Route::delete('/{profileContent}', [ProfileContentController::class, 'destroy'])->name('destroy');
            Route::post('/reorder', [ProfileContentController::class, 'reorder'])->name('reorder');
            Route::post('/{profileContent}/toggle-active', [ProfileContentController::class, 'toggleActive'])->name('toggle-active');
            Route::post('/bulk-action', [ProfileContentController::class, 'bulkAction'])->name('bulk-action');
        });

        // Menu Management routes
        Route::prefix('menu')->name('menu.')->group(function () {
            Route::get('/', [MenuController::class, 'index'])->name('index');
            Route::get('/create', [MenuController::class, 'create'])->name('create');
            Route::post('/', [MenuController::class, 'store'])->name('store');
            Route::get('/{menu}', [MenuController::class, 'show'])->name('show');
            Route::get('/{menu}/edit', [MenuController::class, 'edit'])->name('edit');
            Route::put('/{menu}', [MenuController::class, 'update'])->name('update');
            Route::delete('/{menu}', [MenuController::class, 'destroy'])->name('destroy');
            Route::post('/reorder', [MenuController::class, 'reorder'])->name('reorder');
            Route::post('/{menu}/toggle-visible', [MenuController::class, 'toggleVisible'])->name('toggle-visible');
        });

        // User Management routes (super_admin only)
        Route::middleware(['super.admin'])->prefix('users')->name('users.')->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('index');
            Route::get('/create', [UserController::class, 'create'])->name('create');
            Route::post('/', [UserController::class, 'store'])->name('store');
            Route::get('/{user}', [UserController::class, 'show'])->name('show');
            Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit');
            Route::put('/{user}', [UserController::class, 'update'])->name('update');
            Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
            Route::post('/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('toggle-active');
            Route::put('/{user}/password', [UserController::class, 'updatePassword'])->name('update-password');
        });

        // Activity Log routes
        Route::prefix('activity-logs')->name('activity-logs.')->group(function () {
            Route::get('/', [ActivityLogController::class, 'index'])->name('index');
            Route::get('/{activityLog}', [ActivityLogController::class, 'show'])->name('show');
        });
    });
});

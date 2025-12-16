<?php

namespace App\Providers;

use App\Auth\AdminUserProvider;
use App\Models\AdminUser;
use App\Models\Berita;
use App\Models\Gallery;
use App\Models\PpidDocument;
use App\Models\Ssd;
use App\Observers\BeritaObserver;
use App\Observers\GalleryObserver;
use App\Observers\PpidDocumentObserver;
use App\Observers\SsdObserver;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Force HTTPS when APP_URL uses https (e.g., ngrok)
        if (str_starts_with(config('app.url'), 'https://')) {
            URL::forceScheme('https');
        }

        // Set Carbon locale to Indonesian for date formatting
        // Requirements: 5.4 - Indonesian date format (e.g., "15 Des 2025")
        Carbon::setLocale('id');

        // Register custom admin user provider that blocks deactivated users
        Auth::provider('admin_eloquent', function ($app, array $config) {
            return new AdminUserProvider($app['hash'], $config['model']);
        });

        // Register model observers for cache invalidation
        // @see Requirements 13.1, 13.2, 13.3
        Berita::observe(BeritaObserver::class);
        Gallery::observe(GalleryObserver::class);
        PpidDocument::observe(PpidDocumentObserver::class);
        Ssd::observe(SsdObserver::class);
    }
}

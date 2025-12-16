<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use App\Models\Berita;
use App\Models\Gallery;
use App\Models\Menu;
use App\Models\PpidDocument;
use App\Models\ProfileContent;
use App\Models\Ssd;
use App\Models\StandarPelayanan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Global search across all entities.
     * Returns results grouped by entity type.
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q', '');
        
        if (strlen($query) < 2) {
            return response()->json([
                'berita' => [],
                'gallery' => [],
                'ppid' => [],
                'ssd' => [],
                'standar_pelayanan' => [],
                'profile_content' => [],
                'menu' => [],
                'users' => [],
            ]);
        }

        $limit = 5; // Limit results per entity type
        $user = auth('admin')->user();
        $userRole = $user?->role; // No fallback - null if not logged in

        $results = [
            'berita' => $this->searchBerita($query, $limit),
            'gallery' => $this->searchGallery($query, $limit),
            'ppid' => $this->canAccess([AdminUser::ROLE_SUPER_ADMIN, AdminUser::ROLE_ADMIN], $userRole) 
                ? $this->searchPpid($query, $limit) : [],
            'ssd' => $this->searchSsd($query, $limit),
            'standar_pelayanan' => $this->canAccess([AdminUser::ROLE_SUPER_ADMIN, AdminUser::ROLE_ADMIN], $userRole) 
                ? $this->searchStandarPelayanan($query, $limit) : [],
            'profile_content' => $this->canAccess([AdminUser::ROLE_SUPER_ADMIN, AdminUser::ROLE_ADMIN], $userRole) 
                ? $this->searchProfileContent($query, $limit) : [],
            'menu' => $this->canAccess([AdminUser::ROLE_SUPER_ADMIN, AdminUser::ROLE_ADMIN], $userRole) 
                ? $this->searchMenu($query, $limit) : [],
            'users' => $this->canAccess([AdminUser::ROLE_SUPER_ADMIN], $userRole) 
                ? $this->searchUsers($query, $limit) : [],
        ];

        return response()->json($results);
    }

    /**
     * Check if user role can access certain entities.
     */
    private function canAccess(array $allowedRoles, ?string $userRole): bool
    {
        return $userRole && in_array($userRole, $allowedRoles);
    }

    /**
     * Search Berita (News).
     */
    private function searchBerita(string $query, int $limit): array
    {
        return Berita::where(function ($q) use ($query) {
            $q->where('judul_utama', 'like', "%{$query}%")
              ->orWhere('teras_berita', 'like', "%{$query}%")
              ->orWhere('kategori', 'like', "%{$query}%");
        })
        ->orderBy('created_at', 'desc')
        ->limit($limit)
        ->get()
        ->map(fn ($item) => [
            'id' => $item->id,
            'title' => $item->judul_utama,
            'type' => 'berita',
            'url' => route('admin.berita.edit', $item->id),
            'description' => $item->kategori ? "Kategori: {$item->kategori}" : null,
        ])
        ->toArray();
    }

    /**
     * Search Gallery.
     */
    private function searchGallery(string $query, int $limit): array
    {
        return Gallery::where(function ($q) use ($query) {
            $q->where('title', 'like', "%{$query}%")
              ->orWhere('description', 'like', "%{$query}%")
              ->orWhere('category', 'like', "%{$query}%");
        })
        ->orderBy('created_at', 'desc')
        ->limit($limit)
        ->get()
        ->map(fn ($item) => [
            'id' => $item->id,
            'title' => $item->title,
            'type' => 'gallery',
            'url' => route('admin.gallery.edit', $item->id),
            'description' => $item->category ? "Kategori: {$item->category}" : null,
        ])
        ->toArray();
    }

    /**
     * Search PPID Documents.
     */
    private function searchPpid(string $query, int $limit): array
    {
        return PpidDocument::where(function ($q) use ($query) {
            $q->where('title', 'like', "%{$query}%")
              ->orWhere('description', 'like', "%{$query}%")
              ->orWhere('category', 'like', "%{$query}%");
        })
        ->orderBy('created_at', 'desc')
        ->limit($limit)
        ->get()
        ->map(fn ($item) => [
            'id' => $item->id,
            'title' => $item->title,
            'type' => 'ppid',
            'url' => route('admin.ppid.edit', $item->id),
            'description' => $item->category ? "Kategori: {$item->category}" : null,
        ])
        ->toArray();
    }

    /**
     * Search SSD (FAQ).
     */
    private function searchSsd(string $query, int $limit): array
    {
        return Ssd::where(function ($q) use ($query) {
            $q->where('question', 'like', "%{$query}%")
              ->orWhere('answer', 'like', "%{$query}%")
              ->orWhere('category', 'like', "%{$query}%");
        })
        ->orderBy('created_at', 'desc')
        ->limit($limit)
        ->get()
        ->map(fn ($item) => [
            'id' => $item->id,
            'title' => $item->question,
            'type' => 'ssd',
            'url' => route('admin.ssd.edit', $item->id),
            'description' => $item->category ? "Kategori: {$item->category}" : null,
        ])
        ->toArray();
    }

    /**
     * Search Standar Pelayanan.
     */
    private function searchStandarPelayanan(string $query, int $limit): array
    {
        return StandarPelayanan::where(function ($q) use ($query) {
            $q->where('title', 'like', "%{$query}%")
              ->orWhere('description', 'like', "%{$query}%")
              ->orWhere('category', 'like', "%{$query}%");
        })
        ->orderBy('created_at', 'desc')
        ->limit($limit)
        ->get()
        ->map(fn ($item) => [
            'id' => $item->id,
            'title' => $item->title,
            'type' => 'standar_pelayanan',
            'url' => route('admin.standar-pelayanan.edit', $item->id),
            'description' => $item->category ? "Kategori: {$item->category}" : null,
        ])
        ->toArray();
    }

    /**
     * Search Profile Content.
     */
    private function searchProfileContent(string $query, int $limit): array
    {
        return ProfileContent::where(function ($q) use ($query) {
            $q->where('title', 'like', "%{$query}%")
              ->orWhere('content', 'like', "%{$query}%")
              ->orWhere('type', 'like', "%{$query}%");
        })
        ->orderBy('created_at', 'desc')
        ->limit($limit)
        ->get()
        ->map(fn ($item) => [
            'id' => $item->id,
            'title' => $item->title,
            'type' => 'profile_content',
            'url' => route('admin.profile-content.edit', $item->id),
            'description' => $item->type ? "Tipe: {$item->type}" : null,
        ])
        ->toArray();
    }

    /**
     * Search Menu.
     */
    private function searchMenu(string $query, int $limit): array
    {
        return Menu::where(function ($q) use ($query) {
            $q->where('label', 'like', "%{$query}%")
              ->orWhere('url', 'like', "%{$query}%");
        })
        ->orderBy('order', 'asc')
        ->limit($limit)
        ->get()
        ->map(fn ($item) => [
            'id' => $item->id,
            'title' => $item->label,
            'type' => 'menu',
            'url' => route('admin.menu.edit', $item->id),
            'description' => $item->url,
        ])
        ->toArray();
    }

    /**
     * Search Admin Users.
     */
    private function searchUsers(string $query, int $limit): array
    {
        return AdminUser::where(function ($q) use ($query) {
            $q->where('name', 'like', "%{$query}%")
              ->orWhere('email', 'like', "%{$query}%")
              ->orWhere('role', 'like', "%{$query}%");
        })
        ->orderBy('created_at', 'desc')
        ->limit($limit)
        ->get()
        ->map(fn ($item) => [
            'id' => $item->id,
            'title' => $item->name,
            'type' => 'users',
            'url' => route('admin.users.edit', $item->id),
            'description' => "{$item->email} ({$item->role})",
        ])
        ->toArray();
    }
}

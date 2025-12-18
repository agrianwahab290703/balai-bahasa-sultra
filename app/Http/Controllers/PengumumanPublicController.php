<?php

namespace App\Http\Controllers;

use App\Models\Pengumuman;
use Illuminate\Http\Request;

class PengumumanPublicController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('q');
        $tipe = $request->query('tipe');

        $query = Pengumuman::query()
            ->where('status', 'active')
            ->when($tipe, fn ($q) => $q->where('tipe', $tipe))
            ->when($search, function ($q) use ($search) {
                $q->where(function ($inner) use ($search) {
                    $inner->where('judul', 'like', "%{$search}%")
                        ->orWhere('konten', 'like', "%{$search}%");
                });
            })
            ->orderBy('prioritas', 'desc')
            ->orderBy('created_at', 'desc');

        $pengumuman = $query->paginate(9)->withQueryString();

        return inertia('Public/Pengumuman/Index', [
            'pengumuman' => $pengumuman,
            'filters' => [
                'q' => $search,
                'tipe' => $tipe,
            ],
        ]);
    }

    public function show(string $slug)
    {
        $pengumuman = Pengumuman::where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();

        return inertia('Public/Pengumuman/Show', [
            'pengumuman' => $pengumuman,
        ]);
    }
}


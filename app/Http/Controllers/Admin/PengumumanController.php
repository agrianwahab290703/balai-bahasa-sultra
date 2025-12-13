<?php

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

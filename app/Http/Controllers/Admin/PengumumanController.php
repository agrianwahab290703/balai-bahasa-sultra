<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pengumuman;
use App\Services\PengumumanService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class PengumumanController extends Controller
{
    protected PengumumanService $pengumumanService;

    public function __construct(PengumumanService $pengumumanService)
    {
        $this->pengumumanService = $pengumumanService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status', 'tipe']);
        $pengumuman = $this->pengumumanService->getAll($filters);
        
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
            'gallery_images' => 'array|nullable|max:6',
            'gallery_images.*' => 'string',
        ]);

        try {
            $this->pengumumanService->create($validated);

            return redirect()->route('admin.pengumuman.index')
                        ->with('success', 'Pengumuman berhasil ditambahkan');
        } catch (\Exception $e) {
            return redirect()->back()
                        ->withInput()
                        ->withErrors(['judul' => $e->getMessage()]);
        }
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
            'gallery_images' => 'array|nullable|max:6',
            'gallery_images.*' => 'string',
        ]);

        $this->pengumumanService->update($pengumuman->id, $validated);
        
        return redirect()->route('admin.pengumuman.index')
                    ->with('success', 'Pengumuman berhasil diperbarui');
    }

    public function destroy(Pengumuman $pengumuman)
    {
        $this->pengumumanService->delete($pengumuman->id);
        
        return redirect()->route('admin.pengumuman.index')
                    ->with('success', 'Pengumuman berhasil dihapus');
    }

    public function bulkAction(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|in:publish,unpublish,draft,delete',
            'pengumuman_ids' => 'required|array',
            'pengumuman_ids.*' => 'exists:pengumuman,id',
        ]);

        $this->pengumumanService->bulkAction($validated['pengumuman_ids'], $validated['action']);

        $messages = [
            'publish' => 'Pengumuman berhasil dipublikasi',
            'unpublish' => 'Pengumuman berhasil diunpublish',
            'draft' => 'Pengumuman berhasil dijadikan draft',
            'delete' => 'Pengumuman berhasil dihapus',
        ];
        $message = $messages[$validated['action']];
        
        return redirect()->route('admin.pengumuman.index')
                    ->with('success', $message);
    }
}

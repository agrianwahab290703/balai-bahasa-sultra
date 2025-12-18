<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StandarPelayanan;
use App\Services\ActivityLoggerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StandarPelayananController extends Controller
{
    protected ActivityLoggerService $activityLogger;

    public const ALLOWED_FILE_TYPES = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];

    public function __construct(ActivityLoggerService $activityLogger)
    {
        $this->activityLogger = $activityLogger;
    }

    public function index(Request $request): Response
    {
        $query = StandarPelayanan::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->input('status') === 'active');
        }

        $sortColumn = $request->input('sort', 'sort_order');
        $sortDirection = $request->input('direction', 'asc');
        $allowedSortColumns = ['title', 'file_type', 'download_count', 'sort_order', 'created_at'];

        if (in_array($sortColumn, $allowedSortColumns, true)) {
            $query->orderBy($sortColumn, $sortDirection === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('sort_order', 'asc');
        }

        $perPage = $request->input('per_page', 15);
        $documents = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Admin/StandarPelayanan/Index', [
            'documents' => $documents,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
                'sort' => $sortColumn,
                'direction' => $sortDirection,
            ],
            'statistics' => $this->getStatistics(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/StandarPelayanan/Create', [
            'allowedFileTypes' => self::ALLOWED_FILE_TYPES,
            'maxFileSize' => 10240,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'document_type' => 'required|in:file,link',
            'external_url' => 'required_if:document_type,link|nullable|url|max:2048',
            'file' => 'required_if:document_type,file|nullable|file|mimes:' . implode(',', self::ALLOWED_FILE_TYPES) . '|max:10240',
            'is_active' => 'boolean',
        ]);

        $payload = $this->prepareDocumentPayload($request, $validated);

        $document = StandarPelayanan::create(array_merge([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
            'is_active' => $validated['is_active'] ?? true,
            'download_count' => 0,
            'sort_order' => (StandarPelayanan::max('sort_order') ?? 0) + 1,
        ], $payload));

        $this->activityLogger->logCreated($document);

        return redirect()->route('admin.standar-pelayanan.index')
            ->with('success', 'Standar Pelayanan berhasil ditambahkan');
    }

    public function show(StandarPelayanan $standarPelayanan): Response
    {
        return Inertia::render('Admin/StandarPelayanan/Show', [
            'document' => $this->formatDocument($standarPelayanan),
        ]);
    }

    public function edit(StandarPelayanan $standarPelayanan): Response
    {
        return Inertia::render('Admin/StandarPelayanan/Edit', [
            'document' => $this->formatDocument($standarPelayanan),
            'allowedFileTypes' => self::ALLOWED_FILE_TYPES,
            'maxFileSize' => 10240,
        ]);
    }

    public function update(Request $request, StandarPelayanan $standarPelayanan): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'document_type' => 'required|in:file,link',
            'external_url' => 'required_if:document_type,link|nullable|url|max:2048',
            'file' => 'nullable|file|mimes:' . implode(',', self::ALLOWED_FILE_TYPES) . '|max:10240',
            'is_active' => 'boolean',
        ]);

        if (
            $validated['document_type'] === 'file'
            && !$request->hasFile('file')
            && $standarPelayanan->document_type === 'link'
        ) {
            return back()
                ->withErrors(['file' => 'Unggah file dokumen sebelum menyimpan perubahan.'])
                ->withInput();
        }

        $oldValues = $standarPelayanan->getAttributes();

        $updateData = [
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
            'is_active' => $validated['is_active'] ?? $standarPelayanan->is_active,
        ];

        $payload = $this->prepareDocumentPayload($request, $validated, $standarPelayanan);

        $standarPelayanan->update(array_merge($updateData, $payload));

        $this->activityLogger->logUpdated($standarPelayanan, $oldValues);

        return redirect()->route('admin.standar-pelayanan.index')
            ->with('success', 'Standar Pelayanan berhasil diperbarui');
    }

    public function destroy(StandarPelayanan $standarPelayanan): RedirectResponse
    {
        if ($standarPelayanan->document_type === 'file') {
            $this->deleteStoredFile($standarPelayanan->url);
        }

        $this->activityLogger->logDeleted($standarPelayanan);

        $standarPelayanan->delete();

        return redirect()->route('admin.standar-pelayanan.index')
            ->with('success', 'Standar Pelayanan berhasil dihapus');
    }

    public function toggleActive(StandarPelayanan $standarPelayanan): RedirectResponse
    {
        $oldValues = $standarPelayanan->getAttributes();

        $standarPelayanan->update(['is_active' => !$standarPelayanan->is_active]);

        $this->activityLogger->logUpdated($standarPelayanan, $oldValues);

        $status = $standarPelayanan->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()->back()->with('success', "Standar Pelayanan berhasil {$status}");
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:standar_pelayanans,id',
            'items.*.sort_order' => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['items'] as $item) {
                StandarPelayanan::where('id', $item['id'])
                    ->update(['sort_order' => $item['sort_order']]);
            }
        });

        return back()->with('success', 'Urutan berhasil diperbarui');
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => 'required|in:activate,deactivate,delete',
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:standar_pelayanans,id',
        ]);

        $ids = $validated['ids'];
        $count = count($ids);

        switch ($validated['action']) {
            case 'activate':
                StandarPelayanan::whereIn('id', $ids)->update(['is_active' => true]);
                $message = "{$count} dokumen berhasil diaktifkan";
                break;

            case 'deactivate':
                StandarPelayanan::whereIn('id', $ids)->update(['is_active' => false]);
                $message = "{$count} dokumen berhasil dinonaktifkan";
                break;

            case 'delete':
                $documents = StandarPelayanan::whereIn('id', $ids)->get();
                foreach ($documents as $document) {
                    if ($document->document_type === 'file') {
                        $this->deleteStoredFile($document->url);
                    }
                    $this->activityLogger->logDeleted($document);
                }
                StandarPelayanan::whereIn('id', $ids)->delete();
                $message = "{$count} dokumen berhasil dihapus";
                break;

            default:
                $message = 'Aksi tidak valid';
        }

        return redirect()->route('admin.standar-pelayanan.index')
            ->with('success', $message);
    }

    public function download(StandarPelayanan $standarPelayanan)
    {
        if ($standarPelayanan->document_type === 'link' || $this->isExternalUrl($standarPelayanan->url)) {
            $standarPelayanan->incrementDownloadCount();

            if ($standarPelayanan->external_url ?? $standarPelayanan->url) {
                return redirect()->away($standarPelayanan->external_url ?? $standarPelayanan->url);
            }

            return redirect()->back()->with('error', 'Tautan tidak tersedia');
        }

        if (!$standarPelayanan->url || !Storage::disk('public')->exists($standarPelayanan->url)) {
            return redirect()->back()->with('error', 'File tidak ditemukan');
        }

        $standarPelayanan->incrementDownloadCount();

        return Storage::disk('public')->download(
            $standarPelayanan->url,
            $standarPelayanan->title . '.' . $standarPelayanan->file_type
        );
    }

    protected function getStatistics(): array
    {
        $total = StandarPelayanan::count();
        $active = StandarPelayanan::where('is_active', true)->count();
        $inactive = StandarPelayanan::where('is_active', false)->count();
        $downloads = StandarPelayanan::sum('download_count');

        $fileBased = StandarPelayanan::query()
            ->where(fn ($query) => $query
                ->where('document_type', 'file')
                ->orWhereNull('document_type'))
            ->count();

        $linkBased = StandarPelayanan::where('document_type', 'link')->count();

        return [
            'total' => $total,
            'active' => $active,
            'inactive' => $inactive,
            'downloads' => $downloads,
            'file_based' => $fileBased,
            'link_based' => $linkBased,
        ];
    }

    protected function formatDocument(StandarPelayanan $document): array
    {
        $documentType = $document->document_type ?? ($document->is_external ? 'link' : 'file');

        return array_merge($document->toArray(), [
            'file_size_formatted' => $document->formatted_file_size,
            'file_url' => $document->public_url,
            'external_url' => $document->external_url,
            'document_type' => $documentType,
            'source_label' => $documentType === 'link' ? 'Tautan' : 'Berkas',
        ]);
    }

    private function prepareDocumentPayload(Request $request, array $validated, ?StandarPelayanan $existing = null): array
    {
        if ($validated['document_type'] === 'file') {
            $data = [
                'document_type' => 'file',
                'external_url' => null,
            ];

            if ($request->hasFile('file')) {
                if ($existing && $existing->document_type === 'file') {
                    $this->deleteStoredFile($existing->url);
                }

                $file = $request->file('file');

                $data['url'] = $file->store('standar-pelayanan', 'public');
                $data['file_type'] = strtolower($file->getClientOriginalExtension());
                $data['file_size'] = $file->getSize();
            } else {
                $data['url'] = $existing->url ?? null;
                $data['file_type'] = $existing->file_type ?? null;
                $data['file_size'] = $existing->file_size ?? null;
            }

            return $data;
        }

        if ($existing && $existing->document_type === 'file') {
            $this->deleteStoredFile($existing->url);
        }

        $url = $validated['external_url'];

        return [
            'document_type' => 'link',
            'external_url' => $url,
            'url' => $url,
            'file_type' => $this->guessFileTypeFromUrl($url),
            'file_size' => null,
        ];
    }

    private function deleteStoredFile(?string $path): void
    {
        if (!$path || $this->isExternalUrl($path)) {
            return;
        }

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    private function isExternalUrl(?string $url): bool
    {
        return $url ? filter_var($url, FILTER_VALIDATE_URL) !== false : false;
    }

    private function guessFileTypeFromUrl(?string $url): ?string
    {
        if (!$url) {
            return null;
        }

        $path = parse_url($url, PHP_URL_PATH);
        $extension = $path ? pathinfo($path, PATHINFO_EXTENSION) : null;

        return $extension ? strtolower($extension) : null;
    }
}
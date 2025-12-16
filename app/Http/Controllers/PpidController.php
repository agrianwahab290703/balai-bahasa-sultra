<?php

namespace App\Http\Controllers;

use App\Models\PpidContent;
use App\Models\PpidTeamMember;
use App\Models\PpidDocument;
use App\Models\Keberatan;
use App\Http\Requests\KeberatanRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class PpidController extends Controller
{
    /**
     * Cache key constants for PPID documents
     */
    private const CACHE_KEY_ALL = 'ppid_documents_all';
    private const CACHE_KEY_SETIAP_SAAT = 'ppid_documents_setiap_saat';
    private const CACHE_KEY_SERTA_MERTA = 'ppid_documents_serta_merta';
    private const CACHE_KEY_BERKALA = 'ppid_documents_berkala';
    private const CACHE_KEY_DIKECUALIKAN = 'ppid_documents_dikecualikan';
    private const CACHE_TTL = 1800; // 30 minutes

    public function profil()
    {
        $profile = PpidContent::byType('profile')->active()->orderByOrder()->first();
        $legalBasis = PpidContent::byType('legal_basis')->active()->orderByOrder()->get();
        $principles = PpidContent::byType('principle')->active()->orderByOrder()->get();
        $tasks = PpidContent::byType('task_function')->active()->orderByOrder()->get();
        $address = PpidContent::byType('address')->active()->orderByOrder()->first();
        $teamMembers = PpidTeamMember::active()->orderByOrder()->get();

        return Inertia::render('Ppid/Profil', [
            'profile' => $profile,
            'legalBasis' => $legalBasis,
            'principles' => $principles,
            'tasks' => $tasks,
            'address' => $address,
            'teamMembers' => $teamMembers,
        ]);
    }

    /**
     * Display all PPID documents grouped by category.
     * Only shows documents where is_active=true.
     * 
     * @see Requirements 11.1, 11.5
     */
    public function informasiPublik()
    {
        // Cache PPID documents for 30 minutes
        // Only active documents are shown (is_active=true)
        $categories = Cache::remember(self::CACHE_KEY_ALL, self::CACHE_TTL, function () {
            return [
                'setiap-saat' => PpidDocument::byCategory('setiap_saat')
                    ->active()
                    ->orderBy('created_at', 'desc')
                    ->get(),
                'serta-merta' => PpidDocument::byCategory('serta_merta')
                    ->active()
                    ->orderBy('created_at', 'desc')
                    ->get(),
                'berkala' => PpidDocument::byCategory('berkala')
                    ->active()
                    ->orderBy('created_at', 'desc')
                    ->get(),
                'dikecualikan' => PpidDocument::byCategory('dikecualikan')
                    ->active()
                    ->orderBy('created_at', 'desc')
                    ->get(),
            ];
        });

        return Inertia::render('Ppid/InformasiPublik', [
            'categories' => $categories,
        ]);
    }

    /**
     * Display PPID documents in 'setiap_saat' category.
     * Only shows documents where is_active=true.
     * 
     * @see Requirements 11.1, 11.5
     */
    public function informasiSetiapSaat()
    {
        $page = request()->get('page', 1);
        $cacheKey = self::CACHE_KEY_SETIAP_SAAT . '_page_' . $page;
        
        $documents = Cache::remember($cacheKey, self::CACHE_TTL, function () {
            return PpidDocument::byCategory('setiap_saat')
                ->active()
                ->orderBy('created_at', 'desc')
                ->paginate(12);
        });
        
        return Inertia::render('Ppid/InformasiPublik/SetiapSaat', [
            'documents' => $documents,
        ]);
    }

    /**
     * Display PPID documents in 'serta_merta' category.
     * Only shows documents where is_active=true.
     * 
     * @see Requirements 11.1, 11.5
     */
    public function informasiSertaMerta()
    {
        $page = request()->get('page', 1);
        $cacheKey = self::CACHE_KEY_SERTA_MERTA . '_page_' . $page;
        
        $documents = Cache::remember($cacheKey, self::CACHE_TTL, function () {
            return PpidDocument::byCategory('serta_merta')
                ->active()
                ->orderBy('created_at', 'desc')
                ->paginate(12);
        });
        
        return Inertia::render('Ppid/InformasiPublik/SertaMerta', [
            'documents' => $documents,
        ]);
    }

    /**
     * Display PPID documents in 'berkala' category.
     * Only shows documents where is_active=true.
     * 
     * @see Requirements 11.1, 11.5
     */
    public function informasiBerkala()
    {
        $page = request()->get('page', 1);
        $cacheKey = self::CACHE_KEY_BERKALA . '_page_' . $page;
        
        $documents = Cache::remember($cacheKey, self::CACHE_TTL, function () {
            return PpidDocument::byCategory('berkala')
                ->active()
                ->orderBy('created_at', 'desc')
                ->paginate(12);
        });
        
        return Inertia::render('Ppid/InformasiPublik/Berkala', [
            'documents' => $documents,
        ]);
    }

    /**
     * Display PPID documents in 'dikecualikan' category.
     * Only shows documents where is_active=true.
     * 
     * @see Requirements 11.1, 11.5
     */
    public function informasiDikecualikan()
    {
        $page = request()->get('page', 1);
        $cacheKey = self::CACHE_KEY_DIKECUALIKAN . '_page_' . $page;
        
        $documents = Cache::remember($cacheKey, self::CACHE_TTL, function () {
            return PpidDocument::byCategory('dikecualikan')
                ->active()
                ->orderBy('created_at', 'desc')
                ->paginate(12);
        });
        
        return Inertia::render('Ppid/InformasiPublik/Dikecualikan', [
            'documents' => $documents,
        ]);
    }

    public function permohonan()
    {
        return Inertia::render('Ppid/Permohonan');
    }

    public function pengajuanKeberatan()
    {
        return Inertia::render('Ppid/PengajuanKeberatan');
    }

    /**
     * Download a PPID document and increment download count.
     * Only allows download of active documents.
     * 
     * @param int $id Document ID
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     * @see Requirements 11.4
     */
    public function downloadDocument($id)
    {
        // Only allow download of active documents
        $document = PpidDocument::where('id', $id)
            ->where('is_active', true)
            ->firstOrFail();
        
        // Check if file exists
        if (!$document->file_path || !Storage::disk('public')->exists($document->file_path)) {
            abort(404, 'File tidak ditemukan');
        }
        
        // Increment download count
        // This tracks the number of times the document has been downloaded
        $document->increment('download_count');
        
        // Get the file extension for proper filename
        $extension = pathinfo($document->file_path, PATHINFO_EXTENSION);
        $filename = $document->title . '.' . $extension;
        
        return Storage::disk('public')->download($document->file_path, $filename);
    }

    /**
     * Store a new keberatan submission
     */
    public function storeKeberatan(KeberatanRequest $request)
    {
        try {
            // Generate nomor registrasi
            $nomorRegistrasi = Keberatan::generateNomorRegistrasi();

            // Handle file upload if present
            $dokumenPath = null;
            if ($request->hasFile('dokumenPendukung')) {
                $dokumenPath = $request->file('dokumenPendukung')
                    ->store('keberatan/dokumen', 'public');
            }

            // Create keberatan record
            $keberatan = Keberatan::create([
                'nomor_registrasi' => $nomorRegistrasi,
                'nama_lengkap' => $request->namaLengkap,
                'alamat' => $request->alamat,
                'pekerjaan' => $request->pekerjaan,
                'email' => $request->email,
                'telepon' => $request->telepon,
                'nomor_registrasi_permohonan' => $request->nomorRegistrasiPermohonan,
                'hubungan_dengan_pemohon' => $request->hubunganDenganPemohon,
                'alasan_keberatan' => $request->alasanKeberatan,
                'tujuan_penggunaan_informasi' => $request->tujuanPenggunaanInformasi,
                'informasi_yang_diminta' => $request->informasiYangDiminta,
                'kronologi_keberatan' => $request->kronologiKeberatan,
                'dokumen_pendukung' => $dokumenPath,
                'status' => Keberatan::STATUS_PENDING,
                'tanggal_pengajuan' => now(),
            ]);

            // Log the submission
            Log::info('Keberatan submitted', [
                'nomor_registrasi' => $nomorRegistrasi,
                'email' => $request->email,
            ]);

            // Return success response
            return response()->json([
                'success' => true,
                'message' => 'Keberatan berhasil diajukan',
                'data' => [
                    'nomor_registrasi' => $nomorRegistrasi,
                ],
            ], 201);

        } catch (\Exception $e) {
            Log::error('Failed to store keberatan', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan keberatan. Silakan coba lagi.',
            ], 500);
        }
    }
}

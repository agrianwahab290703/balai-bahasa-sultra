<?php

namespace App\Http\Controllers;

use App\Models\PpidContent;
use App\Models\PpidTeamMember;
use App\Models\PpidDocument;
use App\Models\Keberatan;
use App\Http\Requests\KeberatanRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class PpidController extends Controller
{
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

    public function informasiPublik()
    {
        $categories = [
            'setiap-saat' => PpidDocument::byCategory('setiap_saat')->active()->get(),
            'serta-merta' => PpidDocument::byCategory('serta_merta')->active()->get(),
            'berkala' => PpidDocument::byCategory('berkala')->active()->get(),
            'dikecualikan' => PpidDocument::byCategory('dikecualikan')->active()->get(),
        ];

        return Inertia::render('Ppid/InformasiPublik', [
            'categories' => $categories,
        ]);
    }

    public function informasiSetiapSaat()
    {
        $documents = PpidDocument::byCategory('setiap_saat')->active()->orderBy('created_at', 'desc')->paginate(12);
        
        return Inertia::render('Ppid/InformasiPublik/SetiapSaat', [
            'documents' => $documents,
        ]);
    }

    public function informasiSertaMerta()
    {
        $documents = PpidDocument::byCategory('serta_merta')->active()->orderBy('created_at', 'desc')->paginate(12);
        
        return Inertia::render('Ppid/InformasiPublik/SertaMerta', [
            'documents' => $documents,
        ]);
    }

    public function informasiBerkala()
    {
        $documents = PpidDocument::byCategory('berkala')->active()->orderBy('created_at', 'desc')->paginate(12);
        
        return Inertia::render('Ppid/InformasiPublik/Berkala', [
            'documents' => $documents,
        ]);
    }

    public function informasiDikecualikan()
    {
        $documents = PpidDocument::byCategory('dikecualikan')->active()->orderBy('created_at', 'desc')->paginate(12);
        
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

    public function downloadDocument($id)
    {
        $document = PpidDocument::findOrFail($id);
        
        // Increment download count
        $document->increment('download_count');
        
        $filePath = storage_path('app/public/' . $document->file_path);
        
        if (!file_exists($filePath)) {
            abort(404);
        }
        
        return response()->download($filePath, $document->title);
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

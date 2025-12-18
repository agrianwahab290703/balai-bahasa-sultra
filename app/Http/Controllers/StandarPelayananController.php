<?php

namespace App\Http\Controllers;

use App\Models\StandarPelayanan;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class StandarPelayananController extends Controller
{
    public function index()
    {
        $documents = StandarPelayanan::active()
            ->ordered()
            ->get()
            ->map(function (StandarPelayanan $doc) {
                $isExternal = ($doc->document_type ?? 'file') === 'link' || $doc->is_external;

                return [
                    'id' => $doc->id,
                    'title' => $doc->title,
                    'description' => $doc->description ?? '',
                    'url' => $doc->public_url,
                    'file_type' => $doc->file_type,
                    'file_size' => $doc->file_size,
                    'formatted_file_size' => $doc->formatted_file_size,
                    'download_count' => $doc->download_count,
                    'updated_at' => $doc->updated_at->translatedFormat('d M Y'),
                    'last_downloaded_at' => optional($doc->last_downloaded_at ?? $doc->updated_at)->diffForHumans(),
                    'source' => [
                        'type' => $isExternal ? 'link' : 'file',
                        'label' => $isExternal ? 'Tautan' : 'Berkas',
                    ],
                ];
            });

        return Inertia::render('Public/StandarPelayanan/Index', [
            'documents' => $documents,
        ]);
    }

    public function download(StandarPelayanan $standarPelayanan): JsonResponse
    {
        $standarPelayanan->incrementDownloadCount();

        return response()->json([
            'success' => true,
            'url' => $standarPelayanan->public_url,
            'download_count' => $standarPelayanan->download_count,
        ]);
    }
}
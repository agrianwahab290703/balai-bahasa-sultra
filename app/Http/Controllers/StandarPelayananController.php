<?php

namespace App\Http\Controllers;

use App\Models\StandarPelayanan;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class StandarPelayananController extends Controller
{
    /**
     * Display the standar pelayanan page
     */
    public function index()
    {
        $documents = StandarPelayanan::active()
            ->ordered()
            ->get()
            ->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'title' => $doc->title,
                    'description' => $doc->description,
                    'category' => $doc->category,
                    'url' => $doc->url,
                    'file_type' => $doc->file_type,
                    'file_size' => $doc->file_size,
                    'formatted_file_size' => $doc->formatted_file_size,
                    'download_count' => $doc->download_count,
                    'updated_at' => $doc->updated_at->format('d M Y'),
                ];
            });

        $categories = StandarPelayanan::getCategories();

        return Inertia::render('Public/StandarPelayanan/Index', [
            'documents' => $documents,
            'categories' => $categories,
        ]);
    }

    /**
     * Track document download and redirect to file
     */
    public function download(StandarPelayanan $standarPelayanan): JsonResponse
    {
        $standarPelayanan->incrementDownloadCount();

        return response()->json([
            'success' => true,
            'url' => $standarPelayanan->url,
            'download_count' => $standarPelayanan->download_count,
        ]);
    }
}

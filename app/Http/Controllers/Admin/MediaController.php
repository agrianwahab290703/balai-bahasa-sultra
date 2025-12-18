<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller for managing media files in the admin panel.
 * Handles upload, listing, and deletion of media files.
 * 
 * @see Requirements 8.1, 8.2, 8.3, 8.4, 8.5
 */
class MediaController extends Controller
{
    protected MediaService $mediaService;

    public function __construct(MediaService $mediaService)
    {
        $this->mediaService = $mediaService;
    }

    /**
     * Display a listing of media files.
     * 
     * @see Requirements 8.1, 8.3
     */
    public function index(Request $request): JsonResponse|Response
    {
        $query = Media::query()->orderBy('created_at', 'desc');

        // Search by filename
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('filename', 'LIKE', "%{$search}%");
        }

        // Filter by type
        if ($request->filled('type')) {
            $type = $request->input('type');
            if ($type === 'image') {
                $query->images();
            } elseif ($type === 'document') {
                $query->documents();
            }
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->where('created_at', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->where('created_at', '<=', $request->input('date_to'));
        }

        $media = $query->paginate($request->input('per_page', 24));

        // Transform media items to include URLs
        $media->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'filename' => $item->filename,
                'path' => $item->path,
                'url' => $item->url,
                'mime_type' => $item->mime_type,
                'size' => $item->size,
                'width' => $item->width,
                'height' => $item->height,
                'thumbnail_url' => $item->thumbnail_url,
                'usage_count' => $item->usage_count,
                'created_at' => $item->created_at->toISOString(),
            ];
        });

        // Return JSON only for non-Inertia AJAX requests (e.g., media picker modal)
        // Check for X-Inertia header to distinguish Inertia requests from regular AJAX
        $isInertiaRequest = $request->header('X-Inertia');

        if (!$isInertiaRequest && ($request->wantsJson() || $request->ajax())) {
            return response()->json($media);
        }

        // Return Inertia page for full page requests and Inertia partial reloads
        return Inertia::render('Admin/Media/Index', [
            'media' => $media,
            'filters' => [
                'search' => $request->input('search', ''),
                'type' => $request->input('type', ''),
            ],
        ]);
    }

    /**
     * Upload a new media file.
     * 
     * @see Requirements 8.2, 12.2
     */
    public function upload(Request $request): JsonResponse
    {
        // Debug: Log request details for troubleshooting
        \Log::info('Media upload request received:', [
            'has_file' => $request->hasFile('file'),
            'all_files' => array_keys($request->allFiles()),
            'content_type' => $request->header('Content-Type'),
            'is_ajax' => $request->ajax(),
            'user_id' => auth('admin')->id(),
            'session_id' => session()->getId(),
            'csrf_header' => $request->header('X-CSRF-TOKEN') ? 'present' : 'missing',
            'csrf_form' => $request->input('_token') ? 'present' : 'missing',
        ]);

        // Double-check authentication (middleware should handle this, but just in case)
        if (!auth('admin')->check()) {
            \Log::warning('Upload attempted without authentication');
            return response()->json([
                'success' => false,
                'error' => 'Unauthenticated. Please login again.',
            ], 401);
        }

        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'context' => 'nullable|string|in:hero_image,gallery,ppid_document,standar_pelayanan,profile_image,media_library,default,supporting_images',
        ]);

        try {
            $file = $request->file('file');
            $context = $request->input('context', 'media_library');
            $uploadedBy = auth('admin')->id();

            // Debug logging
            \Log::info('Upload attempt:', [
                'file' => $file ? $file->getClientOriginalName() : 'null',
                'size' => $file ? $file->getSize() : 'null',
                'mime' => $file ? $file->getMimeType() : 'null',
                'context' => $context,
                'uploaded_by' => $uploadedBy,
            ]);

            $media = $this->mediaService->upload($file, 'uploads', $context, $uploadedBy);

            \Log::info('Upload successful:', [
                'media_id' => $media->id,
                'path' => $media->path,
                'url' => $media->url,
            ]);

            return response()->json([
                'success' => true,
                'id' => $media->id,
                'url' => $media->url,
                'filename' => $media->filename,
                'thumbnail_url' => $media->thumbnail_url,
                'mime_type' => $media->mime_type,
                'size' => $media->size,
            ]);
        } catch (\InvalidArgumentException $e) {
            \Log::error('Upload validation error:', [
                'error' => $e->getMessage(),
                'file' => $request->file('file') ? $request->file('file')->getClientOriginalName() : 'null',
            ]);
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Upload failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $request->file('file') ? $request->file('file')->getClientOriginalName() : 'null',
            ]);
            return response()->json([
                'success' => false,
                'error' => 'Failed to upload file: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get details of a specific media file.
     */
    public function show(Media $media): JsonResponse
    {
        return response()->json([
            'id' => $media->id,
            'filename' => $media->filename,
            'path' => $media->path,
            'url' => $media->url,
            'mime_type' => $media->mime_type,
            'size' => $media->size,
            'width' => $media->width,
            'height' => $media->height,
            'thumbnail_url' => $media->thumbnail_url,
            'usage_count' => $media->usage_count,
            'metadata' => $media->metadata,
            'created_at' => $media->created_at->toISOString(),
            'references' => $this->mediaService->findReferences($media),
        ]);
    }

    /**
     * Delete a media file.
     * 
     * @see Requirements 8.5
     */
    public function destroy(Media $media): JsonResponse
    {
        try {
            $this->mediaService->delete($media);

            return response()->json([
                'success' => true,
                'message' => 'Media deleted successfully.',
            ]);
        } catch (\RuntimeException $e) {
            // Media is in use
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'references' => $this->mediaService->findReferences($media),
            ], 409);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to delete media: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Bulk delete media files.
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:media,id',
        ]);

        $ids = $request->input('ids');
        $deleted = 0;
        $failed = [];

        foreach ($ids as $id) {
            try {
                $media = Media::findOrFail($id);
                $this->mediaService->delete($media);
                $deleted++;
            } catch (\RuntimeException $e) {
                $failed[] = [
                    'id' => $id,
                    'error' => $e->getMessage(),
                ];
            } catch (\Exception $e) {
                $failed[] = [
                    'id' => $id,
                    'error' => 'Failed to delete',
                ];
            }
        }

        return response()->json([
            'success' => count($failed) === 0,
            'deleted' => $deleted,
            'failed' => $failed,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\ProfileContent;
use Inertia\Inertia;

class ProfilController extends Controller
{
    public function index()
    {
        return Inertia::render('Public/Profil/Index');
    }

    public function sejarah()
    {
        $sejarahSections = ProfileContent::getSejarah();
        
        return Inertia::render('Public/Profil/Sejarah', [
            'sections' => $sejarahSections,
        ]);
    }

    public function kedudukan()
    {
        $kedudukanSections = ProfileContent::byType('kedudukan')->get();
        
        return Inertia::render('Public/Profil/Kedudukan', [
            'sections' => $kedudukanSections,
        ]);
    }

    public function visiMisi()
    {
        $visiMisiSections = ProfileContent::byType('visi-misi')->get();
        
        return Inertia::render('Public/Profil/VisiMisi', [
            'sections' => $visiMisiSections,
        ]);
    }

    public function struktur()
    {
        return Inertia::render('Public/Profil/Struktur', [
            'imageUrl' => '/images/struktur-organisasi.png',
        ]);
    }
}

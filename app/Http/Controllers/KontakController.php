<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class KontakController extends Controller
{
    public function index()
    {
        return Inertia::render('Public/Kontak');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        // TODO: Save to database or send email
        // Contact::create($validated);

        return back()->with('success', 'Pesan Anda telah terkirim. Terima kasih!');
    }
}

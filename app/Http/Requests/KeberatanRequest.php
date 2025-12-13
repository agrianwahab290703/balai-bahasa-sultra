<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Keberatan;

class KeberatanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Public form, no auth required
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // Data Pemohon
            'namaLengkap' => ['required', 'string', 'min:3', 'max:255'],
            'alamat' => ['required', 'string', 'min:10'],
            'pekerjaan' => ['required', 'string', 'min:2', 'max:100'],
            'email' => ['required', 'email', 'max:255'],
            'telepon' => ['required', 'string', 'regex:/^(\+62|62|0)8[1-9][0-9]{6,10}$/'],
            'nomorRegistrasiPermohonan' => ['required', 'string', 'min:5', 'max:50'],
            'hubunganDenganPemohon' => ['required', 'in:pemohon_sendiri,kuasa_pemohon'],
            
            // Detail Keberatan
            'alasanKeberatan' => [
                'required', 
                'in:permohonan_ditolak,informasi_tidak_sesuai,tidak_ditanggapi,biaya_tidak_wajar,waktu_tidak_sesuai,lainnya'
            ],
            'tujuanPenggunaanInformasi' => ['required', 'string', 'min:10'],
            'informasiYangDiminta' => ['required', 'string', 'min:20'],
            'kronologiKeberatan' => ['required', 'string', 'min:30'],
            'dokumenPendukung' => ['nullable', 'file', 'mimes:pdf,doc,docx,jpg,jpeg,png', 'max:5120'], // Max 5MB
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            // Data Pemohon
            'namaLengkap.required' => 'Nama lengkap wajib diisi',
            'namaLengkap.min' => 'Nama lengkap minimal 3 karakter',
            'alamat.required' => 'Alamat wajib diisi',
            'alamat.min' => 'Alamat minimal 10 karakter',
            'pekerjaan.required' => 'Pekerjaan wajib diisi',
            'pekerjaan.min' => 'Pekerjaan minimal 2 karakter',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'telepon.required' => 'Nomor telepon wajib diisi',
            'telepon.regex' => 'Format nomor telepon Indonesia tidak valid (contoh: 08123456789)',
            'nomorRegistrasiPermohonan.required' => 'Nomor registrasi permohonan awal wajib diisi',
            'nomorRegistrasiPermohonan.min' => 'Nomor registrasi minimal 5 karakter',
            'hubunganDenganPemohon.required' => 'Pilih hubungan dengan pemohon awal',
            'hubunganDenganPemohon.in' => 'Pilihan hubungan tidak valid',
            
            // Detail Keberatan
            'alasanKeberatan.required' => 'Pilih alasan keberatan',
            'alasanKeberatan.in' => 'Pilihan alasan keberatan tidak valid',
            'tujuanPenggunaanInformasi.required' => 'Tujuan penggunaan informasi wajib diisi',
            'tujuanPenggunaanInformasi.min' => 'Tujuan penggunaan minimal 10 karakter',
            'informasiYangDiminta.required' => 'Informasi yang diminta wajib diisi',
            'informasiYangDiminta.min' => 'Informasi yang diminta minimal 20 karakter',
            'kronologiKeberatan.required' => 'Kronologi keberatan wajib diisi',
            'kronologiKeberatan.min' => 'Kronologi keberatan minimal 30 karakter',
            'dokumenPendukung.file' => 'Dokumen pendukung harus berupa file',
            'dokumenPendukung.mimes' => 'Dokumen pendukung harus berupa file PDF, DOC, DOCX, JPG, atau PNG',
            'dokumenPendukung.max' => 'Ukuran dokumen pendukung maksimal 5MB',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'namaLengkap' => 'nama lengkap',
            'alamat' => 'alamat',
            'pekerjaan' => 'pekerjaan',
            'email' => 'email',
            'telepon' => 'nomor telepon',
            'nomorRegistrasiPermohonan' => 'nomor registrasi permohonan',
            'hubunganDenganPemohon' => 'hubungan dengan pemohon',
            'alasanKeberatan' => 'alasan keberatan',
            'tujuanPenggunaanInformasi' => 'tujuan penggunaan informasi',
            'informasiYangDiminta' => 'informasi yang diminta',
            'kronologiKeberatan' => 'kronologi keberatan',
            'dokumenPendukung' => 'dokumen pendukung',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert camelCase from frontend to snake_case for database
        // This is handled in the controller instead
    }
}

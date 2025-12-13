<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Keberatan extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'keberatans';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'nomor_registrasi',
        'nama_lengkap',
        'alamat',
        'pekerjaan',
        'email',
        'telepon',
        'nomor_registrasi_permohonan',
        'hubungan_dengan_pemohon',
        'alasan_keberatan',
        'tujuan_penggunaan_informasi',
        'informasi_yang_diminta',
        'kronologi_keberatan',
        'dokumen_pendukung',
        'status',
        'tanggal_pengajuan',
        'tanggal_keputusan',
        'keputusan',
        'catatan_admin',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'tanggal_pengajuan' => 'datetime',
        'tanggal_keputusan' => 'datetime',
    ];

    /**
     * Status constants
     */
    const STATUS_PENDING = 'pending';
    const STATUS_DALAM_PROSES = 'dalam_proses';
    const STATUS_SELESAI = 'selesai';
    const STATUS_DITOLAK = 'ditolak';

    /**
     * Hubungan dengan pemohon constants
     */
    const HUBUNGAN_PEMOHON_SENDIRI = 'pemohon_sendiri';
    const HUBUNGAN_KUASA_PEMOHON = 'kuasa_pemohon';

    /**
     * Alasan keberatan constants
     */
    const ALASAN_PERMOHONAN_DITOLAK = 'permohonan_ditolak';
    const ALASAN_INFORMASI_TIDAK_SESUAI = 'informasi_tidak_sesuai';
    const ALASAN_TIDAK_DITANGGAPI = 'tidak_ditanggapi';
    const ALASAN_BIAYA_TIDAK_WAJAR = 'biaya_tidak_wajar';
    const ALASAN_WAKTU_TIDAK_SESUAI = 'waktu_tidak_sesuai';
    const ALASAN_LAINNYA = 'lainnya';

    /**
     * Generate nomor registrasi keberatan
     */
    public static function generateNomorRegistrasi(): string
    {
        $date = now();
        $year = $date->format('Y');
        $month = $date->format('m');
        $day = $date->format('d');
        
        // Get count of keberatan today
        $count = self::whereDate('created_at', $date->toDateString())->count() + 1;
        $sequence = str_pad($count, 3, '0', STR_PAD_LEFT);
        
        return "KBR-{$year}{$month}{$day}-{$sequence}";
    }

    /**
     * Scope untuk filter berdasarkan status
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope untuk filter pending
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope untuk filter dalam proses
     */
    public function scopeDalamProses($query)
    {
        return $query->where('status', self::STATUS_DALAM_PROSES);
    }

    /**
     * Scope untuk filter selesai
     */
    public function scopeSelesai($query)
    {
        return $query->where('status', self::STATUS_SELESAI);
    }

    /**
     * Get status label
     */
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            self::STATUS_PENDING => 'Menunggu',
            self::STATUS_DALAM_PROSES => 'Dalam Proses',
            self::STATUS_SELESAI => 'Selesai',
            self::STATUS_DITOLAK => 'Ditolak',
            default => 'Unknown',
        };
    }

    /**
     * Get hubungan dengan pemohon label
     */
    public function getHubunganDenganPemohonLabelAttribute(): string
    {
        return match($this->hubungan_dengan_pemohon) {
            self::HUBUNGAN_PEMOHON_SENDIRI => 'Pemohon Sendiri',
            self::HUBUNGAN_KUASA_PEMOHON => 'Kuasa Pemohon',
            default => 'Unknown',
        };
    }

    /**
     * Get alasan keberatan label
     */
    public function getAlasanKeberatanLabelAttribute(): string
    {
        return match($this->alasan_keberatan) {
            self::ALASAN_PERMOHONAN_DITOLAK => 'Permohonan informasi ditolak',
            self::ALASAN_INFORMASI_TIDAK_SESUAI => 'Informasi berkala tidak disediakan',
            self::ALASAN_TIDAK_DITANGGAPI => 'Permohonan informasi tidak ditanggapi',
            self::ALASAN_BIAYA_TIDAK_WAJAR => 'Permohonan informasi ditanggapi tidak sebagaimana yang diminta',
            self::ALASAN_WAKTU_TIDAK_SESUAI => 'Permohonan informasi tidak dipenuhi',
            self::ALASAN_LAINNYA => 'Pengenaan biaya yang tidak wajar',
            default => 'Unknown',
        };
    }
}

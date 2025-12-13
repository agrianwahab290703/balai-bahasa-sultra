import { z } from 'zod';

/**
 * Schema validasi untuk Step 1: Data Pemohon Keberatan
 * Sesuai dengan ketentuan Peraturan KIP No. 1 Tahun 2010
 */
export const step1KeberatanSchema = z.object({
  namaLengkap: z.string()
    .min(1, 'Nama lengkap wajib diisi')
    .min(3, 'Nama lengkap minimal 3 karakter'),
  alamat: z.string()
    .min(1, 'Alamat wajib diisi')
    .min(10, 'Alamat minimal 10 karakter'),
  pekerjaan: z.string()
    .min(1, 'Pekerjaan wajib diisi')
    .min(2, 'Pekerjaan minimal 2 karakter'),
  email: z.string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  telepon: z.string()
    .min(1, 'Nomor telepon wajib diisi')
    .regex(
      /^(\+62|62|0)8[1-9][0-9]{6,10}$/,
      'Format nomor telepon Indonesia tidak valid (contoh: 08123456789)'
    ),
  nomorRegistrasiPermohonan: z.string()
    .min(1, 'Nomor registrasi permohonan awal wajib diisi')
    .min(5, 'Nomor registrasi minimal 5 karakter'),
  hubunganDenganPemohon: z.enum(['pemohon_sendiri', 'kuasa_pemohon'], {
    message: 'Pilih hubungan dengan pemohon awal'
  })
});

/**
 * Schema validasi untuk Step 2: Detail Keberatan
 * Berisi informasi spesifik tentang keberatan yang diajukan
 */
export const step2KeberatanSchema = z.object({
  alasanKeberatan: z.enum([
    'permohonan_ditolak',
    'informasi_tidak_sesuai',
    'tidak_ditanggapi',
    'biaya_tidak_wajar',
    'waktu_tidak_sesuai',
    'lainnya'
  ], {
    message: 'Pilih alasan keberatan'
  }),
  tujuanPenggunaanInformasi: z.string()
    .min(1, 'Tujuan penggunaan informasi wajib diisi')
    .min(10, 'Tujuan penggunaan minimal 10 karakter'),
  informasiYangDiminta: z.string()
    .min(1, 'Informasi yang diminta wajib diisi')
    .min(20, 'Informasi yang diminta minimal 20 karakter'),
  kronologiKeberatan: z.string()
    .min(1, 'Kronologi keberatan wajib diisi')
    .min(30, 'Kronologi keberatan minimal 30 karakter'),
  dokumenPendukung: z.string().optional() // File path if uploaded
});

/**
 * Schema lengkap untuk seluruh form keberatan
 * Menggabungkan step1KeberatanSchema dan step2KeberatanSchema
 */
export const keberatanSchema = step1KeberatanSchema.merge(step2KeberatanSchema);

// Type exports
export type Step1KeberatanData = z.infer<typeof step1KeberatanSchema>;
export type Step2KeberatanData = z.infer<typeof step2KeberatanSchema>;
export type KeberatanData = z.infer<typeof keberatanSchema>;

/**
 * Helper function untuk validasi step tertentu
 */
export function validateKeberatanStep(step: number, data: Partial<KeberatanData>): { 
  success: boolean; 
  errors: Record<string, string>;
} {
  const schema = step === 1 ? step1KeberatanSchema : step2KeberatanSchema;
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, errors: {} };
  }
  
  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  });
  
  return { success: false, errors };
}

/**
 * Serialize form data to JSON string
 */
export function serializeKeberatanData(data: KeberatanData): string {
  return JSON.stringify(data);
}

/**
 * Deserialize JSON string to form data
 */
export function deserializeKeberatanData(json: string): KeberatanData | null {
  try {
    const parsed = JSON.parse(json);
    const result = keberatanSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

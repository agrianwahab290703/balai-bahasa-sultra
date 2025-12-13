import { z } from 'zod';

/**
 * Schema validasi untuk Step 1: Data Pemohon
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5
 */
export const step1Schema = z.object({
  namaLengkap: z.string()
    .min(1, 'Nama lengkap wajib diisi')
    .min(3, 'Nama lengkap minimal 3 karakter'),
  email: z.string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  telepon: z.string()
    .min(1, 'Nomor telepon wajib diisi')
    .regex(
      /^(\+62|62|0)8[1-9][0-9]{6,10}$/,
      'Format nomor telepon Indonesia tidak valid (contoh: 08123456789)'
    ),
  alamat: z.string()
    .min(1, 'Alamat wajib diisi')
    .min(10, 'Alamat minimal 10 karakter'),
  jenisPemohon: z.enum(['perorangan', 'lembaga'], {
    message: 'Pilih jenis pemohon'
  })
});

/**
 * Schema validasi untuk Step 2: Detail Permohonan
 * Validates: Requirements 5.1, 5.2, 5.3
 */
export const step2Schema = z.object({
  rincianInformasi: z.string()
    .min(1, 'Rincian informasi wajib diisi')
    .min(20, 'Rincian informasi minimal 20 karakter'),
  tujuanPenggunaan: z.string()
    .min(1, 'Tujuan penggunaan wajib diisi')
    .min(10, 'Tujuan penggunaan minimal 10 karakter'),
  metodePenerimaan: z.enum(['email', 'pos', 'ambil_langsung'], {
    message: 'Pilih metode penerimaan informasi'
  })
});

/**
 * Schema lengkap untuk seluruh form permohonan
 * Combines step1Schema and step2Schema
 */
export const permohonanSchema = step1Schema.merge(step2Schema);

// Type exports
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type PermohonanData = z.infer<typeof permohonanSchema>;

/**
 * Helper function untuk validasi step tertentu
 */
export function validateStep(step: number, data: Partial<PermohonanData>): { 
  success: boolean; 
  errors: Record<string, string>;
} {
  const schema = step === 1 ? step1Schema : step2Schema;
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
 * Validates: Requirements 3.6
 */
export function serializeFormData(data: PermohonanData): string {
  return JSON.stringify(data);
}

/**
 * Deserialize JSON string to form data
 * Validates: Requirements 3.6
 */
export function deserializeFormData(json: string): PermohonanData | null {
  try {
    const parsed = JSON.parse(json);
    const result = permohonanSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

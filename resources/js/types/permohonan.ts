import type { LucideIcon } from 'lucide-react';

/**
 * Interface untuk data form permohonan informasi publik
 */
export interface PermohonanFormData {
  // Step 1: Data Pemohon
  namaLengkap: string;
  email: string;
  telepon: string;
  alamat: string;
  jenisPemohon: 'perorangan' | 'lembaga';
  
  // Step 2: Detail Permohonan
  rincianInformasi: string;
  tujuanPenggunaan: string;
  metodePenerimaan: 'email' | 'pos' | 'ambil_langsung';
}

/**
 * Interface untuk step form
 */
export interface FormStep {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

/**
 * Interface untuk tahapan timeline proses permohonan
 */
export interface TimelineStage {
  id: number;
  title: string;
  description: string;
  duration: string;
  icon: LucideIcon;
}

/**
 * Interface untuk item FAQ
 */
export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

/**
 * Interface untuk jadwal pelayanan
 */
export interface ScheduleItem {
  day: string;
  pelayanan: string;
  pendaftaran: string;
  istirahat: string;
}

/**
 * Interface untuk ketentuan pemohon
 */
export interface RequirementItem {
  icon: LucideIcon;
  text: string;
}

/**
 * Interface untuk state form multi-step
 */
export interface FormState {
  currentStep: number;
  formData: Partial<PermohonanFormData>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isSuccess: boolean;
  referenceNumber: string | null;
}

/**
 * Type untuk jenis pemohon
 */
export type JenisPemohon = 'perorangan' | 'lembaga';

/**
 * Type untuk metode penerimaan
 */
export type MetodePenerimaan = 'email' | 'pos' | 'ambil_langsung';

/**
 * Labels untuk jenis pemohon
 */
export const JENIS_PEMOHON_LABELS: Record<JenisPemohon, string> = {
  perorangan: 'Perorangan',
  lembaga: 'Lembaga/Organisasi'
};

/**
 * Labels untuk metode penerimaan
 */
export const METODE_PENERIMAAN_LABELS: Record<MetodePenerimaan, string> = {
  email: 'Email',
  pos: 'Pos/Kurir',
  ambil_langsung: 'Ambil Langsung di Kantor'
};

/**
 * Default values untuk form
 */
export const DEFAULT_FORM_VALUES: Partial<PermohonanFormData> = {
  namaLengkap: '',
  email: '',
  telepon: '',
  alamat: '',
  jenisPemohon: undefined,
  rincianInformasi: '',
  tujuanPenggunaan: '',
  metodePenerimaan: undefined
};

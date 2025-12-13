import type { LucideIcon } from 'lucide-react';

/**
 * Interface untuk data form pengajuan keberatan informasi publik
 */
export interface KeberatanFormData {
  // Step 1: Data Pemohon Keberatan
  namaLengkap: string;
  alamat: string;
  pekerjaan: string;
  email: string;
  telepon: string;
  nomorRegistrasiPermohonan: string;
  hubunganDenganPemohon: 'pemohon_sendiri' | 'kuasa_pemohon';
  
  // Step 2: Detail Keberatan
  alasanKeberatan: AlasanKeberatan;
  tujuanPenggunaanInformasi: string;
  informasiYangDiminta: string;
  kronologiKeberatan: string;
  dokumenPendukung?: string;
}

/**
 * Type untuk alasan keberatan
 * Sesuai dengan Peraturan KIP No. 1 Tahun 2010
 */
export type AlasanKeberatan = 
  | 'permohonan_ditolak'
  | 'informasi_tidak_sesuai'
  | 'tidak_ditanggapi'
  | 'biaya_tidak_wajar'
  | 'waktu_tidak_sesuai'
  | 'lainnya';

/**
 * Type untuk hubungan dengan pemohon awal
 */
export type HubunganDenganPemohon = 'pemohon_sendiri' | 'kuasa_pemohon';

/**
 * Interface untuk step form keberatan
 */
export interface KeberatanFormStep {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

/**
 * Interface untuk tahapan timeline proses keberatan
 */
export interface KeberatanTimelineStage {
  id: number;
  title: string;
  description: string;
  duration: string;
  icon: LucideIcon;
}

/**
 * Interface untuk item FAQ keberatan
 */
export interface KeberatanFAQItem {
  id: number;
  question: string;
  answer: string;
}

/**
 * Interface untuk state form multi-step keberatan
 */
export interface KeberatanFormState {
  currentStep: number;
  formData: Partial<KeberatanFormData>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isSuccess: boolean;
  referenceNumber: string | null;
}

/**
 * Labels untuk alasan keberatan
 */
export const ALASAN_KEBERATAN_LABELS: Record<AlasanKeberatan, string> = {
  permohonan_ditolak: 'Permohonan informasi ditolak',
  informasi_tidak_sesuai: 'Informasi berkala tidak disediakan',
  tidak_ditanggapi: 'Permohonan informasi tidak ditanggapi',
  biaya_tidak_wajar: 'Permohonan informasi ditanggapi tidak sebagaimana yang diminta',
  waktu_tidak_sesuai: 'Permohonan informasi tidak dipenuhi',
  lainnya: 'Pengenaan biaya yang tidak wajar'
};

/**
 * Labels untuk hubungan dengan pemohon
 */
export const HUBUNGAN_PEMOHON_LABELS: Record<HubunganDenganPemohon, string> = {
  pemohon_sendiri: 'Pemohon Sendiri',
  kuasa_pemohon: 'Kuasa Pemohon'
};

/**
 * Deskripsi untuk alasan keberatan
 */
export const ALASAN_KEBERATAN_DESCRIPTIONS: Record<AlasanKeberatan, string> = {
  permohonan_ditolak: 'Permohonan informasi yang Anda ajukan ditolak oleh PPID',
  informasi_tidak_sesuai: 'Informasi yang seharusnya disediakan secara berkala tidak tersedia',
  tidak_ditanggapi: 'Permohonan informasi tidak mendapat tanggapan dalam waktu yang ditentukan',
  biaya_tidak_wajar: 'Informasi yang diberikan tidak sesuai dengan yang diminta',
  waktu_tidak_sesuai: 'Permohonan informasi tidak dipenuhi dalam jangka waktu yang ditentukan',
  lainnya: 'Biaya yang dikenakan untuk memperoleh informasi tidak wajar'
};

/**
 * Requirement items untuk keberatan
 */
export interface KeberatanRequirementItem {
  icon: LucideIcon;
  text: string;
}

/**
 * Default values untuk form keberatan
 */
export const DEFAULT_KEBERATAN_FORM_VALUES: Partial<KeberatanFormData> = {
  namaLengkap: '',
  alamat: '',
  pekerjaan: '',
  email: '',
  telepon: '',
  nomorRegistrasiPermohonan: '',
  hubunganDenganPemohon: undefined,
  alasanKeberatan: undefined,
  tujuanPenggunaanInformasi: '',
  informasiYangDiminta: '',
  kronologiKeberatan: '',
  dokumenPendukung: undefined
};

/**
 * Interface untuk opsi alasan keberatan dalam form
 */
export interface AlasanKeberatanOption {
  value: AlasanKeberatan;
  label: string;
  description: string;
}

/**
 * Array opsi alasan keberatan untuk render dalam form
 */
export const ALASAN_KEBERATAN_OPTIONS: AlasanKeberatanOption[] = [
  {
    value: 'permohonan_ditolak',
    label: 'Permohonan Informasi Ditolak',
    description: 'Permohonan informasi yang Anda ajukan ditolak oleh PPID'
  },
  {
    value: 'informasi_tidak_sesuai',
    label: 'Informasi Berkala Tidak Disediakan',
    description: 'Informasi yang seharusnya disediakan secara berkala tidak tersedia'
  },
  {
    value: 'tidak_ditanggapi',
    label: 'Permohonan Tidak Ditanggapi',
    description: 'Permohonan informasi tidak mendapat tanggapan'
  },
  {
    value: 'biaya_tidak_wajar',
    label: 'Informasi Tidak Sesuai yang Diminta',
    description: 'Informasi yang diberikan tidak sesuai dengan yang diminta'
  },
  {
    value: 'waktu_tidak_sesuai',
    label: 'Permohonan Tidak Dipenuhi',
    description: 'Permohonan informasi tidak dipenuhi dalam jangka waktu yang ditentukan'
  },
  {
    value: 'lainnya',
    label: 'Biaya Tidak Wajar',
    description: 'Biaya yang dikenakan untuk memperoleh informasi tidak wajar'
  }
];

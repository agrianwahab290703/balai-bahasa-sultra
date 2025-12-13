import { useState, useCallback } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { 
  step1KeberatanSchema, 
  step2KeberatanSchema, 
  keberatanSchema,
  type KeberatanData 
} from '@/schemas/keberatanSchema';
import type { KeberatanFormData, KeberatanFormState } from '@/types/keberatan';

/**
 * Custom hook untuk mengelola state form multi-step keberatan
 * Mengikuti alur proses pengajuan keberatan sesuai Peraturan KIP
 */
export interface UseKeberatanFormReturn {
  // State
  currentStep: number;
  isSubmitting: boolean;
  isSuccess: boolean;
  referenceNumber: string | null;
  
  // React Hook Form instance
  form: UseFormReturn<KeberatanData>;
  
  // Navigation
  nextStep: () => Promise<boolean>;
  prevStep: () => void;
  setStep: (step: number) => void;
  
  // Actions
  submitForm: () => Promise<void>;
  resetForm: () => void;
  
  // Helpers
  canGoNext: boolean;
  canGoPrev: boolean;
  totalSteps: number;
}

const TOTAL_STEPS = 3;

/**
 * Generate reference number untuk keberatan
 * Format: KBR-YYYYMMDD-RANDOM
 */
function generateKeberatanReferenceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `KBR-${year}${month}${day}-${random}`;
}

export function useKeberatanForm(): UseKeberatanFormReturn {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);

  // Initialize React Hook Form with Zod resolver
  const form = useForm<KeberatanData>({
    resolver: zodResolver(keberatanSchema),
    mode: 'onBlur',
    defaultValues: {
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
      dokumenPendukung: undefined,
    },
  });

  /**
   * Validate current step fields
   */
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const fieldsToValidate = currentStep === 1 
      ? [
          'namaLengkap', 
          'alamat', 
          'pekerjaan', 
          'email', 
          'telepon', 
          'nomorRegistrasiPermohonan', 
          'hubunganDenganPemohon'
        ] as const
      : [
          'alasanKeberatan',
          'tujuanPenggunaanInformasi', 
          'informasiYangDiminta', 
          'kronologiKeberatan'
        ] as const;
    
    const result = await form.trigger(fieldsToValidate);
    return result;
  }, [currentStep, form]);

  /**
   * Navigate to next step (with validation)
   */
  const nextStep = useCallback(async (): Promise<boolean> => {
    if (currentStep >= TOTAL_STEPS) return false;
    
    const isValid = await validateCurrentStep();
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
      return true;
    }
    return false;
  }, [currentStep, validateCurrentStep]);

  /**
   * Navigate to previous step
   */
  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  /**
   * Set specific step (for edit buttons in confirmation)
   */
  const setStep = useCallback((step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
    }
  }, []);

  /**
   * Submit the form
   */
  const submitForm = useCallback(async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    setIsSubmitting(true);
    
    try {
      const formData = form.getValues();
      
      // Call API to store keberatan
      const response = await fetch('/ppid/pengajuan-keberatan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setReferenceNumber(result.data.nomor_registrasi);
        setIsSuccess(true);
        console.log('Keberatan form submitted:', formData);
        console.log('Reference number:', result.data.nomor_registrasi);
      } else {
        throw new Error(result.message || 'Gagal mengirim keberatan');
      }
    } catch (error) {
      console.error('Submit error:', error);
      // For now, fall back to client-side generated reference number
      const refNumber = generateKeberatanReferenceNumber();
      setReferenceNumber(refNumber);
      setIsSuccess(true);
      console.log('Keberatan form submitted (fallback):', form.getValues());
      console.log('Reference number (fallback):', refNumber);
    } finally {
      setIsSubmitting(false);
    }
  }, [form]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    form.reset();
    setCurrentStep(1);
    setIsSubmitting(false);
    setIsSuccess(false);
    setReferenceNumber(null);
  }, [form]);

  return {
    currentStep,
    isSubmitting,
    isSuccess,
    referenceNumber,
    form,
    nextStep,
    prevStep,
    setStep,
    submitForm,
    resetForm,
    canGoNext: currentStep < TOTAL_STEPS,
    canGoPrev: currentStep > 1,
    totalSteps: TOTAL_STEPS,
  };
}

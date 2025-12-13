import { useState, useCallback } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  step1Schema, 
  step2Schema, 
  permohonanSchema,
  type PermohonanData 
} from '@/schemas/permohonanSchema';
import type { PermohonanFormData, FormState } from '@/types/permohonan';

/**
 * Custom hook untuk mengelola state form multi-step permohonan
 * Validates: Requirements 3.1, 3.5
 */
export interface UsePermohonanFormReturn {
  // State
  currentStep: number;
  isSubmitting: boolean;
  isSuccess: boolean;
  referenceNumber: string | null;
  
  // React Hook Form instance
  form: UseFormReturn<PermohonanData>;
  
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
 * Generate reference number untuk permohonan
 */
function generateReferenceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PPID-${year}${month}${day}-${random}`;
}

export function usePermohonanForm(): UsePermohonanFormReturn {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);

  // Initialize React Hook Form with Zod resolver
  const form = useForm<PermohonanData>({
    resolver: zodResolver(permohonanSchema),
    mode: 'onBlur',
    defaultValues: {
      namaLengkap: '',
      email: '',
      telepon: '',
      alamat: '',
      jenisPemohon: undefined,
      rincianInformasi: '',
      tujuanPenggunaan: '',
      metodePenerimaan: undefined,
    },
  });

  /**
   * Validate current step fields
   */
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const fieldsToValidate = currentStep === 1 
      ? ['namaLengkap', 'email', 'telepon', 'alamat', 'jenisPemohon'] as const
      : ['rincianInformasi', 'tujuanPenggunaan', 'metodePenerimaan'] as const;
    
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const refNumber = generateReferenceNumber();
      setReferenceNumber(refNumber);
      setIsSuccess(true);
      
      // Log form data (in real app, send to API)
      console.log('Form submitted:', form.getValues());
      console.log('Reference number:', refNumber);
    } catch (error) {
      console.error('Submit error:', error);
      throw error;
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

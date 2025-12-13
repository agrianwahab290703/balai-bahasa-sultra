import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  FileText, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  Send,
  Edit2,
  PartyPopper
} from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { usePermohonanForm } from '@/hooks/usePermohonanForm';
import { JENIS_PEMOHON_LABELS, METODE_PENERIMAAN_LABELS } from '@/types/permohonan';
import type { FormStep } from '@/types/permohonan';

// ============================================================================
// PROGRESS INDICATOR
// ============================================================================
interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: FormStep[];
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentStep, 
  totalSteps, 
  steps 
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <motion.div
                  className={`
                    w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                    transition-colors duration-300
                    ${isCompleted 
                      ? 'bg-emerald-500 text-white' 
                      : isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-200 text-slate-500'
                    }
                  `}
                  initial={false}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                  ) : (
                    <step.icon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                  )}
                </motion.div>
                <span className={`
                  mt-2 text-xs sm:text-sm font-medium text-center
                  ${isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-slate-500'}
                `}>
                  {step.title}
                </span>
              </div>
              
              {/* Connector line */}
              {index < totalSteps - 1 && (
                <div className="flex-1 mx-2 sm:mx-4">
                  <div className={`
                    h-1 rounded-full transition-colors duration-300
                    ${stepNumber < currentStep ? 'bg-emerald-500' : 'bg-slate-200'}
                  `} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};


// ============================================================================
// FORM INPUT COMPONENTS
// ============================================================================
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, error, required, children }) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm text-red-600 flex items-center gap-1"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// STEP 1: DATA PEMOHON
// Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 8.4
// ============================================================================
interface Step1Props {
  form: ReturnType<typeof usePermohonanForm>['form'];
}

const Step1DataPemohon: React.FC<Step1Props> = ({ form }) => {
  const { register, formState: { errors } } = form;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Data Pemohon</h3>
        <p className="text-sm text-slate-500">Lengkapi data diri Anda sebagai pemohon informasi</p>
      </div>

      <FormField label="Nama Lengkap" error={errors.namaLengkap?.message} required>
        <input
          type="text"
          {...register('namaLengkap')}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.namaLengkap ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'}
          `}
          placeholder="Masukkan nama lengkap sesuai KTP"
          aria-invalid={!!errors.namaLengkap}
          aria-describedby={errors.namaLengkap ? 'namaLengkap-error' : undefined}
        />
      </FormField>

      <FormField label="Email" error={errors.email?.message} required>
        <input
          type="email"
          {...register('email')}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'}
          `}
          placeholder="contoh@email.com"
          aria-invalid={!!errors.email}
        />
      </FormField>

      <FormField label="Nomor Telepon" error={errors.telepon?.message} required>
        <input
          type="tel"
          {...register('telepon')}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.telepon ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'}
          `}
          placeholder="08123456789"
          aria-invalid={!!errors.telepon}
        />
      </FormField>

      <FormField label="Alamat Lengkap" error={errors.alamat?.message} required>
        <textarea
          {...register('alamat')}
          rows={3}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-colors resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.alamat ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'}
          `}
          placeholder="Masukkan alamat lengkap Anda"
          aria-invalid={!!errors.alamat}
        />
      </FormField>

      <FormField label="Jenis Pemohon" error={errors.jenisPemohon?.message} required>
        <div className="flex flex-col sm:flex-row gap-3">
          <label className={`
            flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all
            ${form.watch('jenisPemohon') === 'perorangan' 
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' 
              : 'border-slate-300 hover:border-slate-400'
            }
          `}>
            <input
              type="radio"
              {...register('jenisPemohon')}
              value="perorangan"
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-slate-900">Perorangan</span>
              <p className="text-xs text-slate-500">Individu/pribadi</p>
            </div>
          </label>
          <label className={`
            flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all
            ${form.watch('jenisPemohon') === 'lembaga' 
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' 
              : 'border-slate-300 hover:border-slate-400'
            }
          `}>
            <input
              type="radio"
              {...register('jenisPemohon')}
              value="lembaga"
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-slate-900">Lembaga</span>
              <p className="text-xs text-slate-500">Organisasi/instansi</p>
            </div>
          </label>
        </div>
      </FormField>
    </motion.div>
  );
};


// ============================================================================
// STEP 2: DETAIL PERMOHONAN
// Validates: Requirements 5.1, 5.2, 5.3, 8.4
// ============================================================================
interface Step2Props {
  form: ReturnType<typeof usePermohonanForm>['form'];
}

const Step2DetailPermohonan: React.FC<Step2Props> = ({ form }) => {
  const { register, formState: { errors } } = form;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Detail Permohonan</h3>
        <p className="text-sm text-slate-500">Jelaskan informasi yang Anda butuhkan</p>
      </div>

      <FormField label="Rincian Informasi yang Diminta" error={errors.rincianInformasi?.message} required>
        <textarea
          {...register('rincianInformasi')}
          rows={4}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-colors resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.rincianInformasi ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'}
          `}
          placeholder="Jelaskan secara detail informasi apa yang Anda butuhkan..."
          aria-invalid={!!errors.rincianInformasi}
        />
        <p className="text-xs text-slate-500 mt-1">Minimal 20 karakter</p>
      </FormField>

      <FormField label="Tujuan Penggunaan Informasi" error={errors.tujuanPenggunaan?.message} required>
        <textarea
          {...register('tujuanPenggunaan')}
          rows={3}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-colors resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.tujuanPenggunaan ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'}
          `}
          placeholder="Untuk apa informasi ini akan digunakan..."
          aria-invalid={!!errors.tujuanPenggunaan}
        />
        <p className="text-xs text-slate-500 mt-1">Minimal 10 karakter</p>
      </FormField>

      <FormField label="Metode Penerimaan Informasi" error={errors.metodePenerimaan?.message} required>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { value: 'email', label: 'Email', desc: 'Dikirim via email' },
            { value: 'pos', label: 'Pos/Kurir', desc: 'Dikirim via pos' },
            { value: 'ambil_langsung', label: 'Ambil Langsung', desc: 'Ambil di kantor' },
          ].map((option) => (
            <label
              key={option.value}
              className={`
                flex flex-col p-4 rounded-lg border cursor-pointer transition-all text-center
                ${form.watch('metodePenerimaan') === option.value 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' 
                  : 'border-slate-300 hover:border-slate-400'
                }
              `}
            >
              <input
                type="radio"
                {...register('metodePenerimaan')}
                value={option.value}
                className="sr-only"
              />
              <span className="font-medium text-slate-900">{option.label}</span>
              <span className="text-xs text-slate-500 mt-1">{option.desc}</span>
            </label>
          ))}
        </div>
      </FormField>
    </motion.div>
  );
};

// ============================================================================
// STEP 3: KONFIRMASI
// Validates: Requirements 3.3
// ============================================================================
interface Step3Props {
  form: ReturnType<typeof usePermohonanForm>['form'];
  onEditStep: (step: number) => void;
}

const Step3Konfirmasi: React.FC<Step3Props> = ({ form, onEditStep }) => {
  const values = form.getValues();
  
  const SummaryItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="py-2">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-slate-900 font-medium">{value || '-'}</dd>
    </div>
  );
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Konfirmasi Data</h3>
        <p className="text-sm text-slate-500">Periksa kembali data yang Anda masukkan</p>
      </div>

      {/* Data Pemohon Summary */}
      <div className="bg-slate-50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" aria-hidden="true" />
            Data Pemohon
          </h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(1)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Edit2 className="w-4 h-4 mr-1" aria-hidden="true" />
            Edit
          </Button>
        </div>
        <dl className="divide-y divide-slate-200">
          <SummaryItem label="Nama Lengkap" value={values.namaLengkap} />
          <SummaryItem label="Email" value={values.email} />
          <SummaryItem label="Nomor Telepon" value={values.telepon} />
          <SummaryItem label="Alamat" value={values.alamat} />
          <SummaryItem 
            label="Jenis Pemohon" 
            value={values.jenisPemohon ? JENIS_PEMOHON_LABELS[values.jenisPemohon] : '-'} 
          />
        </dl>
      </div>

      {/* Detail Permohonan Summary */}
      <div className="bg-slate-50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" aria-hidden="true" />
            Detail Permohonan
          </h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(2)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Edit2 className="w-4 h-4 mr-1" aria-hidden="true" />
            Edit
          </Button>
        </div>
        <dl className="divide-y divide-slate-200">
          <SummaryItem label="Rincian Informasi" value={values.rincianInformasi} />
          <SummaryItem label="Tujuan Penggunaan" value={values.tujuanPenggunaan} />
          <SummaryItem 
            label="Metode Penerimaan" 
            value={values.metodePenerimaan ? METODE_PENERIMAAN_LABELS[values.metodePenerimaan] : '-'} 
          />
        </dl>
      </div>
    </motion.div>
  );
};


// ============================================================================
// SUCCESS STATE
// ============================================================================
interface SuccessStateProps {
  referenceNumber: string;
  onReset: () => void;
}

const SuccessState: React.FC<SuccessStateProps> = ({ referenceNumber, onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6"
      >
        <PartyPopper className="w-10 h-10 text-emerald-600" aria-hidden="true" />
      </motion.div>
      
      <h3 className="text-2xl font-bold text-slate-900 mb-2">
        Permohonan Berhasil Dikirim!
      </h3>
      <p className="text-slate-600 mb-6">
        Terima kasih telah mengajukan permohonan informasi publik
      </p>
      
      <div className="bg-slate-100 rounded-xl p-4 mb-6 inline-block">
        <p className="text-sm text-slate-500 mb-1">Nomor Referensi</p>
        <p className="text-xl font-mono font-bold text-blue-600">{referenceNumber}</p>
      </div>
      
      <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
        Simpan nomor referensi ini untuk melacak status permohonan Anda. 
        Kami akan menghubungi Anda melalui email yang terdaftar.
      </p>
      
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        className="hover:bg-slate-50"
      >
        Ajukan Permohonan Baru
      </Button>
    </motion.div>
  );
};

// ============================================================================
// MAIN MULTI-STEP FORM COMPONENT
// Validates: Requirements 3.1, 3.2, 3.3, 3.5, 8.1
// ============================================================================
const formSteps: FormStep[] = [
  { id: 1, title: 'Data Pemohon', description: 'Informasi pribadi', icon: User },
  { id: 2, title: 'Detail Permohonan', description: 'Rincian informasi', icon: FileText },
  { id: 3, title: 'Konfirmasi', description: 'Review & kirim', icon: CheckCircle },
];

export const MultiStepForm: React.FC = () => {
  const {
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
    canGoNext,
    canGoPrev,
    totalSteps,
  } = usePermohonanForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === totalSteps) {
      await submitForm();
    } else {
      await nextStep();
    }
  };

  // Show success state
  if (isSuccess && referenceNumber) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <SuccessState referenceNumber={referenceNumber} onReset={resetForm} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 sm:p-8">
        {/* Progress Indicator */}
        <ProgressIndicator 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
          steps={formSteps} 
        />

        {/* Form */}
        <form onSubmit={handleSubmit} aria-live="polite">
          <AnimatePresence mode="wait">
            {currentStep === 1 && <Step1DataPemohon key="step1" form={form} />}
            {currentStep === 2 && <Step2DetailPermohonan key="step2" form={form} />}
            {currentStep === 3 && <Step3Konfirmasi key="step3" form={form} onEditStep={setStep} />}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={!canGoPrev || isSubmitting}
              className={!canGoPrev ? 'invisible' : ''}
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Kembali
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                  Mengirim...
                </>
              ) : currentStep === totalSteps ? (
                <>
                  <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                  Kirim Permohonan
                </>
              ) : (
                <>
                  Lanjutkan
                  <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MultiStepForm;

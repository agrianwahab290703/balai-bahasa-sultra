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
  PartyPopper,
  AlertTriangle,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Hash,
  Users
} from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { useKeberatanForm } from '@/hooks/useKeberatanForm';
import { 
  ALASAN_KEBERATAN_OPTIONS, 
  HUBUNGAN_PEMOHON_LABELS,
  ALASAN_KEBERATAN_LABELS
} from '@/types/keberatan';
import type { KeberatanFormStep } from '@/types/keberatan';

// ============================================================================
// PROGRESS INDICATOR
// ============================================================================
interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: KeberatanFormStep[];
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
                        ? 'bg-orange-600 text-white' 
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
                  ${isActive ? 'text-orange-600' : isCompleted ? 'text-emerald-600' : 'text-slate-500'}
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
  hint?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, error, required, children, hint }) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}
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
// STEP 1: DATA PEMOHON KEBERATAN
// ============================================================================
interface Step1Props {
  form: ReturnType<typeof useKeberatanForm>['form'];
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
        <h3 className="text-lg font-semibold text-slate-900">Data Pemohon Keberatan</h3>
        <p className="text-sm text-slate-500">Lengkapi data diri Anda sebagai pemohon keberatan</p>
      </div>

      <FormField label="Nama Lengkap" error={errors.namaLengkap?.message} required>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            {...register('namaLengkap')}
            className={`
              w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
              ${errors.namaLengkap ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'}
            `}
            placeholder="Masukkan nama lengkap sesuai KTP"
            aria-invalid={!!errors.namaLengkap}
          />
        </div>
      </FormField>

      <FormField label="Alamat Lengkap" error={errors.alamat?.message} required>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <textarea
            {...register('alamat')}
            rows={3}
            className={`
              w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors resize-none
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
              ${errors.alamat ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'}
            `}
            placeholder="Masukkan alamat lengkap Anda"
            aria-invalid={!!errors.alamat}
          />
        </div>
      </FormField>

      <FormField label="Pekerjaan" error={errors.pekerjaan?.message} required>
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            {...register('pekerjaan')}
            className={`
              w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
              ${errors.pekerjaan ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'}
            `}
            placeholder="Contoh: Pegawai Swasta, PNS, Wiraswasta"
            aria-invalid={!!errors.pekerjaan}
          />
        </div>
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Email" error={errors.email?.message} required>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              {...register('email')}
              className={`
                w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
                ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'}
              `}
              placeholder="contoh@email.com"
              aria-invalid={!!errors.email}
            />
          </div>
        </FormField>

        <FormField label="Nomor Telepon" error={errors.telepon?.message} required>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="tel"
              {...register('telepon')}
              className={`
                w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
                ${errors.telepon ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'}
              `}
              placeholder="08123456789"
              aria-invalid={!!errors.telepon}
            />
          </div>
        </FormField>
      </div>

      <FormField 
        label="Nomor Registrasi Permohonan Awal" 
        error={errors.nomorRegistrasiPermohonan?.message} 
        required
        hint="Nomor registrasi yang diberikan saat permohonan informasi awal"
      >
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            {...register('nomorRegistrasiPermohonan')}
            className={`
              w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
              ${errors.nomorRegistrasiPermohonan ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'}
            `}
            placeholder="Contoh: PPID-20251210-ABC123"
            aria-invalid={!!errors.nomorRegistrasiPermohonan}
          />
        </div>
      </FormField>

      <FormField label="Hubungan dengan Pemohon Awal" error={errors.hubunganDenganPemohon?.message} required>
        <div className="flex flex-col sm:flex-row gap-3">
          <label className={`
            flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all flex-1
            ${form.watch('hubunganDenganPemohon') === 'pemohon_sendiri' 
              ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-500' 
              : 'border-slate-300 hover:border-slate-400'
            }
          `}>
            <input
              type="radio"
              {...register('hubunganDenganPemohon')}
              value="pemohon_sendiri"
              className="w-4 h-4 text-orange-600 focus:ring-orange-500"
            />
            <div>
              <span className="font-medium text-slate-900">Pemohon Sendiri</span>
              <p className="text-xs text-slate-500">Saya adalah pemohon informasi awal</p>
            </div>
          </label>
          <label className={`
            flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all flex-1
            ${form.watch('hubunganDenganPemohon') === 'kuasa_pemohon' 
              ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-500' 
              : 'border-slate-300 hover:border-slate-400'
            }
          `}>
            <input
              type="radio"
              {...register('hubunganDenganPemohon')}
              value="kuasa_pemohon"
              className="w-4 h-4 text-orange-600 focus:ring-orange-500"
            />
            <div>
              <span className="font-medium text-slate-900">Kuasa Pemohon</span>
              <p className="text-xs text-slate-500">Saya mewakili pemohon informasi awal</p>
            </div>
          </label>
        </div>
      </FormField>
    </motion.div>
  );
};


// ============================================================================
// STEP 2: DETAIL KEBERATAN
// ============================================================================
interface Step2Props {
  form: ReturnType<typeof useKeberatanForm>['form'];
}

const Step2DetailKeberatan: React.FC<Step2Props> = ({ form }) => {
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
        <h3 className="text-lg font-semibold text-slate-900">Detail Keberatan</h3>
        <p className="text-sm text-slate-500">Jelaskan alasan dan detail keberatan Anda</p>
      </div>

      <FormField label="Alasan Pengajuan Keberatan" error={errors.alasanKeberatan?.message} required>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ALASAN_KEBERATAN_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`
                flex flex-col p-4 rounded-lg border cursor-pointer transition-all
                ${form.watch('alasanKeberatan') === option.value 
                  ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-500' 
                  : 'border-slate-300 hover:border-slate-400'
                }
              `}
            >
              <input
                type="radio"
                {...register('alasanKeberatan')}
                value={option.value}
                className="sr-only"
              />
              <span className="font-medium text-slate-900 text-sm">{option.label}</span>
              <span className="text-xs text-slate-500 mt-1">{option.description}</span>
            </label>
          ))}
        </div>
      </FormField>

      <FormField 
        label="Tujuan Penggunaan Informasi" 
        error={errors.tujuanPenggunaanInformasi?.message} 
        required
        hint="Minimal 10 karakter"
      >
        <textarea
          {...register('tujuanPenggunaanInformasi')}
          rows={3}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-colors resize-none
            focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
            ${errors.tujuanPenggunaanInformasi ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'}
          `}
          placeholder="Jelaskan untuk apa informasi ini akan digunakan..."
          aria-invalid={!!errors.tujuanPenggunaanInformasi}
        />
      </FormField>

      <FormField 
        label="Informasi yang Diminta" 
        error={errors.informasiYangDiminta?.message} 
        required
        hint="Minimal 20 karakter"
      >
        <textarea
          {...register('informasiYangDiminta')}
          rows={3}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-colors resize-none
            focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
            ${errors.informasiYangDiminta ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'}
          `}
          placeholder="Jelaskan informasi apa yang Anda minta dalam permohonan awal..."
          aria-invalid={!!errors.informasiYangDiminta}
        />
      </FormField>

      <FormField 
        label="Kronologi/Kasus Posisi Keberatan" 
        error={errors.kronologiKeberatan?.message} 
        required
        hint="Minimal 30 karakter. Jelaskan kronologi kejadian dari awal permohonan hingga alasan pengajuan keberatan"
      >
        <textarea
          {...register('kronologiKeberatan')}
          rows={5}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-colors resize-none
            focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
            ${errors.kronologiKeberatan ? 'border-red-300 bg-red-50' : 'border-slate-300 hover:border-slate-400'}
          `}
          placeholder="Tuliskan kronologi lengkap mulai dari tanggal pengajuan permohonan awal, tanggapan PPID, hingga alasan Anda mengajukan keberatan..."
          aria-invalid={!!errors.kronologiKeberatan}
        />
      </FormField>

      {/* Info box about documents */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Dokumen Pendukung</p>
          <p className="text-sm text-amber-700 mt-1">
            Jika Anda memiliki dokumen pendukung (surat permohonan awal, surat jawaban PPID, dll), 
            Anda dapat melampirkannya saat datang langsung ke kantor PPID atau mengirimkannya via email ke ppid@bahasasultra.kemdikbud.go.id
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// STEP 3: KONFIRMASI
// ============================================================================
interface Step3Props {
  form: ReturnType<typeof useKeberatanForm>['form'];
  onEditStep: (step: number) => void;
}

const Step3Konfirmasi: React.FC<Step3Props> = ({ form, onEditStep }) => {
  const values = form.getValues();
  
  const SummaryItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="py-2">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-slate-900 font-medium whitespace-pre-wrap">{value || '-'}</dd>
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
        <p className="text-sm text-slate-500">Periksa kembali data yang Anda masukkan sebelum mengirim</p>
      </div>

      {/* Data Pemohon Summary */}
      <div className="bg-slate-50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-orange-600" aria-hidden="true" />
            Data Pemohon Keberatan
          </h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(1)}
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          >
            <Edit2 className="w-4 h-4 mr-1" aria-hidden="true" />
            Edit
          </Button>
        </div>
        <dl className="divide-y divide-slate-200">
          <SummaryItem label="Nama Lengkap" value={values.namaLengkap} />
          <SummaryItem label="Alamat" value={values.alamat} />
          <SummaryItem label="Pekerjaan" value={values.pekerjaan} />
          <SummaryItem label="Email" value={values.email} />
          <SummaryItem label="Nomor Telepon" value={values.telepon} />
          <SummaryItem label="Nomor Registrasi Permohonan Awal" value={values.nomorRegistrasiPermohonan} />
          <SummaryItem 
            label="Hubungan dengan Pemohon" 
            value={values.hubunganDenganPemohon ? HUBUNGAN_PEMOHON_LABELS[values.hubunganDenganPemohon] : '-'} 
          />
        </dl>
      </div>

      {/* Detail Keberatan Summary */}
      <div className="bg-slate-50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-600" aria-hidden="true" />
            Detail Keberatan
          </h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(2)}
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          >
            <Edit2 className="w-4 h-4 mr-1" aria-hidden="true" />
            Edit
          </Button>
        </div>
        <dl className="divide-y divide-slate-200">
          <SummaryItem 
            label="Alasan Keberatan" 
            value={values.alasanKeberatan ? ALASAN_KEBERATAN_LABELS[values.alasanKeberatan] : '-'} 
          />
          <SummaryItem label="Tujuan Penggunaan Informasi" value={values.tujuanPenggunaanInformasi} />
          <SummaryItem label="Informasi yang Diminta" value={values.informasiYangDiminta} />
          <SummaryItem label="Kronologi Keberatan" value={values.kronologiKeberatan} />
        </dl>
      </div>

      {/* Legal notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Pernyataan:</strong> Dengan mengklik tombol "Kirim Keberatan", saya menyatakan bahwa data yang saya berikan adalah benar 
          dan saya bersedia mempertanggungjawabkan kebenaran data tersebut sesuai dengan ketentuan peraturan perundang-undangan yang berlaku.
        </p>
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
        Keberatan Berhasil Diajukan!
      </h3>
      <p className="text-slate-600 mb-6">
        Terima kasih telah mengajukan keberatan atas permohonan informasi publik
      </p>
      
      <div className="bg-slate-100 rounded-xl p-4 mb-6 inline-block">
        <p className="text-sm text-slate-500 mb-1">Nomor Registrasi Keberatan</p>
        <p className="text-xl font-mono font-bold text-orange-600">{referenceNumber}</p>
      </div>
      
      <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
        Simpan nomor registrasi ini untuk melacak status keberatan Anda. 
        Keberatan akan diproses dalam waktu <strong>30 hari kerja</strong> sejak diterimanya pengajuan keberatan.
        Kami akan menghubungi Anda melalui email yang terdaftar.
      </p>
      
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        className="hover:bg-slate-50"
      >
        Ajukan Keberatan Baru
      </Button>
    </motion.div>
  );
};

// ============================================================================
// MAIN MULTI-STEP FORM COMPONENT
// ============================================================================
const formSteps: KeberatanFormStep[] = [
  { id: 1, title: 'Data Pemohon', description: 'Informasi pribadi', icon: User },
  { id: 2, title: 'Detail Keberatan', description: 'Alasan keberatan', icon: AlertTriangle },
  { id: 3, title: 'Konfirmasi', description: 'Review & kirim', icon: CheckCircle },
];

export const KeberatanMultiStepForm: React.FC = () => {
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
  } = useKeberatanForm();

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
            {currentStep === 2 && <Step2DetailKeberatan key="step2" form={form} />}
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
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                  Mengirim...
                </>
              ) : currentStep === totalSteps ? (
                <>
                  <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                  Kirim Keberatan
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

export default KeberatanMultiStepForm;

import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Progress } from '@/Components/ui/progress';
import { Badge } from '@/Components/ui/badge';
import {
  ArrowLeft,
  ChevronRight,
  Upload,
  Link2,
  FileText,
  File,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  X,
  Shield,
  Clock,
  FolderOpen,
  Smartphone,
  Monitor,
  Tablet,
  Info,
  Check,
  Loader2,
  FileQuestion,
  UploadCloud,
  Link as LinkIcon,
  Plus,
  Globe,
  ExternalLink,
  RefreshCcw,
  HardDrive,
  Activity,
  Send,
  Sparkles,
  Copy,
  RotateCcw,
  Lightbulb
} from 'lucide-react';

interface Props {
  allowedFileTypes: string[];
  maxFileSize: number;
}

const DOCUMENT_TYPES: Array<{
  value: 'file' | 'link';
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
}> = [
  {
    value: 'file',
    label: 'Unggah File',
    description: 'Simpan dokumen langsung ke server',
    icon: UploadCloud,
    features: ['Aman', 'Cepat', 'Offline']
  },
  {
    value: 'link',
    label: 'Tautan URL',
    description: 'Gunakan dokumen yang sudah tersedia secara daring',
    icon: LinkIcon,
    features: ['Hemat storage', 'Mudah update', 'Eksternal']
  },
];

const FILE_TYPE_ICONS: Record<string, React.ComponentType<any>> = {
  pdf: FileText,
  doc: File,
  docx: File,
  xls: File,
  xlsx: File,
  ppt: File,
  pptx: File,
};

const steps = [
  { id: 1, name: 'Informasi', icon: FileText, completed: false, current: true },
  { id: 2, name: 'Dokumen', icon: FolderOpen, completed: false, current: false },
  { id: 3, name: 'Preview', icon: Eye, completed: false, current: false },
];

export default function Create({ allowedFileTypes, maxFileSize }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [titleFocus, setTitleFocus] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [dragCounter, setDragCounter] = useState(0);

  const { data, setData, post, processing, errors, progress } = useForm({
    title: '',
    description: '',
    document_type: 'file' as 'file' | 'link',
    external_url: '',
    file: null as File | null,
    is_active: true,
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    post(route('admin.standar-pelayanan.store'), {
      forceFormData: true,
    });
  };

  const handleDocumentTypeChange = (type: 'file' | 'link') => {
    setData('document_type', type);
    if (type === 'file') {
      setData('external_url', '');
    } else {
      setData('file', null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setData('file', file);
  };

  const handleClearFile = () => setData('file', null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragCounter(prev => prev + 1);
      if (dragCounter === 0) setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragCounter(prev => prev - 1);
      if (dragCounter === 1) setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setDragCounter(0);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (allowedFileTypes.includes(fileExtension || '')) {
        setData('file', file);
      } else {
        alert(`Format file tidak diizinkan. Hanya ${allowedFileTypes.join(', ')}`);
      }
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const IconComponent = FILE_TYPE_ICONS[extension] || File;
    return IconComponent;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const allowedExtensions = allowedFileTypes.map((ext) => `.${ext}`).join(',');

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const calculateProgress = () => {
    let progress = 0;
    if (data.title) progress += 30;
    if (data.description) progress += 20;
    if (data.file || data.external_url) progress += 50;
    return progress;
  };

  const saveDraft = () => {
    setData('is_active', false);
    // Auto-save draft logic here
  };

  const fetchSuggestions = (query: string) => {
    // Mock suggestions - replace with API call
    const mockSuggestions = [
      'Standar Pelayanan Informasi Publik Tahun 2024',
      'Standar Pelayanan Kearsipan 2024',
      'Standar Pelayanan Perpustakaan 2024'
    ];
    setSuggestions(mockSuggestions.filter(s => s.toLowerCase().includes(query.toLowerCase())));
  };

  const generateKeywords = (text: string) => {
    // Mock keywords generation - replace with AI/algorithm
    const words = text.split(' ').filter(word => word.length > 3);
    const mockKeywords = words.slice(0, 5);
    setKeywords(mockKeywords);
  };

  const loadTemplate = (type: string) => {
    if (type === 'standard') {
      setData('title', 'Standar Pelayanan [Nama Layanan] Tahun 2024');
      setData('description', 'Dokumen ini berisi standar pelayanan yang harus dipenuhi dalam layanan [nama layanan]');
    }
  };

  return (
    <AdminLayout>
      <Head title="Tambah Standar Pelayanan" />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        {/* Enhanced Header with Progress Stepper */}
        <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto">
            {/* Top Bar with Breadcrumb & Back Button */}
            <div className="px-4 lg:px-6 py-3 border-b border-gray-100/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Back Button */}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href={route('admin.standar-pelayanan.index')}
                      className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-200 group"
                    >
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                    </Link>
                  </motion.div>

                  {/* Breadcrumb */}
                  <nav className="hidden sm:flex items-center">
                    <ol className="flex items-center space-x-1">
                      <li>
                        <Link
                          href={route('admin.dashboard')}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span>Dashboard</span>
                        </Link>
                      </li>
                      <li className="flex items-center">
                        <ChevronRight className="h-4 w-4 text-gray-300" />
                      </li>
                      <li>
                        <Link
                          href={route('admin.media.index')}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Media Files</span>
                        </Link>
                      </li>
                      <li className="flex items-center">
                        <ChevronRight className="h-4 w-4 text-gray-300" />
                      </li>
                      <li>
                        <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-blue-600 bg-blue-50">
                          <Plus className="w-4 h-4" />
                          <span>Tambah Baru</span>
                        </span>
                      </li>
                    </ol>
                  </nav>

                  {/* Mobile Breadcrumb */}
                  <div className="sm:hidden">
                    <span className="text-sm font-medium text-gray-900">Tambah Standar Pelayanan</span>
                  </div>
                </div>

                {/* Status Toggle - Desktop */}
                <div className="hidden md:flex items-center gap-3">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-white rounded-full pl-4 pr-2 py-1.5 border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      {data.is_active ? (
                        <>
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-sm shadow-emerald-500/50"
                          />
                          <span className="text-sm font-semibold text-emerald-700">Publikasi</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
                          <span className="text-sm font-semibold text-amber-700">Draft</span>
                        </>
                      )}
                    </div>
                    <Switch
                      checked={data.is_active}
                      onCheckedChange={(checked) => {
                        setData('is_active', checked);
                        if ('vibrate' in navigator) {
                          navigator.vibrate(50);
                        }
                      }}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Main Header Content */}
            <div className="px-4 lg:px-6 py-5">
              {/* Title & Progress Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Title */}
                <div className="flex items-start gap-4">
                  <div className="hidden lg:flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
                      Buat Standar Pelayanan Baru
                    </h1>
                    <p className="text-gray-500 mt-0.5 text-sm lg:text-base">
                      Lengkapi informasi dokumen untuk dipublikasikan
                    </p>
                  </div>
                </div>

                {/* Progress Stepper - Enhanced */}
                <div className="flex items-center bg-gray-50/80 rounded-2xl p-2 lg:p-3 border border-gray-100">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2 lg:gap-3"
                      >
                        {/* Step Circle with Number */}
                        <div className="relative">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`relative flex items-center justify-center w-10 h-10 lg:w-11 lg:h-11 rounded-xl transition-all duration-300 cursor-pointer ${
                              step.current
                                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30'
                                : step.completed
                                ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25'
                                : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {step.completed ? (
                              <Check className="w-5 h-5 text-white" />
                            ) : (
                              <span className={`text-sm font-bold ${
                                step.current ? 'text-white' : 'text-gray-400'
                              }`}>
                                {step.id}
                              </span>
                            )}
                            
                            {/* Current Step Indicator Ring */}
                            {step.current && (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 rounded-xl border-2 border-blue-400"
                              />
                            )}
                          </motion.div>
                        </div>

                        {/* Step Label */}
                        <div className="hidden lg:block">
                          <p className={`text-xs font-medium uppercase tracking-wider ${
                            step.current ? 'text-blue-600' : step.completed ? 'text-emerald-600' : 'text-gray-400'
                          }`}>
                            Langkah {step.id}
                          </p>
                          <p className={`text-sm font-semibold ${
                            step.current ? 'text-gray-900' : step.completed ? 'text-gray-700' : 'text-gray-500'
                          }`}>
                            {step.name}
                          </p>
                        </div>
                      </motion.div>

                      {/* Connector Line */}
                      {index < steps.length - 1 && (
                        <div className="mx-2 lg:mx-4">
                          <div className={`w-8 lg:w-12 h-1 rounded-full transition-all duration-500 ${
                            step.completed
                              ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                              : 'bg-gray-200'
                          }`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Status Toggle */}
              <div className="md:hidden mt-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white rounded-xl px-4 py-3 border border-gray-200">
                <div className="flex items-center gap-3">
                  {data.is_active ? (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm shadow-emerald-500/50"
                      />
                      <div>
                        <p className="text-sm font-semibold text-emerald-700">Akan Dipublikasikan</p>
                        <p className="text-xs text-gray-500">Dokumen langsung aktif setelah disimpan</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-amber-400 rounded-full" />
                      <div>
                        <p className="text-sm font-semibold text-amber-700">Simpan sebagai Draft</p>
                        <p className="text-xs text-gray-500">Dokumen tidak akan ditampilkan</p>
                      </div>
                    </>
                  )}
                </div>
                <Switch
                  checked={data.is_active}
                  onCheckedChange={(checked) => {
                    setData('is_active', checked);
                    if ('vibrate' in navigator) {
                      navigator.vibrate(50);
                    }
                  }}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="px-4 py-3 lg:px-6">
          <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50/80 backdrop-blur-sm">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              <span className="font-semibold">Format yang didukung:</span> {allowedFileTypes.join(', ').toUpperCase()} |
              <span className="font-semibold"> Maksimal ukuran:</span> {Math.round(maxFileSize / 1024)} MB
            </AlertDescription>
          </Alert>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pb-32 lg:pb-0">
          <div className="px-4 lg:px-6 max-w-7xl mx-auto">
            {/* Mobile: Single Column Layout */}
            <div className="lg:hidden space-y-6">
              {/* Smart Form for Mobile */}
              <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Informasi Dokumen</h2>
                      <p className="text-blue-100 text-sm">Isi data dasar dokumen Anda</p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      Judul Dokumen
                      <span className="text-red-500">*</span>
                      {data.title && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </label>

                    <div className="relative">
                      <Input
                        value={data.title}
                        onChange={(e) => {
                          setData('title', e.target.value);
                          if (e.target.value.length > 2) {
                            fetchSuggestions(e.target.value);
                          }
                        }}
                        onFocus={() => setTitleFocus(true)}
                        onBlur={() => setTimeout(() => setTitleFocus(false), 200)}
                        placeholder="Contoh: Standar Pelayanan Tahun 2024"
                        className={`text-base py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                          titleFocus
                            ? 'border-blue-500 shadow-lg shadow-blue-500/10'
                            : errors.title
                            ? 'border-red-500'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      />

                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <span className={`text-xs font-medium ${
                          data.title.length > 100 ? 'text-red-500' : 'text-gray-400'
                        }`}>
                          {data.title.length}/100
                        </span>
                      </div>
                    </div>

                    {errors.title && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.title}
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        Deskripsi Singkat
                        <Badge variant="secondary" className="text-xs">Opsional</Badge>
                      </span>
                      <span className="text-xs text-gray-500">
                        {data.description.length}/500
                      </span>
                    </label>

                    <Textarea
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value.slice(0, 500))}
                      placeholder="Jelaskan secara singkat isi dokumen..."
                      className="min-h-[100px] resize-none rounded-xl border-2 p-4 text-sm transition-all duration-200"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Document Source for Mobile */}
              <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-90" />
                  <div className="relative px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <FolderOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white">Sumber Dokumen</h2>
                        <p className="text-purple-100 text-sm">Pilih metode penyimpanan dokumen</p>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4 space-y-4">
                  <div className="grid gap-3">
                    {DOCUMENT_TYPES.map(({ value, label, description, icon: Icon, features }) => (
                      <motion.div
                        key={value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="radio"
                          id={`doc-type-mobile-${value}`}
                          name="document_type"
                          value={value}
                          checked={data.document_type === value}
                          onChange={() => handleDocumentTypeChange(value)}
                          className="peer sr-only"
                        />
                        <label
                          htmlFor={`doc-type-mobile-${value}`}
                          className={`block cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${
                            data.document_type === value
                              ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg shadow-purple-500/20'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <motion.div
                              animate={{
                                rotate: data.document_type === value ? 360 : 0,
                                scale: data.document_type === value ? 1.1 : 1,
                              }}
                              transition={{ duration: 0.5 }}
                              className={`rounded-lg p-2 ${
                                data.document_type === value
                                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </motion.div>
                            <div className="flex-1">
                              <div className="font-bold text-gray-900">{label}</div>
                              <p className="text-xs text-gray-600 mt-1">{description}</p>
                            </div>
                            {data.document_type === value && (
                              <CheckCircle2 className="h-5 w-5 text-purple-500 flex-shrink-0" />
                            )}
                          </div>
                        </label>
                      </motion.div>
                    ))}
                  </div>

                  {/* File Upload / URL Input for Mobile */}
                  {data.document_type === 'file' ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <input
                        id="file-mobile"
                        type="file"
                        className="hidden"
                        accept={allowedExtensions}
                        onChange={handleFileChange}
                      />
                      <div
                        className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
                          dragActive
                            ? 'border-blue-500 bg-blue-50'
                            : data.file
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-mobile')?.click()}
                      >
                        {data.file ? (
                          <div className="space-y-3">
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center"
                            >
                              {React.createElement(getFileIcon(data.file.name), {
                                className: 'h-8 w-8 text-white',
                              })}
                            </motion.div>
                            <div>
                              <p className="font-medium text-sm text-gray-900 truncate px-2">{data.file.name}</p>
                              <p className="text-xs text-gray-600">{formatFileSize(data.file.size)}</p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2 text-xs border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClearFile();
                              }}
                            >
                              <RefreshCcw className="h-3 w-3 mr-1" />
                              Ganti File
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <UploadCloud className="h-10 w-10 text-gray-400 mx-auto" />
                            <p className="text-sm font-medium text-gray-900">
                              {dragActive ? 'Lepaskan file' : 'Pilih atau seret file'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {allowedFileTypes.join(', ').toUpperCase()}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <div className="relative">
                        <Input
                          id="external_url-mobile"
                          type="url"
                          value={data.external_url}
                          onChange={(event) => setData('external_url', event.target.value)}
                          placeholder="https://contoh.com/dokumen.pdf"
                          className={`text-sm pl-10 ${errors.external_url ? 'border-red-500' : ''}`}
                        />
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.external_url && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.external_url}
                        </p>
                      )}
                    </motion.div>
                  )}

                  {progress && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Upload progress</span>
                        <span>{progress.percentage}%</span>
                      </div>
                      <Progress value={progress.percentage} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Desktop: Two Column Layout */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6 py-6">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-6">
                {/* Document Information */}
                <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white">Informasi Dokumen</h2>
                        <p className="text-blue-100 text-sm">Isi data dasar dokumen Anda</p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        Judul Dokumen <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          id="title"
                          value={data.title}
                          onChange={(event) => setData('title', event.target.value)}
                          placeholder="Contoh: Standar Pelayanan Informasi Publik Tahun 2024"
                          className={`text-lg py-4 px-4 rounded-xl border-2 transition-all duration-200 ${
                            errors.title ? 'border-red-500' : 'focus:border-blue-500'
                          }`}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <span className={`text-sm font-medium ${
                            data.title.length > 100 ? 'text-red-500' : 'text-gray-400'
                          }`}>
                            {data.title.length}/100
                          </span>
                        </div>
                      </div>
                      {errors.title && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.title}
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-semibold text-gray-700">
                        Deskripsi Singkat
                      </label>
                      <Textarea
                        id="description"
                        rows={5}
                        value={data.description}
                        onChange={(event) => setData('description', event.target.value)}
                        placeholder="Tuliskan ringkasan isi dokumen untuk membantu pengguna memahami konten..."
                        className={`resize-none rounded-xl border-2 p-4 transition-all duration-200 ${
                          errors.description ? 'border-red-500' : 'focus:border-blue-500'
                        }`}
                      />
                      {errors.description && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.description}
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Document Source */}
                <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-90" />
                    <div className="relative px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <FolderOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-white">Sumber Dokumen</h2>
                          <p className="text-purple-100 text-sm">Pilih metode penyimpanan dokumen</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      {DOCUMENT_TYPES.map(({ value, label, description, icon: Icon, features }) => (
                        <motion.div
                          key={value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <input
                            type="radio"
                            id={`doc-type-${value}`}
                            name="document_type"
                            value={value}
                            checked={data.document_type === value}
                            onChange={() => handleDocumentTypeChange(value)}
                            className="peer sr-only"
                          />
                          <label
                            htmlFor={`doc-type-${value}`}
                            className={`block cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300 ${
                              data.document_type === value
                                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl shadow-purple-500/20'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <motion.div
                                animate={{
                                  rotate: data.document_type === value ? 360 : 0,
                                  scale: data.document_type === value ? 1.1 : 1,
                                }}
                                transition={{ duration: 0.5 }}
                                className={`rounded-xl p-3 ${
                                  data.document_type === value
                                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                <Icon className="h-6 w-6" />
                              </motion.div>

                              <div className="flex-1">
                                <div className="font-bold text-gray-900 text-lg mb-1">{label}</div>
                                <p className="text-sm text-gray-600 mb-3">{description}</p>

                                <div className="flex flex-wrap gap-2">
                                  {features.map((feature, idx) => (
                                    <Badge
                                      key={idx}
                                      variant={data.document_type === value ? "default" : "secondary"}
                                      className="text-xs font-medium px-3 py-1 rounded-full"
                                    >
                                      {data.document_type === value && (
                                        <Sparkles className="w-3 h-3 mr-1 inline" />
                                      )}
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {data.document_type === value && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                  className="absolute top-4 right-4"
                                >
                                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                                    <Check className="w-5 h-5 text-white" />
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </label>
                        </motion.div>
                      ))}
                    </div>

                    {/* File Upload Section for Desktop */}
                    {data.document_type === 'file' ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <input
                          id="file"
                          type="file"
                          className="hidden"
                          accept={allowedExtensions}
                          onChange={handleFileChange}
                        />

                        <div
                          className={`relative rounded-2xl border-2 border-dashed p-10 text-center transition-all cursor-pointer overflow-hidden group ${
                            dragActive
                              ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 scale-[1.02]'
                              : data.file
                              ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50'
                              : 'border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50/20'
                          }`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => document.getElementById('file')?.click()}
                        >
                          <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 group-hover:opacity-10 transition-opacity" />
                          </div>

                          {data.file ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="space-y-4"
                            >
                              <motion.div
                                animate={{
                                  y: [0, -10, 0],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                                className="mx-auto w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl"
                              >
                                {React.createElement(getFileIcon(data.file.name), {
                                  className: 'h-12 w-12 text-white',
                                })}
                              </motion.div>

                              <div className="space-y-2">
                                <motion.p className="font-bold text-gray-900 text-lg truncate px-4">
                                  {data.file.name}
                                </motion.p>
                                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <HardDrive className="w-4 h-4" />
                                    {formatFileSize(data.file.size)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <FileText className="w-4 h-4" />
                                    {data.file.name.split('.').pop()?.toUpperCase()}
                                  </span>
                                </div>
                              </div>

                              <div className="flex justify-center gap-3">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleClearFile();
                                  }}
                                  className="rounded-full px-6 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400"
                                >
                                  <RefreshCcw className="w-4 h-4 mr-2" />
                                  Ganti File
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  className="rounded-full px-6 border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-400"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Preview
                                </Button>
                              </div>
                            </motion.div>
                          ) : (
                            <div className="space-y-4">
                              <motion.div
                                animate={{
                                  scale: [1, 1.1, 1],
                                  opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                                className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center"
                              >
                                <UploadCloud className="h-10 w-10 text-white" />
                              </motion.div>

                              <div>
                                <p className="text-xl font-bold mb-2">
                                  {dragActive ? 'Lepaskan file di sini!' : 'Seret & lepas file di sini'}
                                </p>
                                <p className="text-gray-600 mb-3">atau klik untuk memilih dari komputer</p>

                                <div className="flex flex-wrap justify-center gap-2 mb-3">
                                  {allowedFileTypes.map((type, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs rounded-full">
                                      .{type}
                                    </Badge>
                                  ))}
                                </div>

                                <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                                  <Info className="w-4 h-4" />
                                  Maksimal {Math.round(maxFileSize / 1024)} MB
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {errors.file && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-4 py-3 rounded-lg"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.file}
                          </motion.div>
                        )}

                        {progress && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                              <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                                Mengunggah...
                              </span>
                              <span className="text-purple-600">{progress.percentage}%</span>
                            </div>
                            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress.percentage}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="relative">
                          <Input
                            id="external_url"
                            type="url"
                            value={data.external_url}
                            onChange={(event) => setData('external_url', event.target.value)}
                            placeholder="https://contoh.go.id/dokumen.pdf"
                            className={`text-base py-4 pl-12 pr-4 rounded-xl border-2 transition-all duration-200 ${
                              errors.external_url
                                ? 'border-red-500'
                                : 'focus:border-purple-500'
                            }`}
                          />
                          <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <Globe className="w-5 h-5 text-gray-400" />
                          </div>

                          {data.external_url && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              {isValidUrl(data.external_url) ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-amber-500" />
                              )}
                            </div>
                          )}
                        </div>

                        {errors.external_url && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-4 py-3 rounded-lg"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.external_url}
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar - Desktop */}
              <div className="space-y-6">
                {/* Status Card with Live Updates */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <Card className="border border-gray-200 shadow-xl bg-white overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3">
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Status Dokumen
                      </h3>
                    </div>
                    <CardContent className="p-4 space-y-4">
                      {/* Live Status */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`w-3 h-3 rounded-full ${
                              data.is_active ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          />
                          <div>
                            <p className="font-medium text-sm">Status</p>
                            <p className="text-xs text-gray-600">
                              {data.is_active ? 'Akan dipublikasikan' : 'Disimpan sebagai draft'}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={data.is_active}
                          onCheckedChange={(checked) => {
                            setData('is_active', checked);
                            if ('vibrate' in navigator) {
                              navigator.vibrate(50);
                            }
                          }}
                          className="data-[state=checked]:bg-green-500"
                        />
                      </div>

                      {/* Progress Steps */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-blue-600">
                            {calculateProgress()}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                            animate={{ width: `${calculateProgress()}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-600">Characters</p>
                          <p className="text-sm font-bold text-blue-900">{data.title.length}</p>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <p className="text-xs text-purple-600">File Size</p>
                          <p className="text-sm font-bold text-purple-900">
                            {data.file ? formatFileSize(data.file.size) : '0 KB'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <Card className="border-0 shadow-xl">
                    <CardContent className="p-4 space-y-3">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          disabled={processing}
                          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
                          size="lg"
                        >
                          {processing ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="mr-2"
                              >
                                <Loader2 className="h-5 w-5" />
                              </motion.div>
                              Menyimpan...
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5 mr-2" />
                              Publikasikan Dokumen
                            </>
                          )}
                        </Button>
                      </motion.div>

                      <div className="grid grid-cols-2 gap-2">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={saveDraft}
                            className="w-full py-3 rounded-xl border-2 border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-400 transition-all duration-200"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Draft
                          </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowPreview(!showPreview)}
                            className="w-full py-3 rounded-xl border-2 border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-400 transition-all duration-200"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </motion.div>
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="button"
                          variant="ghost"
                          asChild
                          className="w-full py-3 border-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 rounded-xl transition-all duration-200"
                        >
                          <Link href={route('admin.standar-pelayanan.index')}>
                            <X className="h-4 w-4 mr-2" />
                            Batal
                          </Link>
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>

                  {/* Help Tips */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-4 border border-blue-100"
                  >
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      Tips Pro
                    </h4>
                    <div className="space-y-2">
                      {[
                        'Gunakan format PDF untuk kompatibilitas terbaik',
                        'Pastikan ukuran file di bawah 10 MB',
                        'Judul yang jelas membantu pencarian',
                        'URL eksternal harus dapat diakses publik'
                      ].map((tip, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx }}
                          className="flex items-start gap-2"
                        >
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                          <p className="text-xs text-gray-700">{tip}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </form>

        {/* Mobile Floating Action Button */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <AnimatePresence>
            {!showQuickActions ? (
              <motion.div
                key="main-fab"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Button
                  onClick={() => setShowQuickActions(true)}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/30 border-0 text-white"
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="action-menu"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="relative"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-20 right-0 space-y-3"
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Button
                      onClick={() => {
                        setShowPreview(!showPreview);
                        setShowQuickActions(false);
                      }}
                      size="sm"
                      variant="outline"
                      className="w-14 h-14 rounded-full bg-white shadow-lg border-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      <Eye className="w-5 h-5" />
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button
                      onClick={() => {
                        saveDraft();
                        setShowQuickActions(false);
                      }}
                      size="sm"
                      className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg text-white"
                    >
                      <Save className="w-5 h-5" />
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      type="submit"
                      disabled={processing}
                      size="sm"
                      className="w-14 h-14 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg text-white"
                    >
                      {processing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                    </Button>
                  </motion.div>
                </motion.div>

                <Button
                  onClick={() => setShowQuickActions(false)}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-pink-600 shadow-2xl shadow-red-500/30 border-0"
                >
                  <X className="w-6 h-6" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: scrollY > 100 ? 100 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 z-40"
        >
          <div className="px-4 py-3">
            <div className="grid grid-cols-4 gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => window.history.back()}
                className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
                <span className="text-xs text-gray-600">Kembali</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={saveDraft}
                className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Save className="w-5 h-5 text-amber-500" />
                <span className="text-xs text-gray-600">Draft</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPreview(!showPreview)}
                className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-5 h-5 text-blue-500" />
                <span className="text-xs text-gray-600">Preview</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => document.querySelector('form')?.requestSubmit()}
                disabled={processing}
                className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              >
                {processing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span className="text-xs">Kirim</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Preview Modal */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowPreview(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Preview Dokumen</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(false)}
                    className="border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {data.title || 'Judul Dokumen'}
                        </h2>
                        {data.description && (
                          <p className="text-gray-600 mt-2">{data.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <Badge variant={data.is_active ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                          {data.is_active ? 'Aktif' : 'Draft'}
                        </Badge>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          {data.document_type === 'file' ? <FileText className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                          {data.document_type === 'file' ? 'File Upload' : 'URL Link'}
                        </span>
                      </div>

                      {data.file && (
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-600 mb-2">File:</p>
                          <p className="font-medium">{data.file.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(data.file.size)}</p>
                        </div>
                      )}

                      {data.external_url && (
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-600 mb-2">URL:</p>
                          <p className="font-medium text-blue-600 break-all">{data.external_url}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
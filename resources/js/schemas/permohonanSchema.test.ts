import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  step1Schema,
  step2Schema,
  permohonanSchema,
  validateStep,
  serializeFormData,
  deserializeFormData,
  type PermohonanData
} from './permohonanSchema';

/**
 * Feature: ppid-permohonan-redesign, Property 1: Form Validation Schema Correctness
 * Validates: Requirements 3.2, 3.4, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2
 * 
 * For any form input data, the Zod validation schema SHALL correctly identify 
 * valid inputs as valid and invalid inputs as invalid according to the defined rules.
 */
describe('Form Validation Schema - Property Tests', () => {
  
  // Arbitrary untuk nama valid (min 3 karakter)
  const validNamaArb = fc.string({ minLength: 3, maxLength: 100 })
    .filter(s => s.trim().length >= 3);
  
  // Arbitrary untuk nama invalid (kurang dari 3 karakter)
  const invalidNamaArb = fc.string({ minLength: 0, maxLength: 2 });
  
  // Arbitrary untuk email valid - menggunakan format yang pasti valid untuk Zod
  const validEmailArb = fc.tuple(
    fc.array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
    fc.constantFrom('gmail.com', 'yahoo.com', 'example.com', 'test.org', 'mail.co.id')
  ).map(([localChars, domain]) => `${localChars.join('')}@${domain}`);
  
  // Arbitrary untuk email invalid
  const invalidEmailArb = fc.oneof(
    fc.constant('invalid'),
    fc.constant('no-at-sign.com'),
    fc.constant('@nodomain'),
    fc.constant('spaces in@email.com')
  );
  
  // Arbitrary untuk telepon Indonesia valid
  const validTeleponArb = fc.tuple(
    fc.constantFrom('08', '+628', '628'),
    fc.integer({ min: 1, max: 9 }),
    fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 7, maxLength: 10 })
  ).map(([prefix, firstDigit, rest]) => `${prefix}${firstDigit}${rest.join('')}`);
  
  // Arbitrary untuk telepon invalid
  const invalidTeleponArb = fc.oneof(
    fc.string({ minLength: 1, maxLength: 5 }), // terlalu pendek
    fc.constant('12345678901'), // tidak dimulai dengan 08/+62/62
    fc.constant('abcdefghijk') // bukan angka
  );
  
  // Arbitrary untuk alamat valid (min 10 karakter)
  const validAlamatArb = fc.string({ minLength: 10, maxLength: 500 })
    .filter(s => s.trim().length >= 10);
  
  // Arbitrary untuk alamat invalid (kurang dari 10 karakter)
  const invalidAlamatArb = fc.string({ minLength: 0, maxLength: 9 });
  
  // Arbitrary untuk jenis pemohon valid
  const validJenisPemohonArb = fc.constantFrom('perorangan', 'lembaga') as fc.Arbitrary<'perorangan' | 'lembaga'>;
  
  // Arbitrary untuk rincian informasi valid (min 20 karakter)
  const validRincianArb = fc.string({ minLength: 20, maxLength: 1000 })
    .filter(s => s.trim().length >= 20);
  
  // Arbitrary untuk rincian informasi invalid
  const invalidRincianArb = fc.string({ minLength: 0, maxLength: 19 });
  
  // Arbitrary untuk tujuan penggunaan valid (min 10 karakter)
  const validTujuanArb = fc.string({ minLength: 10, maxLength: 500 })
    .filter(s => s.trim().length >= 10);
  
  // Arbitrary untuk tujuan penggunaan invalid
  const invalidTujuanArb = fc.string({ minLength: 0, maxLength: 9 });
  
  // Arbitrary untuk metode penerimaan valid
  const validMetodeArb = fc.constantFrom('email', 'pos', 'ambil_langsung') as fc.Arbitrary<'email' | 'pos' | 'ambil_langsung'>;

  describe('Step 1 Schema - Data Pemohon', () => {
    
    it('should accept valid nama lengkap (min 3 characters)', () => {
      fc.assert(
        fc.property(validNamaArb, (nama) => {
          const result = step1Schema.shape.namaLengkap.safeParse(nama);
          return result.success === true;
        }),
        { numRuns: 100 }
      );
    });
    
    it('should reject invalid nama lengkap (less than 3 characters)', () => {
      fc.assert(
        fc.property(invalidNamaArb, (nama) => {
          const result = step1Schema.shape.namaLengkap.safeParse(nama);
          return result.success === false;
        }),
        { numRuns: 100 }
      );
    });
    
    it('should accept valid email format', () => {
      fc.assert(
        fc.property(validEmailArb, (email) => {
          const result = step1Schema.shape.email.safeParse(email);
          return result.success === true;
        }),
        { numRuns: 100 }
      );
    });
    
    it('should reject invalid email format', () => {
      fc.assert(
        fc.property(invalidEmailArb, (email) => {
          const result = step1Schema.shape.email.safeParse(email);
          return result.success === false;
        }),
        { numRuns: 100 }
      );
    });
    
    it('should accept valid Indonesian phone number', () => {
      fc.assert(
        fc.property(validTeleponArb, (telepon) => {
          const result = step1Schema.shape.telepon.safeParse(telepon);
          return result.success === true;
        }),
        { numRuns: 100 }
      );
    });
    
    it('should reject invalid phone number format', () => {
      fc.assert(
        fc.property(invalidTeleponArb, (telepon) => {
          const result = step1Schema.shape.telepon.safeParse(telepon);
          return result.success === false;
        }),
        { numRuns: 100 }
      );
    });
    
    it('should accept valid alamat (min 10 characters)', () => {
      fc.assert(
        fc.property(validAlamatArb, (alamat) => {
          const result = step1Schema.shape.alamat.safeParse(alamat);
          return result.success === true;
        }),
        { numRuns: 100 }
      );
    });
    
    it('should reject invalid alamat (less than 10 characters)', () => {
      fc.assert(
        fc.property(invalidAlamatArb, (alamat) => {
          const result = step1Schema.shape.alamat.safeParse(alamat);
          return result.success === false;
        }),
        { numRuns: 100 }
      );
    });
    
    it('should accept valid jenis pemohon', () => {
      fc.assert(
        fc.property(validJenisPemohonArb, (jenis) => {
          const result = step1Schema.shape.jenisPemohon.safeParse(jenis);
          return result.success === true;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Step 2 Schema - Detail Permohonan', () => {
    
    it('should accept valid rincian informasi (min 20 characters)', () => {
      fc.assert(
        fc.property(validRincianArb, (rincian) => {
          const result = step2Schema.shape.rincianInformasi.safeParse(rincian);
          return result.success === true;
        }),
        { numRuns: 100 }
      );
    });
    
    it('should reject invalid rincian informasi (less than 20 characters)', () => {
      fc.assert(
        fc.property(invalidRincianArb, (rincian) => {
          const result = step2Schema.shape.rincianInformasi.safeParse(rincian);
          return result.success === false;
        }),
        { numRuns: 100 }
      );
    });
    
    it('should accept valid tujuan penggunaan (min 10 characters)', () => {
      fc.assert(
        fc.property(validTujuanArb, (tujuan) => {
          const result = step2Schema.shape.tujuanPenggunaan.safeParse(tujuan);
          return result.success === true;
        }),
        { numRuns: 100 }
      );
    });
    
    it('should reject invalid tujuan penggunaan (less than 10 characters)', () => {
      fc.assert(
        fc.property(invalidTujuanArb, (tujuan) => {
          const result = step2Schema.shape.tujuanPenggunaan.safeParse(tujuan);
          return result.success === false;
        }),
        { numRuns: 100 }
      );
    });
    
    it('should accept valid metode penerimaan', () => {
      fc.assert(
        fc.property(validMetodeArb, (metode) => {
          const result = step2Schema.shape.metodePenerimaan.safeParse(metode);
          return result.success === true;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('validateStep helper function', () => {
    
    it('should return success for valid step 1 data', () => {
      const validStep1 = {
        namaLengkap: 'John Doe',
        email: 'john@example.com',
        telepon: '081234567890',
        alamat: 'Jl. Contoh No. 123, Jakarta',
        jenisPemohon: 'perorangan' as const
      };
      
      const result = validateStep(1, validStep1);
      expect(result.success).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });
    
    it('should return errors for invalid step 1 data', () => {
      const invalidStep1 = {
        namaLengkap: 'AB', // too short
        email: 'invalid-email',
        telepon: '123', // invalid format
        alamat: 'short', // too short
        jenisPemohon: undefined
      };
      
      const result = validateStep(1, invalidStep1);
      expect(result.success).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(0);
    });
  });
});

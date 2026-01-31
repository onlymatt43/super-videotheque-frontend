import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PayhipValidation, AccessGrant } from '../../types';

interface RentalSession {
  rentalId: string;
  signedUrl?: string;
  expiresAt: string;
}

interface CodeAccess {
  code: string;
  email: string;
  validation: PayhipValidation;
  grant: AccessGrant;
  addedAt: string;
}

interface SessionState {
  customerEmail?: string;
  codes: CodeAccess[];
  rentals: Record<string, RentalSession>;
  addCode: (payload: { code: string; email: string; validation: PayhipValidation }) => void;
  removeCode: (code: string) => void;
  getActiveAccess: () => AccessGrant[];
  hasAccess: (movieId: string, category?: string) => boolean;
  upsertRental: (movieId: string, rental: RentalSession) => void;
  clearSession: () => void;
}

type SessionData = Pick<SessionState, 'customerEmail' | 'codes' | 'rentals'>;

const DEFAULT_SESSION_DATA: SessionData = {
  customerEmail: undefined,
  codes: [],
  rentals: {}
};

const isAccessType = (value: unknown): value is AccessGrant['type'] =>
  value === 'time' || value === 'film' || value === 'category';

const sanitizeGrant = (input: unknown): AccessGrant => {
  if (!input || typeof input !== 'object') {
    return { type: 'time', value: 'all' };
  }

  const record = input as Record<string, unknown>;
  const type = isAccessType(record.type) ? record.type : 'time';
  const value = typeof record.value === 'string' && record.value.length > 0 ? record.value : 'all';
  const expiresAt = typeof record.expiresAt === 'string' ? record.expiresAt : undefined;

  return { type, value, expiresAt };
};

const sanitizeValidation = (input: unknown, code: string): PayhipValidation => {
  if (!input || typeof input !== 'object') {
    return { success: true, licenseKey: code };
  }

  const record = input as Record<string, unknown>;

  const accessType = isAccessType(record.accessType) ? record.accessType : undefined;
  const accessValue = typeof record.accessValue === 'string' ? record.accessValue : undefined;

  return {
    success: record.success === false ? false : true,
    licenseKey: typeof record.licenseKey === 'string' && record.licenseKey.length ? record.licenseKey : code,
    productId: typeof record.productId === 'string' ? record.productId : undefined,
    email: typeof record.email === 'string' ? record.email : undefined,
    status: typeof record.status === 'string' ? record.status : undefined,
    orderId: typeof record.orderId === 'string' ? record.orderId : undefined,
    purchasedAt: typeof record.purchasedAt === 'string' ? record.purchasedAt : undefined,
    accessType,
    accessValue,
    duration: typeof record.duration === 'number' ? record.duration : undefined
  };
};

const sanitizeCodeAccess = (input: unknown): CodeAccess | null => {
  if (typeof input === 'string' && input.trim().length > 0) {
    const code = input.trim();
    return {
      code,
      email: '',
      validation: { success: true, licenseKey: code },
      grant: { type: 'time', value: 'all' },
      addedAt: new Date().toISOString()
    };
  }

  if (!input || typeof input !== 'object') {
    return null;
  }

  const record = input as Record<string, unknown>;
  const code = typeof record.code === 'string' && record.code.length > 0 ? record.code : undefined;
  if (!code) {
    return null;
  }

  const email = typeof record.email === 'string' ? record.email : '';
  const validation = sanitizeValidation(record.validation, code);
  const grant = sanitizeGrant(record.grant);
  const addedAt = typeof record.addedAt === 'string' ? record.addedAt : new Date().toISOString();

  return { code, email, validation, grant, addedAt };
};

const sanitizeCodes = (input: unknown): CodeAccess[] => {
  if (!input) return [];

  const list = Array.isArray(input) ? input : [input];
  const seen = new Set<string>();
  const sanitized: CodeAccess[] = [];

  list.forEach((entry) => {
    const codeAccess = sanitizeCodeAccess(entry);
    if (codeAccess && !seen.has(codeAccess.code)) {
      seen.add(codeAccess.code);
      sanitized.push(codeAccess);
    }
  });

  return sanitized;
};

const sanitizeRentals = (input: unknown): SessionData['rentals'] => {
  if (!input || typeof input !== 'object') {
    return {};
  }

  const entries = Object.entries(input as Record<string, unknown>);
  const rentals: SessionData['rentals'] = {};

  entries.forEach(([movieId, value]) => {
    if (!movieId || typeof movieId !== 'string') return;
    if (!value || typeof value !== 'object') return;

    const record = value as Record<string, unknown>;
    const rentalId = typeof record.rentalId === 'string' ? record.rentalId : undefined;
    const expiresAt = typeof record.expiresAt === 'string' ? record.expiresAt : undefined;
    if (!rentalId || !expiresAt) return;

    rentals[movieId] = {
      rentalId,
      signedUrl: typeof record.signedUrl === 'string' ? record.signedUrl : undefined,
      expiresAt
    };
  });

  return rentals;
};

const sanitizeSessionData = (input: unknown): SessionData => {
  if (!input || typeof input !== 'object') {
    return { ...DEFAULT_SESSION_DATA };
  }

  const record = input as Record<string, unknown> & SessionData;

  const customerEmail = typeof record.customerEmail === 'string' && record.customerEmail.length > 0
    ? record.customerEmail
    : undefined;

  return {
    customerEmail,
    codes: sanitizeCodes(record.codes),
    rentals: sanitizeRentals(record.rentals)
  };
};

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SESSION_DATA,

      addCode: ({ code, email, validation }) => {
        const grant: AccessGrant = {
          type: validation.accessType || 'time',
          value: validation.accessValue || 'all',
          expiresAt: validation.duration
            ? new Date(Date.now() + validation.duration * 1000).toISOString()
            : undefined
        };

        set((state) => {
          const existingCodes = sanitizeCodes(state.codes);
          const filtered = existingCodes.filter((c) => c.code !== code);
          return {
            customerEmail: email,
            codes: [
              ...filtered,
              {
                code,
                email,
                validation,
                grant,
                addedAt: new Date().toISOString()
              }
            ]
          };
        });
      },

      removeCode: (code) =>
        set((state) => ({
          codes: sanitizeCodes(state.codes).filter((c) => c.code !== code)
        })),

      getActiveAccess: () => {
        const now = Date.now();
        return sanitizeCodes(get().codes)
          .map((c) => c.grant)
          .filter((grant) => {
            if (!grant.expiresAt) return true;
            return new Date(grant.expiresAt).getTime() > now;
          });
      },

      hasAccess: (movieId: string, category?: string) => {
        const access = get().getActiveAccess();

        if (access.some((a) => a.type === 'time' && a.value === 'all')) {
          return true;
        }

        if (access.some((a) => a.type === 'film' && a.value === movieId)) {
          return true;
        }

        if (category && access.some((a) => a.type === 'category' && a.value === category)) {
          return true;
        }

        return false;
      },

      upsertRental: (movieId, rental) =>
        set((state) => ({ rentals: { ...sanitizeRentals(state.rentals), [movieId]: rental } })),

      clearSession: () => set({ ...DEFAULT_SESSION_DATA })
    }),
    {
      name: 'session-storage',
      version: 2,
      partialize: (state) => ({
        customerEmail: state.customerEmail,
        codes: state.codes,
        rentals: state.rentals
      }),
      migrate: (persistedState) => sanitizeSessionData(persistedState)
    }
  )
);

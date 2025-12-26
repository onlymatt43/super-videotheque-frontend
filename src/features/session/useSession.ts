import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PayhipValidation, AccessGrant, AccessType } from '../../types';

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

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      codes: [],
      rentals: {},
      
      addCode: ({ code, email, validation }) => {
        const grant: AccessGrant = {
          type: validation.accessType || 'time',
          value: validation.accessValue || 'all',
          expiresAt: validation.duration 
            ? new Date(Date.now() + validation.duration * 1000).toISOString()
            : undefined
        };

        set((state) => ({
          customerEmail: email,
          codes: [
            ...state.codes.filter(c => c.code !== code),
            {
              code,
              email,
              validation,
              grant,
              addedAt: new Date().toISOString()
            }
          ]
        }));
      },

      removeCode: (code) => 
        set((state) => ({
          codes: state.codes.filter(c => c.code !== code)
        })),

      getActiveAccess: () => {
        const now = Date.now();
        return get().codes
          .map(c => c.grant)
          .filter(grant => {
            if (!grant.expiresAt) return true;
            return new Date(grant.expiresAt).getTime() > now;
          });
      },

      hasAccess: (movieId: string, category?: string) => {
        const access = get().getActiveAccess();
        
        // Vérifie si on a un accès temporel complet
        if (access.some(a => a.type === 'time' && a.value === 'all')) {
          return true;
        }

        // Vérifie si on a accès au film spécifique
        if (access.some(a => a.type === 'film' && a.value === movieId)) {
          return true;
        }

        // Vérifie si on a accès à la catégorie
        if (category && access.some(a => a.type === 'category' && a.value === category)) {
          return true;
        }

        return false;
      },

      upsertRental: (movieId, rental) =>
        set((state) => ({ rentals: { ...state.rentals, [movieId]: rental } })),

      clearSession: () => set({ customerEmail: undefined, codes: [], rentals: {} })
    }),
    {
      name: 'session-storage'
    }
  )
);

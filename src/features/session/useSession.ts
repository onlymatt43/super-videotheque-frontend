import { create } from 'zustand';
import type { PayhipValidation } from '../../types';

interface RentalSession {
  rentalId: string;
  signedUrl?: string;
  expiresAt: string;
}

interface SessionState {
  payhipCode?: string;
  customerEmail?: string;
  validation?: PayhipValidation;
  rentals: Record<string, RentalSession>;
  setValidation: (payload: { code: string; email: string; validation: PayhipValidation }) => void;
  upsertRental: (movieId: string, rental: RentalSession) => void;
  clearSession: () => void;
}

export const useSession = create<SessionState>((set) => ({
  rentals: {},
  setValidation: ({ code, email, validation }) =>
    set({ payhipCode: code, customerEmail: email, validation }),
  upsertRental: (movieId, rental) =>
    set((state) => ({ rentals: { ...state.rentals, [movieId]: rental } })),
  clearSession: () => set({ payhipCode: undefined, customerEmail: undefined, validation: undefined, rentals: {} })
}));

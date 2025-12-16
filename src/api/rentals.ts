import { apiClient } from './client';
import type { ApiResponse, Rental } from '../types';

interface CreateRentalPayload {
  movieId: string;
  customerEmail: string;
  payhipCode: string;
}

interface RentalEnvelope {
  rental: Rental;
  signedUrl?: string;
}

export const createRental = async (payload: CreateRentalPayload): Promise<RentalEnvelope> => {
  const { data } = await apiClient.post<ApiResponse<RentalEnvelope>>('/api/rentals', payload);
  return data.data;
};

export const fetchRental = async (rentalId: string): Promise<RentalEnvelope> => {
  const { data } = await apiClient.get<ApiResponse<RentalEnvelope>>(`/api/rentals/${rentalId}`);
  return data.data;
};

export type { RentalEnvelope };

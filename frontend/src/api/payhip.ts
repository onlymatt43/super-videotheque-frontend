import { apiClient } from './client';
import type { ApiResponse, PayhipValidation } from '../types';

interface ValidatePayload {
  code: string;
}

export const validatePayhipCode = async (payload: ValidatePayload): Promise<PayhipValidation> => {
  const { data } = await apiClient.post<ApiResponse<PayhipValidation>>('/api/payhip/validate', payload);
  return data.data;
};

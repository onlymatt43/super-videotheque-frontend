// Categories are now dynamic from the database
export type MovieCategory = string;

export interface Movie {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  bunnyLibraryId: string;      // ✅ Required (backend requires it)
  bunnyVideoId: string;         // ✅ Required (backend requires it)
  videoPath: string;
  previewUrl?: string;
  rentalDurationHours: number;
  isFreePreview?: boolean;
  category?: MovieCategory;
  tags?: string[];
}

export interface Rental {
  _id: string;
  movie: Movie | string;
  customerEmail: string;
  payhipCode: string;
  status: 'active' | 'expired';
  expiresAt: string;
  lastSignedUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type AccessType = 'time' | 'film' | 'category';

export interface AccessGrant {
  type: AccessType;
  value: string; // "all" pour time, film_id pour film, category_name pour category
  expiresAt?: string; // Pour les accès temporels
}

export interface PayhipValidation {
  success: boolean;
  licenseKey: string;
  productId?: string;
  email?: string;
  status?: string;
  orderId?: string;
  purchasedAt?: string;
  accessType?: AccessType;
  accessValue?: string;
  duration?: number; // en secondes pour les codes temporels
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

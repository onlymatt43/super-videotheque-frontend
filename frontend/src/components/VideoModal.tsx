import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import type { Movie } from '../types';

interface VideoModalProps {
  open: boolean;
  movie?: Movie;
  signedUrl?: string;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
  error?: string;
}

export const VideoModal = ({ open, movie, signedUrl, onOpenChange, isLoading, error }: VideoModalProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur" />
      <Dialog.Content className="fixed inset-0 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl rounded-3xl bg-night-light p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-2xl font-semibold text-white">{movie?.title}</Dialog.Title>
            <Dialog.Close className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20">
              <X />
            </Dialog.Close>
          </div>
          {isLoading && <p className="text-center text-slate">Préparation du flux sécurisé...</p>}
          {error && <p className="text-center text-red-400">{error}</p>}
          {!isLoading && signedUrl && movie && <VideoPlayer title={movie.title} src={signedUrl} />}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

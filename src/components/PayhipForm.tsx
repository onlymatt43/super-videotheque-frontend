import { useState } from 'react';
import { validatePayhipCode } from '../api/payhip';
import { useSession } from '../features/session/useSession';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PayhipForm = () => {
  const navigate = useNavigate();
  const { setValidation } = useSession();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [error, setError] = useState<string>();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!code || !email) {
      setError('Complétez la clé de licence Payhip et votre email.');
      setStatus('error');
      return;
    }

    try {
      setStatus('loading');
      setError(undefined);
      const validation = await validatePayhipCode({ code });
      setValidation({ code, email, validation });
      setStatus('success');
      navigate('/catalog');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Validation Payhip impossible.';
      setError(message);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel w-full max-w-xl rounded-2xl p-6 backdrop-blur">
      <a 
        href="https://payhip.com/storebytheom43team" 
        target="_blank" 
        rel="noopener noreferrer"
        className="mb-6 block text-sm uppercase tracking-[0.4em] text-ember hover:text-yellow-400 transition-colors"
      >
        Get Your Code →
      </a>
      <div className="mb-4">
        <input
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value.trim())}
          placeholder="Clé Payhip"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate/70 outline-none transition focus:border-ember focus:placeholder-transparent"
        />
      </div>
      <div className="mb-6">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email utilisé avec Payhip"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate/70 outline-none transition focus:border-ember focus:placeholder-transparent"
        />
      </div>
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-ember px-4 py-3 text-center text-base font-semibold uppercase tracking-[0.3em] text-night shadow-glow transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:bg-ember/50"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Vérification en cours
          </>
        ) : (
          'Débloquer le catalogue'
        )}
      </button>
      {status === 'success' && <p className="mt-4 text-center text-sm text-green-400">Licence vérifiée ! Redirection vers le catalogue...</p>}
    </form>
  );
};

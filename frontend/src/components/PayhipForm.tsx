import { useState } from 'react';
import { validatePayhipCode } from '../api/payhip';
import { useSession } from '../features/session/useSession';
import { Loader2 } from 'lucide-react';

export const PayhipForm = () => {
  const { addCode } = useSession();
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
      addCode({ code, email, validation });
      setStatus('success');
      // Réinitialiser le formulaire après succès
      setTimeout(() => {
        setCode('');
        setStatus('idle');
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Validation Payhip impossible.';
      setError(message);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel w-full max-w-xl rounded-2xl p-6 backdrop-blur">
      {/* Purchase options */}
      <p className="mb-3 text-xs uppercase tracking-[0.4em] text-slate">Get Your Code</p>
      <div className="mb-6 grid grid-cols-3 gap-2">
        <a
          href="https://payhip.com/storebytheom43team"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-center transition hover:border-ember hover:bg-ember/10"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-white">Card</span>
          <span className="text-[10px] text-slate">via Payhip</span>
        </a>
        <a
          href="https://nowpayments.io/payment?lid=5663208733"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-center transition hover:border-ember hover:bg-ember/10"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-white">Crypto</span>
          <span className="text-[10px] text-slate">via NOWPayments</span>
        </a>
        <div className="flex flex-col items-center gap-1 rounded-xl border border-white/5 bg-white/[0.02] px-2 py-3 text-center opacity-50 cursor-not-allowed">
          <span className="text-xs font-semibold uppercase tracking-widest text-white">Card</span>
          <span className="text-[10px] text-slate">via CCBill</span>
          <span className="text-[9px] text-amber-400">Coming soon</span>
        </div>
      </div>

      <div className="mb-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-slate">Already have a code?</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value.trim())}
          placeholder="PAYHIP CODE"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate/70 outline-none transition focus:border-ember focus:placeholder-transparent"
        />
      </div>
      <div className="mb-6">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="PAYHIP EMAIL"
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
          'Get Me In'
        )}
      </button>
      <p className="mt-3 text-xs leading-relaxed text-slate">
        By clicking Proceed to Payment, you agree that your transaction will be securely processed by our authorized billing partner, CCBill. The descriptor <strong>CCBILL.COM</strong> will appear on your bank statement for this one-time purchase.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-slate/90">
        Payments are processed securely via NOWPayments. Your digital assets will be transferred directly from your wallet to our secure corporate storage. Transactions on the blockchain are final.
      </p>
      {status === 'success' && <p className="mt-4 text-center text-sm text-green-400">Code ajouté avec succès !</p>}
    </form>
  );
};

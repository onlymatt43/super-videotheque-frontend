import { useState } from 'react';
import { validatePayhipCode } from '../api/payhip';
import { useSession } from '../features/session/useSession';
import { Loader2 } from 'lucide-react';
import { apiClient } from '../api/client';

export const PayhipForm = () => {
  const { addCode } = useSession();
  const [tab, setTab] = useState<'access' | 'subscribe'>('access');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [error, setError] = useState<string>();
  const [subEmail, setSubEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subError, setSubError] = useState<string>();

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!subEmail) return;
    try {
      setSubStatus('loading');
      setSubError(undefined);
      await apiClient.post('/nowpayments/subscribe', { email: subEmail });
      setSubStatus('success');
    } catch {
      setSubError('Erreur — réessaie ou contacte contact@theom43.team');
      setSubStatus('error');
    }
  };

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
    <div className="glass-panel w-full max-w-xl rounded-2xl p-6 backdrop-blur">
      {/* Tabs */}
      <div className="mb-6 flex rounded-xl border border-white/10 bg-white/5 p-1">
        <button
          type="button"
          onClick={() => setTab('access')}
          className={`flex-1 rounded-lg py-2 text-xs font-semibold uppercase tracking-widest transition ${
            tab === 'access' ? 'bg-ember text-night shadow-glow' : 'text-slate hover:text-white'
          }`}
        >
          J&apos;ai un code
        </button>
        <button
          type="button"
          onClick={() => setTab('subscribe')}
          className={`flex-1 rounded-lg py-2 text-xs font-semibold uppercase tracking-widest transition ${
            tab === 'subscribe' ? 'bg-ember text-night shadow-glow' : 'text-slate hover:text-white'
          }`}
        >
          S&apos;abonner
        </button>
      </div>

      {tab === 'subscribe' ? (
        <form onSubmit={handleSubscribe}>
          <p className="mb-4 text-sm text-slate">
            Accès illimité 365 jours &middot; <strong className="text-white">300 USD</strong> &middot; Paiement crypto via NOWPayments
          </p>
          {subStatus !== 'success' ? (
            <>
              <input
                type="email"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                placeholder="TON EMAIL"
                required
                className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate/70 outline-none transition focus:border-ember focus:placeholder-transparent"
              />
              {subError && <p className="mb-3 text-sm text-red-400">{subError}</p>}
              <button
                type="submit"
                disabled={subStatus === 'loading'}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-ember px-4 py-3 text-base font-semibold uppercase tracking-[0.3em] text-night shadow-glow transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:bg-ember/50"
              >
                {subStatus === 'loading' ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Envoi...
                  </>
                ) : (
                  'Recevoir le lien de paiement'
                )}
              </button>
              <p className="mt-3 text-xs leading-relaxed text-slate">
                Payments are processed securely via NOWPayments. Your digital assets will be transferred directly from your wallet to our secure corporate storage. Transactions on the blockchain are final.
              </p>
            </>
          ) : (
            <p className="rounded-xl border border-green-400/30 bg-green-400/10 p-4 text-center text-sm text-green-400">
              Verifie tes emails — le lien de paiement est en route !
            </p>
          )}
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
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
              href="https://nowpayments.io/payment?iid=6442288633"
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
                Verification en cours
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
          {status === 'success' && (
            <p className="mt-4 text-center text-sm text-green-400">Code ajoute avec succes !</p>
          )}
        </form>
      )}
    </div>
  );
};

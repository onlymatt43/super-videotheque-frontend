import { Link, useSearchParams } from 'react-router-dom';
import { Popcorn, LogOut } from 'lucide-react';
import { useSession } from '../features/session/useSession';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { customerEmail, codes, clearSession } = useSession();
  const [searchParams] = useSearchParams();
  const isEmbed = searchParams.get('embed') === '1';

  return (
    <div className={isEmbed ? "min-h-[100svh] bg-night text-white" : "min-h-screen bg-night text-white"}>
      {!isEmbed && (
      <header className="sticky top-0 z-40 bg-gradient-to-b from-black/80 to-transparent py-3 sm:py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3 sm:px-4">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 text-base sm:text-2xl font-bold uppercase tracking-[0.2em] sm:tracking-[0.35em] text-white">
            <Popcorn className="text-ember" size={24} />
            <span className="hidden xs:inline">Super Videotheque</span>
            <span className="xs:hidden">SV</span>
          </Link>
          {customerEmail && (
            <div className="flex items-center gap-2 sm:gap-4 text-sm text-slate">
              <div className="hidden sm:block text-right">
                <p className="font-medium text-white">{customerEmail}</p>
                <p className="text-xs text-slate">{codes.length} code{codes.length > 1 ? 's' : ''} actif{codes.length > 1 ? 's' : ''}</p>
              </div>
              <button
                type="button"
                onClick={clearSession}
                className="inline-flex items-center gap-1 sm:gap-2 rounded-full border border-white/20 px-2 sm:px-4 py-1.5 sm:py-2 text-xs uppercase tracking-wide text-white transition hover:border-white/50 hover:bg-white/10"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </header>
      )}
      <main className={isEmbed ? "mx-auto max-w-6xl px-0 pb-0 pt-0" : "mx-auto max-w-6xl px-3 sm:px-4 pb-16 pt-4 sm:pt-6"}>{children}</main>
      {!isEmbed && (
        <footer className="border-t border-white/10 bg-black/30">
          <div className="mx-auto max-w-6xl px-3 py-5 text-xs text-slate sm:px-4">
            <div className="mb-2 flex flex-wrap gap-x-4 gap-y-2">
              <Link to="/terms" className="hover:text-white">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link to="/refund" className="hover:text-white">Refund & Cancellation</Link>
              <Link to="/adult-notice" className="hover:text-white">18+ Notice</Link>
              <Link to="/compliance" className="hover:text-white">2257 Compliance</Link>
            </div>
            <p className="leading-relaxed text-slate/80">
              Mathieu Courchesne - OM43 | theo43.team | contact@theom43.team | +1 929 812 1653
              <br />
              1442 PIE-IX H1V2C1 MONTREAL QUEBEC CANADA
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

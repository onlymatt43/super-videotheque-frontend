import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayhipForm } from '../components/PayhipForm';
import { PreviewCarousel } from '../components/PreviewCarousel';
import { AIChat } from '../components/AIChat';
import { useSession } from '../features/session/useSession';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { codes, customerEmail } = useSession();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Calculer le temps restant pour les codes temporels
  const timeRemaining = useMemo(() => {
    if (codes.length === 0) return null;
    
    const now = Date.now();
    const timeCodes = codes.filter(c => c.grant.type === 'time' && c.grant.expiresAt);
    
    if (timeCodes.length === 0) return 'Permanent';
    
    // Trouver le code avec le plus de temps restant
    const longestTime = Math.max(...timeCodes.map(c => {
      const expires = new Date(c.grant.expiresAt!).getTime();
      return expires - now;
    }));
    
    if (longestTime <= 0) return 'Expiré';
    
    const minutes = Math.floor(longestTime / 60000);
    if (minutes < 60) return `${minutes} min restantes`;
    
    const hours = Math.floor(minutes / 60);
    return `${hours}h restantes`;
  }, [codes]);

  return (
    <div className="relative min-h-screen">
      {/* Background image or video */}
      <div className="fixed inset-0 z-0">
        {/* Try video first */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
        
        {/* Fallback to image */}
        <img
          src="/background.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        customerEmail && (
            <div className="w-full max-w-xl glass-panel rounded-2xl p-6 backdrop-blur">
              <p className="text-white font-medium mb-1">{customerEmail}</p>
              <p className="text-slate text-sm mb-4">{timeRemaining}</p>
              <button
                onClick={() => navigate('/catalog')}
                className="w-full rounded-lg bg-ember hover:bg-yellow-400 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-night shadow-glow transition"
              >
                Get Me In Again
          console.log('AI button clicked, opening chat');
          setIsChatOpen(true);
        }}
        className="fixed top-6 right-6 z-[100] flex h-10 w-10 items-center justify-center rounded-full bg-night-light text-ember transition-all hover:bg-ember hover:text-night hover:scale-110 shadow-glow pointer-events-auto"
        title="Assistant AI"
      >
        <img src="/ai-icon.png" alt="AI" className="h-6 w-6 pointer-events-none" />
      </button>

      {/* AI Chat Modal */}
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Content */}
      <div className="relative z-10">

        <section className="flex flex-col items-center justify-center gap-6 sm:gap-10 text-center px-2 min-h-screen">
          {codes.length > 0 && (
            <div className="w-full max-w-xl">
              <AccessManager />
              <button
                onClick={() => navigate('/catalog')}
                className="w-full mt-4 rounded-xl bg-green-600 hover:bg-green-700 px-6 py-3 text-center text-base font-semibold uppercase tracking-[0.3em] text-white shadow-glow transition"
              >
                Accéder au catalogue
              </button>
            </div>
          )}
          <PayhipForm />
        </section>
        
        <PreviewCarousel />
      </div>
    </div>
  );
};

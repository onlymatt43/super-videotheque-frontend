import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayhipForm } from '../components/PayhipForm';
import { PreviewCarousel } from '../components/PreviewCarousel';
import { AIChat } from '../components/AIChat';
// Access controls are now handled inside the AI chat modal
import { useSession } from '../features/session/useSession';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { getActiveAccess } = useSession();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const hasAccess = getActiveAccess().length > 0;

  useEffect(() => {
    if (hasAccess) {
      navigate('/catalog');
    }
  }, [hasAccess, navigate]);

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
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-night/90 via-night/80 to-night/95" />
      </div>
      {/* AI Chat Button: only after access */}
      {hasAccess && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed top-6 right-6 z-[100] flex h-10 w-10 items-center justify-center rounded-full bg-night-light text-ember transition-all hover:bg-ember hover:text-night hover:scale-110 shadow-glow pointer-events-auto"
          title="Assistant AI"
        >
          <img src="/ai-icon.png" alt="AI" className="h-6 w-6 pointer-events-none" />
        </button>
      )}

      {/* AI Chat Modal */}
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Content */}
      <div className="relative z-10">

        <section className="flex flex-col items-center justify-center gap-6 sm:gap-10 text-center px-2 min-h-screen">
          {!hasAccess && (
            <div className="w-full max-w-xl">
              <PayhipForm />
            </div>
          )}
          {hasAccess && (
            <div className="w-full max-w-xl">
              <button
                onClick={() => navigate('/catalog')}
                className="w-full mt-4 rounded-xl bg-green-600 hover:bg-green-700 px-6 py-3 text-center text-base font-semibold uppercase tracking-[0.3em] text-white shadow-glow transition"
              >
                Accéder au catalogue
              </button>
            </div>
          )}
        </section>
        
        {hasAccess && <PreviewCarousel />}
      </div>
    </div>
  );
};

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayhipForm } from '../components/PayhipForm';
import { PreviewCarousel } from '../components/PreviewCarousel';
import { AIChat } from '../components/AIChat';
import { AccessManager } from '../components/AccessManager';
import { useSession } from '../features/session/useSession';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { codes } = useSession();
  const [isChatOpen, setIsChatOpen] = useState(false);

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
        
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* AI Assistant button */}
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed top-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-night-light text-ember transition-all hover:bg-ember hover:text-night hover:scale-110 shadow-glow"
          title="Assistant AI"
        >
          <img src="/ai-icon.png" alt="AI" className="h-6 w-6" />
        </button>

        {/* AI Chat Modal */}
        <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

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

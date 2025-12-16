import { useState } from 'react';
import { PayhipForm } from '../components/PayhipForm';
import { PreviewCarousel } from '../components/PreviewCarousel';
import { AIChat } from '../components/AIChat';

export const LandingPage = () => {
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
          <span className="text-lg font-bold">?</span>
        </button>

        {/* AI Chat Modal */}
        <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

        <section className="flex flex-col items-center justify-center gap-6 sm:gap-10 text-center px-2 min-h-screen">
          {/* Logo only - no title */}
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-20 sm:h-32 w-auto object-contain drop-shadow-2xl"
          />
          
          <PayhipForm />
        </section>
        
        <PreviewCarousel />
      </div>
    </div>
  );
};

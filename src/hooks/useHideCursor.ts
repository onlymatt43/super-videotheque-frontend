import { useEffect } from 'react';

/**
 * Hook that hides the cursor after 1 second of inactivity
 * Cursor reappears on mouse/touch movement
 */
export const useHideCursor = () => {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    // Create style element for global cursor hiding
    const style = document.createElement('style');
    style.id = 'hide-cursor-style';
    style.textContent = `
      .cursor-hidden {
        cursor: none !important;
      }
      .cursor-hidden * {
        cursor: none !important;
      }
      /* Keep cursor visible for interactive elements */
      .cursor-hidden input,
      .cursor-hidden select,
      .cursor-hidden button,
      .cursor-hidden textarea,
      .cursor-hidden a,
      .cursor-hidden [role="button"],
      .cursor-hidden [contenteditable="true"] {
        cursor: auto !important;
      }
    `;
    document.head.appendChild(style);
    
    const hideCursor = () => {
      document.documentElement.classList.add('cursor-hidden');
    };
    
    const showCursor = () => {
      document.documentElement.classList.remove('cursor-hidden');
      
      // Clear any existing timeout
      clearTimeout(timeoutId);
      
      // Set new timeout to hide cursor after 100ms (almost instant)
      timeoutId = setTimeout(hideCursor, 100);
    };

    const handleMovement = () => {
      showCursor();
    };

    // Add event listeners for mouse and touch
    document.addEventListener('mousemove', handleMovement);
    document.addEventListener('mousedown', handleMovement);
    document.addEventListener('touchstart', handleMovement);
    document.addEventListener('touchmove', handleMovement);

    // Initial call to start the timeout
    showCursor();

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      document.documentElement.classList.remove('cursor-hidden');
      document.removeEventListener('mousemove', handleMovement);
      document.removeEventListener('mousedown', handleMovement);
      document.removeEventListener('touchstart', handleMovement);
      document.removeEventListener('touchmove', handleMovement);
      style.remove();
    };
  }, []);
};

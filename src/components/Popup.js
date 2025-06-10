import { useEffect, useRef } from 'react';

export default function Popup({ children, handleClose, className = '' }) {
  const popupRef = useRef();

  // Handle outside click, back button, and disable background scroll
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        handleClose();
        window.history.back()
        window.history.back()
      }
    };

    const handleBackButton = (e) => {
      e.preventDefault();
      handleClose();
      window.history.back()
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handleBackButton);

    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('popstate', handleBackButton);

      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="popup-overlay">
      <div className={`popup ${className}`} ref={popupRef}>
        <button className="close-button pointer" onClick={() => 
          {window.history.back(); window.history.back(); handleClose();}}>
            &times;</button>
        {children}
      </div>
    </div>
  );
}